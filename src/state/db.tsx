import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { PropsWithChildren } from 'react';
import { nanoid } from 'nanoid';
import type { Customer, DB, Hire, Tool } from '../lib/types';
import { localStorageFactory } from '../lib/storage/localStorage';
import type { StorageAdapter } from '../lib/storage';
import { seedData } from '../lib/seed';
import { todayISO, daysBetweenInclusive } from '../lib/date';
import { formatMoneyFromPence, sumMoney } from '../lib/money';

interface DBContextValue {
  db: DB;
  adapter: StorageAdapter;
  loading: boolean;
  createTool: (input: Omit<Tool, 'id' | 'createdAt'>) => void;
  updateTool: (id: string, updates: Partial<Tool>) => void;
  deleteTool: (id: string) => void;
  createCustomer: (input: Omit<Customer, 'id' | 'createdAt'>) => void;
  updateCustomer: (id: string, updates: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;
  createHire: (input: Omit<Hire, 'id' | 'createdAt' | 'status'>) => void;
  updateHireStatus: (id: string, updates: Partial<Hire>) => void;
  deleteHire: (id: string) => void;
  importData: (data: Partial<DB>) => void;
  reset: () => void;
}

const defaultDB: DB = seedData;

const DBContext = createContext<DBContextValue | undefined>(undefined);

export function DBProvider({ children }: PropsWithChildren) {
  const [adapter] = useState<StorageAdapter>(() => localStorageFactory.create());
  const [db, setDb] = useState<DB>(defaultDB);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    adapter
      .load()
      .then((data) => {
        if (!mounted) return;
        if (data) {
          setDb(data);
        }
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [adapter]);

  useEffect(() => {
    if (loading) return;
    adapter.save(db).catch((error) => {
      console.error('Failed to persist DB', error);
    });
  }, [adapter, db, loading]);

  useEffect(() => {
    if (loading) return;
    const today = todayISO();
    setDb((current) => {
      let changed = false;
      const hires = current.hires.map((hire) => {
        if (hire.status !== 'closed' && hire.dueDate < today && hire.status !== 'overdue') {
          changed = true;
          return { ...hire, status: 'overdue' };
        }
        if (hire.status === 'overdue' && hire.dueDate >= today) {
          changed = true;
          return { ...hire, status: 'open' };
        }
        return hire;
      });
      if (!changed) return current;
      return { ...current, hires };
    });
  }, [loading]);

  const value = useMemo<DBContextValue>(() => {
    const createTool = (input: Omit<Tool, 'id' | 'createdAt'>) => {
      setDb((current) => ({
        ...current,
        tools: [...current.tools, { ...input, id: nanoid(), createdAt: todayISO() }]
      }));
    };

    const updateTool = (id: string, updates: Partial<Tool>) => {
      setDb((current) => ({
        ...current,
        tools: current.tools.map((tool) => (tool.id === id ? { ...tool, ...updates } : tool))
      }));
    };

    const deleteTool = (id: string) => {
      setDb((current) => ({
        ...current,
        tools: current.tools.filter((tool) => tool.id !== id),
        hires: current.hires.filter((hire) => hire.toolId !== id)
      }));
    };

    const createCustomer = (input: Omit<Customer, 'id' | 'createdAt'>) => {
      setDb((current) => ({
        ...current,
        customers: [...current.customers, { ...input, id: nanoid(), createdAt: todayISO() }]
      }));
    };

    const updateCustomer = (id: string, updates: Partial<Customer>) => {
      setDb((current) => ({
        ...current,
        customers: current.customers.map((customer) =>
          customer.id === id ? { ...customer, ...updates } : customer
        )
      }));
    };

    const deleteCustomer = (id: string) => {
      setDb((current) => ({
        ...current,
        customers: current.customers.filter((customer) => customer.id !== id),
        hires: current.hires.filter((hire) => hire.customerId !== id)
      }));
    };

    const createHire = (input: Omit<Hire, 'id' | 'createdAt' | 'status'>) => {
      setDb((current) => ({
        ...current,
        hires: [
          ...current.hires,
          {
            ...input,
            id: nanoid(),
            status: 'open',
            createdAt: todayISO()
          }
        ],
        tools: current.tools.map((tool) =>
          tool.id === input.toolId ? { ...tool, status: 'hired' } : tool
        )
      }));
    };

    const updateHireStatus = (id: string, updates: Partial<Hire>) => {
      setDb((current) => {
        let affectedToolId: string | undefined;
        const hires = current.hires.map((hire) => {
          if (hire.id !== id) return hire;
          affectedToolId = hire.toolId;
          const next: Hire = { ...hire, ...updates };
          if (updates.status === 'closed') {
            const returnDate = updates.returnDate ?? todayISO();
            next.returnDate = returnDate;
            next.totalPricePence = calculateHireTotal(hire, returnDate);
          }
          return next;
        });

        const tools = current.tools.map((tool) => {
          if (tool.id !== affectedToolId) return tool;
          if (updates.status === 'closed') {
            return { ...tool, status: 'available' };
          }
          if (updates.status === 'open' || updates.status === 'overdue') {
            return { ...tool, status: 'hired' };
          }
          return tool;
        });

        return { ...current, hires, tools };
      });
    };

    const deleteHire = (id: string) => {
      setDb((current) => ({
        ...current,
        hires: current.hires.filter((hire) => hire.id !== id)
      }));
    };

    const importData = (data: Partial<DB>) => {
      setDb((current) => ({
        ...current,
        ...data,
        tools: data.tools ?? current.tools,
        customers: data.customers ?? current.customers,
        hires: data.hires ?? current.hires,
        maintenance: data.maintenance ?? current.maintenance,
        users: data.users ?? current.users
      }));
    };

    const reset = () => {
      setDb(seedData);
    };

    return {
      db,
      adapter,
      loading,
      createTool,
      updateTool,
      deleteTool,
      createCustomer,
      updateCustomer,
      deleteCustomer,
      createHire,
      updateHireStatus,
      deleteHire,
      importData,
      reset
    };
  }, [adapter, db, loading]);

  return <DBContext.Provider value={value}>{children}</DBContext.Provider>;
}

export function useDB() {
  const context = useContext(DBContext);
  if (!context) {
    throw new Error('useDB must be used within DBProvider');
  }
  return context;
}

export function useDashboardMetrics() {
  const { db } = useDB();
  const totalTools = db.tools.length;
  const availableTools = db.tools.filter((tool) => tool.status === 'available').length;
  const activeHires = db.hires.filter((hire) => hire.status !== 'closed').length;
  const revenue = sumMoney(
    db.hires
      .filter((hire) => hire.status === 'closed' && hire.totalPricePence)
      .map((hire) => hire.totalPricePence ?? 0)
  );

  return {
    totalTools,
    availableTools,
    activeHires,
    revenueFormatted: formatMoneyFromPence(revenue)
  };
}

export function calculateHireTotal(hire: Pick<Hire, 'startDate' | 'dailyRatePenceAtHire'>, returnDate: string) {
  const days = daysBetweenInclusive(hire.startDate, returnDate);
  return days * hire.dailyRatePenceAtHire;
}

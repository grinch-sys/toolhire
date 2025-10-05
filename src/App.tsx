import { NavLink, Outlet, Route, Routes } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import ToolsPage from './pages/ToolsPage';
import CustomersPage from './pages/CustomersPage';
import HiresPage from './pages/HiresPage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';

const navItems = [
  { to: '/', label: 'Dashboard' },
  { to: '/tools', label: 'Tools' },
  { to: '/customers', label: 'Customers' },
  { to: '/hires', label: 'Hires' },
  { to: '/reports', label: 'Reports' },
  { to: '/settings', label: 'Settings' }
];

function Layout() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">HireFlow</h1>
            <p className="text-sm text-slate-500">Tool hire operations dashboard</p>
          </div>
          <nav className="flex flex-wrap gap-2 md:gap-3">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-brand-100 text-brand-800'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`
                }
                end={item.to === '/'}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>
      <div className="mx-auto flex max-w-6xl flex-1 flex-col px-4 py-6">
        <Outlet />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<DashboardPage />} />
        <Route path="/tools" element={<ToolsPage />} />
        <Route path="/customers" element={<CustomersPage />} />
        <Route path="/hires" element={<HiresPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  );
}

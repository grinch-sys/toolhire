import type { DB } from '../types';
import type { StorageAdapter, StorageFactory } from './index';

/**
 * This adapter is a scaffold for integrating Supabase. It demonstrates the
 * structure you would use but does not execute any network requests. Replace
 * the placeholders with actual Supabase client calls when ready.
 */
class SupabaseAdapter implements StorageAdapter {
  // eslint-disable-next-line class-methods-use-this
  async load(): Promise<DB | null> {
    console.warn('Supabase adapter is not implemented. Falling back to empty state.');
    return null;
  }

  // eslint-disable-next-line class-methods-use-this
  async save(): Promise<void> {
    console.warn('Supabase adapter is not implemented.');
  }

  // eslint-disable-next-line class-methods-use-this
  async clear(): Promise<void> {
    console.warn('Supabase adapter is not implemented.');
  }
}

export const supabaseFactory: StorageFactory = {
  name: 'Supabase (scaffold)',
  description: 'Example configuration for future Supabase integration.',
  create: () => new SupabaseAdapter()
};

/**
 * Suggested SQL schema when implementing Supabase storage:
 *
 * ```sql
 * create table tools (
 *   id uuid primary key,
 *   name text not null,
 *   sku text,
 *   category text,
 *   daily_rate_pence integer not null,
 *   condition text,
 *   status text not null,
 *   last_serviced_date date,
 *   notes text,
 *   created_at date not null
 * );
 *
 * create table customers (
 *   id uuid primary key,
 *   name text not null,
 *   phone text,
 *   email text,
 *   company text,
 *   address text,
 *   notes text,
 *   created_at date not null
 * );
 *
 * create table hires (
 *   id uuid primary key,
 *   tool_id uuid references tools(id),
 *   customer_id uuid references customers(id),
 *   start_date date not null,
 *   due_date date not null,
 *   return_date date,
 *   daily_rate_pence_at_hire integer not null,
 *   deposit_pence integer not null,
 *   status text not null,
 *   total_price_pence integer,
 *   notes text,
 *   created_at date not null
 * );
 * ```
 */

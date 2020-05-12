import { Store } from '@interfaces/Store';
import { createContext, Context } from 'preact';

export const StoreContext: Context<Store> = createContext(null as any);
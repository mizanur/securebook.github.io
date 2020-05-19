import { createContext, Context } from 'preact';
import { Store } from '@interfaces/Store';

export const StoreContext: Context<Store> = createContext(null as any);
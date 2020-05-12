import { Managers } from '@interfaces/Managers';
import { createContext, Context } from 'preact';

export const ManagersContext: Context<Managers> = createContext(null as any);
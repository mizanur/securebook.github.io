import { createContext, Context } from 'preact';
import { Managers } from '@interfaces/Managers';

export const ManagersContext: Context<Managers> = createContext(null as any);
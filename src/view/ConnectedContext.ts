import { createContext, Context } from 'preact';
import { Connected } from '@interfaces/Connected';

export const ConnectedContext: Context<Connected> = createContext(null as any);
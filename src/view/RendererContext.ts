import { createContext, Context } from 'preact';
import { createRenderer } from '@data/createRenderer';

export const RendererContext: Context<typeof createRenderer> = createContext(null as any);
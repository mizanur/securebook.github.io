import { createContext, Context } from 'preact';
import { ConnectedRender } from '@view/ConnectedRender';

export const ConnectedRenderContext: Context<typeof ConnectedRender> = createContext(null as any);
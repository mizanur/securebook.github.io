import { h, render, hydrate } from 'preact';
import { StoreContext } from "@view/StoreContext";
import { ManagersContext } from "@view/ManagersContext";
import App from '@components/App';
import { createApp } from '../createApp';
import { connectFactory } from 'typeconnect';
import { defineWindowApp } from '@view/defineWindowApp';
import { RendererContext } from '@view/RendererContext';
import { configureConnect } from '@view/configureConnect';
import { createRenderer } from '@data/createRenderer';
import { Managers } from '@interfaces/Managers';
import { Store } from '@interfaces/Store';

type AppWithWrappersProps = {
	createConnectedRenderer: typeof createRenderer,
	store: Store,
	managers: Managers
}

function AppWithWrappers({ createConnectedRenderer, store, managers }: AppWithWrappersProps) {
	return (
		<RendererContext.Provider value={createConnectedRenderer}>
			<StoreContext.Provider value={store}>
				<ManagersContext.Provider value={managers}>
					<App />
				</ManagersContext.Provider>
			</StoreContext.Provider>
		</RendererContext.Provider>
	);
}

type FirstRenderData = {
	parent: HTMLElement,
	appProps: AppWithWrappersProps,
}

let firstRenderData: FirstRenderData;

export function renderApp(parent: HTMLElement) {
	// It looks like the fix for rerendering is in the works
	// https://github.com/preactjs/preact/issues/2004
	// after which we'll be able to rerender while preserving local state
	// rather than totally unrendering and then rerendering, which works for now
	
	if (parent.firstElementChild) {
		render('', parent, parent.firstElementChild);
		render(
			<AppWithWrappers {...firstRenderData.appProps} />,
			parent
		);
	}
	else {
		configureConnect();
		const [store, managers] = createApp();
		const createConnectedRenderer = connectFactory(createRenderer);
		defineWindowApp(store, managers);

		firstRenderData = {
			parent,
			appProps: {
				createConnectedRenderer,
				store,
				managers
			}
		};

		render(
			<AppWithWrappers {...firstRenderData.appProps} />,
			parent
		);
	}
}

if (process.env.NODE_ENV === 'development' && module.hot) {
	module.hot.accept('@components/App', function() {
		if (firstRenderData) {
			renderApp(firstRenderData.parent);
		}
		else {
			(module.hot as any).invalidate();
		}
	});
}
import { h, render } from 'preact';
import { StoreContext } from "@view/StoreContext";
import { ManagersContext } from "@view/ManagersContext";
import App from '@components/App';
import { createApp } from '@view/createApp';
import { defineWindowApp } from '@view/defineWindowApp';
import { ConnectedContext } from '@view/ConnectedContext';
import { configureConnect } from '@view/configureConnect';
import { Managers } from '@interfaces/Managers';
import { Store } from '@interfaces/Store';
import { Connected } from '@interfaces/Connected';
import { PortalValue, PortalValueContext } from '@view/PortalValueContext';

type AppWithWrappersProps = {
	connected: Connected,
	store: Store,
	managers: Managers
}

function AppWithWrappers({ connected, store, managers }: AppWithWrappersProps) {
	return (
		<PortalValueContext.Provider value={{} as PortalValue}>
			<ConnectedContext.Provider value={connected}>
				<StoreContext.Provider value={store}>
					<ManagersContext.Provider value={managers}>
						<App />
					</ManagersContext.Provider>
				</StoreContext.Provider>
			</ConnectedContext.Provider>
		</PortalValueContext.Provider>
	);
}

type FirstRenderData = {
	parent: HTMLElement,
	appProps: AppWithWrappersProps,
}

let firstRenderData: FirstRenderData;

export function renderApp(parent: HTMLElement) {
	// TODO: It looks like the fix for rerendering is in the works
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
		const [connected, store, managers] = createApp();
		defineWindowApp(store, managers);

		firstRenderData = {
			parent,
			appProps: {
				connected,
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
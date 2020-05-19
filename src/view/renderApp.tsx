import { h, render } from 'preact';
import { StoreContext } from "@view/StoreContext";
import { ManagersContext } from "@view/ManagersContext";
import App from '@components/App';
import { createApp } from '../createApp';
import { connect } from 'typeconnect';
import { ConnectedRender } from '@view/ConnectedRender';
import { defineWindowApp } from '@view/defineWindowApp';
import { ConnectedRenderContext } from '@view/ConnectedRenderContext';
import { configureConnect } from '@view/configureConnect';

export function renderApp(root: HTMLElement) {
	configureConnect();
	const [store, managers] = createApp();
	const ConnectedRenderConn = connect(ConnectedRender);
	defineWindowApp(store, managers);

	render(
		<ConnectedRenderContext.Provider value={ConnectedRenderConn}>
			<StoreContext.Provider value={store}>
				<ManagersContext.Provider value={managers}>
					<App />
				</ManagersContext.Provider>
			</StoreContext.Provider>
		</ConnectedRenderContext.Provider>,
		root
	);
}
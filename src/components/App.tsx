import { h } from 'preact';
import { useStore } from '@hooks/useStore';
import { render as renderPreact } from 'preact';
import { StoreContext } from "@context/StoreContext";
import { ManagersContext } from "@context/ManagersContext";
import { createApp } from '../createApp';
import { useManager } from '@hooks/useManager';
import { forNum } from '@utils/iteration';
import { Input } from '@components/Input';

function App() {
	const partsManager = useManager('parts');
	const state = useStore(store => ({
		itemTypes: store.parts.itemTypes,
		itemCosts: store.parts.itemCosts,
		itemPrices: store.parts.itemPrices,
		itemsProduced: store.parts.itemsProduced,
		itemsSold: store.parts.itemsSold,
		costBreakdown: store.business.costBreakdown,
		totalCost: store.business.totalCost,
		revenueBreakdown: store.business.revenueBreakdown, 
		totalRevenue: store.business.totalRevenue,
		profit: store.business.profit
	}));

	return <div>
		<h1>Parts</h1>
		<button onClick={() => partsManager.addItemType()}>Add item type</button><br />
		{
			forNum(state.itemTypes, i =>
				<p>
					<button onClick={() => partsManager.removeItemType(i)}>Remove item type</button><br />
					Item cost: <Input type="number" value={state.itemCosts[i]} onInput={
						ev => partsManager.setItemTypeCost(i, Number(ev.currentTarget.value))} /><br />
					Item price: <Input type="number" value={state.itemPrices[i]} onInput={
						ev => partsManager.setItemTypePrice(i, Number(ev.currentTarget.value))} /><br />
					Items produced: <Input type="number" value={state.itemsProduced[i]} onInput={
						ev => partsManager.setItemsProduced(i, Number(ev.currentTarget.value))} /><br />
					Items sold: <Input type="number" value={state.itemsSold[i]} onInput={
						ev => partsManager.setItemsSold(i, Number(ev.currentTarget.value))} />
				</p>
			)
		}
		<h1>Business</h1>
		<p>
			Total cost: {state.costBreakdown} = {state.totalCost}<br />
			Total revenue: {state.revenueBreakdown} = {state.totalRevenue}<br />
			Profit: {state.profit}
		</p>
	</div>
}

export function render(root: HTMLElement) {
	const [store, managers] = createApp();
	renderPreact(
		<StoreContext.Provider value={store}>
			<ManagersContext.Provider value={managers}>
				<App />
			</ManagersContext.Provider>
		</StoreContext.Provider>,
		root
	);
}
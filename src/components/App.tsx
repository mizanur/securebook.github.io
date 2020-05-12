import { h } from 'preact';
import { useData } from "@hooks/useData";
import { render as renderPreact } from 'preact';
import { StoreContext } from "@context/StoreContext";
import { ManagersContext } from "@context/ManagersContext";
import { createApp } from '../createApp';
import { useManager } from '@hooks/useManager';
import { forNum } from '@utils/iteration';

function App() {
	const parts = useData('parts');
	const business = useData('business');
	const partsManager = useManager('parts');

	return <div>
		<h1>Parts</h1>
		<button onClick={() => partsManager.addItemType()}>Add item type</button><br />
		{
			forNum(parts.itemTypes, i =>
				<p>
					<button onClick={() => partsManager.removeItemType(i)}>Remove item type</button><br />
					Item cost: <input type="number" value={parts.itemCosts[i]} onInput={
						ev => partsManager.setItemTypeCost(i, Number(ev.currentTarget.value))} /><br />
					Item price: <input type="number" value={parts.itemPrices[i]} onInput={
						ev => partsManager.setItemTypePrice(i, Number(ev.currentTarget.value))} /><br />
					Items produced: <input type="number" value={parts.itemsProduced[i]} onInput={
						ev => partsManager.setItemsProduced(i, Number(ev.currentTarget.value))} /><br />
					Items sold: <input type="number" value={parts.itemsSold[i]} onInput={
						ev => partsManager.setItemsSold(i, Number(ev.currentTarget.value))} />
				</p>
			)
		}
		<h1>Business</h1>
		<p>
			Total cost: {business.costBreakdown} = {business.totalCost}<br />
			Total revenue: {business.revenueBreakdown} = {business.totalRevenue}<br />
			Profit: {business.profit}
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
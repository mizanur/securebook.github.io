import { h } from 'preact';
import { connect } from '@view/connect';
import { StoreContext } from "@view/StoreContext";
import { ManagersContext } from "@view/ManagersContext";
import { forNum } from '@utils/iteration';
import Input from '@components/Input';
import { useContext } from 'preact/hooks';
import '@styles/MainView.scss';

function MainView() {
	const manager = useContext(ManagersContext);
	const store = useContext(StoreContext);

	return <div>
		<h1 className='MainView__header'>Parts</h1>
		<button onClick={() => manager.parts.addItemType()}>Add item type</button><br />
		{
			forNum(store.parts.itemTypes, i =>
				<p>
					<button onClick={() => manager.parts.removeItemType(i)}>Remove item type</button><br />
					Item cost: <Input type="number" value={store.parts.itemCosts[i]} onInput={
						ev => manager.parts.setItemTypeCost(i, Number(ev.currentTarget.value))} /><br />
					Item price: <Input type="number" value={store.parts.itemPrices[i]} onInput={
						ev => manager.parts.setItemTypePrice(i, Number(ev.currentTarget.value))} /><br />
					Items produced: <Input type="number" value={store.parts.itemsProduced[i]} onInput={
						ev => manager.parts.setItemsProduced(i, Number(ev.currentTarget.value))} /><br />
					Items sold: <Input type="number" value={store.parts.itemsSold[i]} onInput={
						ev => manager.parts.setItemsSold(i, Number(ev.currentTarget.value))} />
				</p>
			)
		}
		<h1 className='MainView__header'>Business</h1>
		<p>
			Total cost: {store.business.costBreakdown} = {store.business.totalCost}<br />
			Total revenue: {store.business.revenueBreakdown} = {store.business.totalRevenue}<br />
			Profit: {store.business.profit}
		</p>
	</div>
}

export default connect(MainView);
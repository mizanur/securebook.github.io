import { Parts } from '@interfaces/Parts';
import { PartsManager as IPartsManager } from '@interfaces/PartsManager';
import { withRemovedItem, withSetItem, withPush } from '@utils/array';

export class PartsManager implements IPartsManager {
	private readonly parts: Parts;

	constructor(parts: Parts) {
		this.parts = parts;
	}

	addItemType() {
		this.parts.itemTypes += 1;
		this.parts.itemCosts = withPush(this.parts.itemCosts, 0);
		this.parts.itemPrices = withPush(this.parts.itemPrices, 0);
		this.parts.itemsProduced = withPush(this.parts.itemsProduced, 0);
		this.parts.itemsSold = withPush(this.parts.itemsSold, 0);
	}

	removeItemType(index: number) {
		this.parts.itemTypes -= 1;
		this.parts.itemCosts = withRemovedItem(this.parts.itemCosts, index);
		this.parts.itemPrices = withRemovedItem(this.parts.itemPrices, index);
		this.parts.itemsProduced = withRemovedItem(this.parts.itemsProduced, index);
		this.parts.itemsSold = withRemovedItem(this.parts.itemsSold, index);
	}

	setItemTypeCost(index: number, cost: number) {
		this.parts.itemCosts = withSetItem(this.parts.itemCosts, index, cost);
	}

	setItemTypePrice(index: number, price: number) {
		this.parts.itemPrices = withSetItem(this.parts.itemPrices, index, price);
	}

	setItemsProduced(index: number, itemsProduced: number) {
		this.parts.itemsProduced = withSetItem(this.parts.itemsProduced, index, itemsProduced);
	}

	setItemsSold(index: number, itemsSold: number) {
		this.parts.itemsSold = withSetItem(this.parts.itemsSold, index, itemsSold);
	}
}
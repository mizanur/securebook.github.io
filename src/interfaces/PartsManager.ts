export interface PartsManager {
	addItemType();
	removeItemType(index: number);
	setItemTypeCost(index: number, cost: number);
	setItemTypePrice(index: number, price: number);
	setItemsProduced(index: number, itemsProduced: number);
	setItemsSold(index: number, itemsProduced: number);
}
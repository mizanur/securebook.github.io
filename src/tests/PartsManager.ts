import test from "ava";
import { Parts } from "@interfaces/Parts";
import { PartsManager } from "@modules/PartsManager";

type TestContext = {
	parts: Parts
};

test.beforeEach(t => {
	t.context = {
		parts: {
			itemTypes: 2,
			itemCosts: [100, 200],
			itemPrices: [200, 400],
			itemsProduced: [5, 10],
			itemsSold: [3, 7],
		}
	};
});

test(`Add item type`, t => {
	const parts = (t.context as TestContext).parts;
	const partsManager = new PartsManager(parts);
	const { itemCosts, itemPrices, itemTypes, itemsProduced, itemsSold } = parts;

	partsManager.addItemType();

	t.assert(parts.itemTypes === 3);
	t.assert(parts.itemCosts.length === 3);
	t.assert(parts.itemPrices.length === 3);
	t.assert(parts.itemsProduced.length === 3);
	t.assert(parts.itemsSold.length === 3);

	t.assert(parts.itemTypes !== itemTypes);
	t.assert(parts.itemCosts !== itemCosts);
	t.assert(parts.itemPrices !== itemPrices);
	t.assert(parts.itemsProduced !== itemsProduced);
	t.assert(parts.itemsSold !== itemsSold);
});

test(`Remove item type`, t => {
	const parts = (t.context as TestContext).parts;
	const partsManager = new PartsManager(parts);
	const { itemCosts, itemPrices, itemTypes, itemsProduced, itemsSold } = parts;

	partsManager.removeItemType(1);

	t.assert(parts.itemTypes === 1);
	t.assert(parts.itemCosts.length === 1);
	t.assert(parts.itemPrices.length === 1);
	t.assert(parts.itemsProduced.length === 1);
	t.assert(parts.itemsSold.length === 1);

	t.assert(parts.itemTypes !== itemTypes);
	t.assert(parts.itemCosts !== itemCosts);
	t.assert(parts.itemPrices !== itemPrices);
	t.assert(parts.itemsProduced !== itemsProduced);
	t.assert(parts.itemsSold !== itemsSold);
});

test(`Set item cost`, t => {
	const parts = (t.context as TestContext).parts;
	const partsManager = new PartsManager(parts);
	const { itemCosts } = parts;

	partsManager.setItemTypeCost(1, 300);
	t.assert(parts.itemCosts !== itemCosts);
	t.assert(parts.itemCosts[1] === 300);
});

test(`Set item price`, t => {
	const parts = (t.context as TestContext).parts;
	const partsManager = new PartsManager(parts);
	const { itemPrices } = parts;

	partsManager.setItemTypePrice(0, 500);
	t.assert(parts.itemPrices !== itemPrices);
	t.assert(parts.itemPrices[0] === 500);
});

test(`Set items produced`, t => {
	const parts = (t.context as TestContext).parts;
	const partsManager = new PartsManager(parts);
	const { itemsProduced } = parts;

	partsManager.setItemsProduced(1, 20);
	t.assert(parts.itemsProduced !== itemsProduced);
	t.assert(parts.itemsProduced[1] === 20);
});

test(`Cannot set items produced to less than sold`, t => {
	const parts = (t.context as TestContext).parts;
	const partsManager = new PartsManager(parts);
	const { itemsProduced } = parts;

	partsManager.setItemsProduced(0, 2);
	t.assert(parts.itemsProduced === itemsProduced);
	t.assert(parts.itemsProduced[0] === 5);
});

test(`Set items sold`, t => {
	const parts = (t.context as TestContext).parts;
	const partsManager = new PartsManager(parts);
	const { itemsSold } = parts;

	partsManager.setItemsSold(0, 4);
	t.assert(parts.itemsSold !== itemsSold);
	t.assert(parts.itemsSold[0] === 4);
});

test(`Cannot set items sold to more than produced`, t => {
	const parts = (t.context as TestContext).parts;
	const partsManager = new PartsManager(parts);
	const { itemsSold } = parts;

	partsManager.setItemsSold(1, 12);
	t.assert(parts.itemsSold === itemsSold);
	t.assert(parts.itemsSold[1] === 7);
});
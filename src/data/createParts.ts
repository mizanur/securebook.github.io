import { Parts } from "@interfaces/Parts";

export function createParts(): Parts {
	return {
		itemTypes: 2,
		itemCosts: [100, 200],
		itemPrices: [150, 300],
		itemsProduced: [5, 4],
		itemsSold: [2, 2],
	}
}
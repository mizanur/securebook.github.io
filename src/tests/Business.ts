import test from 'ava';
import { createBusiness } from "@data/createBusiness";

test(`Business is functioning`, t => {
	const business = createBusiness({
		itemTypes: 2,
		itemCosts: [100, 200],
		itemPrices: [200, 400],
		itemsProduced: [5, 10],
		itemsSold: [3, 7],
	});

	t.assert(business.costBreakdown === `5 * 100 + 10 * 200`);
	t.assert(business.totalCost === 2500);
	t.assert(business.revenueBreakdown === `3 * 200 + 7 * 400`);
	t.assert(business.totalRevenue === 3400);
	t.assert(business.profit === 900);
});
import { Business } from '@interfaces/Business';
import { Parts } from '@interfaces/Parts';

export function createBusiness(parts: Parts): Business {
	
	return {
		get totalCost() {
			let cost = 0;

			for (let i = 0; i < parts.itemTypes; i++) {
				cost += parts.itemsProduced[i] * parts.itemCosts[i];
			}
			
			return cost;
		},

		get costBreakdown() {
			let costBreakdown = ``;

			for (let i = 0; i < parts.itemTypes; i++) {
				costBreakdown += `${parts.itemsProduced[i]} * ${parts.itemCosts[i]}`;

				if (i !== parts.itemTypes - 1) {
					costBreakdown += ` + `
				}
			}
			
			return costBreakdown;
		},

		get totalRevenue() {
			let revenue = 0;

			for (let i = 0; i < parts.itemTypes; i++) {
				revenue += parts.itemsSold[i] * parts.itemPrices[i];
			}
			
			return revenue;
		},

		get revenueBreakdown() {
			let revenueBreakdown = ``;

			for (let i = 0; i < parts.itemTypes; i++) {
				revenueBreakdown += `${parts.itemsSold[i]} * ${parts.itemPrices[i]}`;

				if (i !== parts.itemTypes - 1) {
					revenueBreakdown += ` + `
				}
			}
			
			return revenueBreakdown;
		},

		get profit() {
			return this.totalRevenue - this.totalCost;
		}
	}
}
import { Business as IBusiness } from '@interfaces/Business';
import { Parts } from '@interfaces/Parts';

export class Business implements IBusiness {
	parts: Parts;
	
	constructor(parts: Parts) {
		this.parts = parts;
	}

	get totalCost() {
		let cost = 0;

		for (let i = 0; i < this.parts.itemTypes; i++) {
			cost += this.parts.itemsProduced[i] * this.parts.itemCosts[i];
		}
		
		return cost;
	}

	get costBreakdown() {
		let costBreakdown = ``;

		for (let i = 0; i < this.parts.itemTypes; i++) {
			costBreakdown += `${this.parts.itemsProduced[i]} * ${this.parts.itemCosts[i]}`;

			if (i !== this.parts.itemTypes - 1) {
				costBreakdown += ` + `
			}
		}
		
		return costBreakdown;
	}

	get totalRevenue() {
		let revenue = 0;

		for (let i = 0; i < this.parts.itemTypes; i++) {
			revenue += this.parts.itemsSold[i] * this.parts.itemPrices[i];
		}
		
		return revenue;
	}

	get revenueBreakdown() {
		let revenueBreakdown = ``;

		for (let i = 0; i < this.parts.itemTypes; i++) {
			revenueBreakdown += `${this.parts.itemsSold[i]} * ${this.parts.itemPrices[i]}`;

			if (i !== this.parts.itemTypes - 1) {
				revenueBreakdown += ` + `
			}
		}
		
		return revenueBreakdown;
	}

	get profit() {
		return this.totalRevenue - this.totalCost;
	}
}
import { Renderer } from "@interfaces/Renderer";

export function createRenderer(): Renderer {
	return {
		isStopped: false,
		calculation: null,
		onCalculationChanged() {
			if (!this.isStopped && this.calculation) {
				if (this.calculation.isInitialRender) {
					this.calculation.perform();
					this.calculation.isInitialRender = false;
				}
				else {
					this.calculation.onUpdate();
				}
			}
		}
	}
}
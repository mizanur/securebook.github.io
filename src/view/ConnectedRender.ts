export class ConnectedRender {
	public isStopped: boolean = false;
	public calculation: null | {
		isInitialRender: boolean,
		perform: () => void;
		onUpdate: () => void;
	} = null;
	
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
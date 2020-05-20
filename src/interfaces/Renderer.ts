export interface Renderer {
	isStopped: boolean;

	calculation: null | {
		isInitialRender: boolean,
		perform: () => void;
		onUpdate: () => void;
	}

	onCalculationChanged(): void;
}
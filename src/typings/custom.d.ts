declare module "*.worker" {
	class WebpackWorker extends Worker {
		constructor();
	}

	export default WebpackWorker;
}

declare module '*.svg';
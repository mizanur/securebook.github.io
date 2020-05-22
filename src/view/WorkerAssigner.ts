import { Worker } from "@interfaces/Worker";

export class WorkerAssigner {
	private readonly worker: Worker;

	constructor(worker: Worker) {
		this.worker = worker;
		self.addEventListener('message', this.processDataAndSendBackResult);
	}

	processDataAndSendBackResult = async (e: MessageEvent) => {
		const { data } = e;
		const result = await this.worker.processData(data);
		if (result !== undefined) {
			// @ts-ignore: Typescript has an error because it doesn't know this is inside a worker
			self.postMessage(result);
		}
	}
}
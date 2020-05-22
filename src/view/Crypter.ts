import { Crypter as ICrypter } from "@interfaces/Crypter";
import { getRequestId } from "@utils/crypter";
import { EncryptData, EncryptError, DecryptData, DecryptError, EncryptResult, DecryptResult } from "@interfaces/CryptoWorker";

export class Crypter implements ICrypter {
	private readonly worker: Worker;

	constructor() {
		this.worker = new Worker('/crypto-worker.js');
	}

	private crypt(actionType: 'encrypt' | 'decrypt', text: string, hash: number[]): Promise<string> {
		return new Promise((resolve, reject) => {
			const requestId = getRequestId();
			const listener = this.createEventListener(
				requestId,
				actionType,
				resolve,
				reject
			);
			this.worker.addEventListener('message', listener);
			const data: EncryptData | DecryptData = {
				action: actionType as any,
				requestId,
				text,
				hash
			};
			this.worker.postMessage(data);
		});
	}

	private createEventListener(
		requestId: number,
		actionType: 'encrypt' | 'decrypt',
		resolve: (result: string) => void,
		reject: (result: string) => void
	): (e: MessageEvent) => void {
		const listener = (e: MessageEvent) => {
			const data: EncryptResult | EncryptError | DecryptResult | DecryptError = e.data;
			if (data.requestId === requestId) {
				if (data.type === `${actionType}-result`) {
					this.worker.removeEventListener('message', listener);
					resolve(data.result);
				}
				else if(data.type === `${actionType}-error`) {
					this.worker.removeEventListener('message', listener);
					reject(data.result);
				}
			}
		};
		return listener;
	}

	encrypt(text: string, hash: number[]) {
		return this.crypt('encrypt', text, hash);
	}

	decrypt(text: string, hash: number[]) {
		return this.crypt('decrypt', text, hash);
	}
}
import aesjs from "aes-js";
import { getRandom } from "@utils/random";
import { DecryptData, EncryptData, EncryptResult, DecryptResult, EncryptError, DecryptError } from "@interfaces/CryptoWorker";
import { Worker } from "@interfaces/Worker";

export class CryptoWorker implements Worker {
	async processData(data: EncryptData | DecryptData): Promise<EncryptResult | EncryptError | DecryptResult | DecryptError | void> {
		if (data.action === 'encrypt') {
			return Promise.resolve(this.getEncryptOrErrorMessage(data));
		}
		if (data.action === 'decrypt') {
			return Promise.resolve(this.getDecryptOrErrorMessage(data));
		}
	}

	private getEncryptOrErrorMessage(data: EncryptData): EncryptResult | EncryptError {
		try {
			const result = this.encrypt(data);
			const resultMessage: EncryptResult = {
				type: 'encrypt-result',
				result,
				requestId: data.requestId,
			};
			return resultMessage;
		}
		catch (error) {
			const errorResult: EncryptError = {
				type: 'encrypt-error',
				result: error.toString(),
				requestId: data.requestId,
			};
			return errorResult;
		}
	}

	private getDecryptOrErrorMessage(data: DecryptData): DecryptResult | DecryptError {
		try {
			const result = this.decrypt(data);
			const resultMessage: DecryptResult = {
				type: 'decrypt-result',
				result,
				requestId: data.requestId,
			};
			return resultMessage;
		}
		catch (error) {
			const errorResult: DecryptError = {
				type: 'decrypt-error',
				result: error.toString(),
				requestId: data.requestId,
			};
			return errorResult;
		}
	}

	private encrypt(data: EncryptData): string {
		const counter = getRandom(0, 255);
		const aesCtr = new aesjs.Counter(counter);
		const textBytes = aesjs.utils.utf8.toBytes(data.text);
		const aesCbc = new aesjs.ModeOfOperation.ctr(data.hash, aesCtr);
		const encryptedBytes = aesCbc.encrypt(textBytes);
		const encryptedHex = aesjs.utils.hex.fromBytes(encryptedBytes);
		return `${counter};${encryptedHex}`;
	}

	private decrypt(data: DecryptData): string {
		const [ counter, contentHex ] = data.text.split(';');
		const aesCtr = new aesjs.Counter(Number(counter));
		const encryptedBytes = aesjs.utils.hex.toBytes(contentHex);
		const aesCbc = new aesjs.ModeOfOperation.ctr(data.hash, aesCtr);
		const decryptedBytes = aesCbc.decrypt(encryptedBytes);
		const decryptedText = aesjs.utils.utf8.fromBytes(decryptedBytes);
		return decryptedText;
	}
}
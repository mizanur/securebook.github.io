import test, { beforeEach } from "ava";
import { CryptoWorker } from "@modules/CryptoWorker";

type TestContext = {
	cryptoWorker: CryptoWorker,
	text: string,
	hash: number[],
	incorrectHash: number[],
};

beforeEach(t => {
	const context: TestContext = {
		cryptoWorker: new CryptoWorker(),
		text: `So, this is a test of some sort. Here are some special chars:\r\n\r\n123,;'./[]\`!@#$%^&*()_+{}|:"<>?`,
		hash: [
			0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
			16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28,
			29, 30, 31
		],
		incorrectHash: [
			1, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
			16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28,
			29, 30, 31
		]
	};
	t.context = context;
});

test(`Encryption follows correct pattern`, async t => {
	const { cryptoWorker, text, hash } = t.context as TestContext;
	const response = await cryptoWorker.processData({
		action: 'encrypt',
		text,
		hash,
		requestId: 19
	});
	t.assert(response);
	if (response) {
		t.assert(response.requestId === 19);
		t.assert(response.type === 'encrypt-result');
		t.assert(/^\d+;[0-9a-z]+$/.test(response.result));
	}
});

test(`Encrypted text cannot be decrypted with wrong hash`, async t => {
	const { cryptoWorker, text, hash, incorrectHash } = t.context as TestContext;
	const encryptedResponse = await cryptoWorker.processData({
		action: 'encrypt',
		text,
		hash,
		requestId: 20
	});
	t.assert(encryptedResponse);
	if (encryptedResponse) {
		const decryptedResponse = await cryptoWorker.processData({
			action: 'decrypt',
			text: encryptedResponse.result,
			hash: incorrectHash,
			requestId: 21
		});
		t.assert(decryptedResponse);
		if (decryptedResponse) {
			t.assert(decryptedResponse.requestId === 21);
			t.assert(decryptedResponse.type === 'decrypt-result');
			t.assert(decryptedResponse.result !== text);
		}
	}
});

test(`Encrypted text can be decrypted with correct hash`, async t => {
	const { cryptoWorker, text, hash } = t.context as TestContext;
	const encryptedResponse = await cryptoWorker.processData({
		action: 'encrypt',
		text,
		hash,
		requestId: 22
	});
	t.assert(encryptedResponse);
	if (encryptedResponse) {
		const decryptedResponse = await cryptoWorker.processData({
			action: 'decrypt',
			text: encryptedResponse.result,
			hash,
			requestId: 23
		});
		t.assert(decryptedResponse);
		if (decryptedResponse) {
			t.assert(decryptedResponse.result === text);
		}
	}
});
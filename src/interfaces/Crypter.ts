export interface Crypter {
	encrypt(text: string, hash: number[]): Promise<string>;
	decrypt(text: string, hash: number[]): Promise<string>;
}
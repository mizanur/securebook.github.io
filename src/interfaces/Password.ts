export interface Password {
	status: 'not provided' | 'provided' | 'verified' | 'incorrect',

	value: string,

	hash: number[]
}
export type EncryptData = {
    action: 'encrypt',
    text: string,
    hash: number[]
    requestId: number
};

export type DecryptData = {
    action: 'decrypt',
    text: string,
    hash: number[]
    requestId: number
};

export type EncryptResult = {
    type: 'encrypt-result',
    result: string,
    requestId: number,
};

export type DecryptResult = {
    type: 'decrypt-result',
    result: string,
    requestId: number,
};

export type EncryptError = {
    type: 'encrypt-error',
    result: string,
    requestId: number,
};

export type DecryptError = {
    type: 'decrypt-error',
    result: string,
    requestId: number,
};
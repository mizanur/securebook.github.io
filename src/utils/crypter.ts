let crypterRequestId = 0;

export function getRequestId(): number {
	return crypterRequestId++;
}
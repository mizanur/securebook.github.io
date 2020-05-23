import { Request as IRequest } from "@interfaces/Request";

export class Request implements IRequest {
	async fetch(input: RequestInfo, init?: RequestInit) {
		return await fetch(input, init);
	}
}
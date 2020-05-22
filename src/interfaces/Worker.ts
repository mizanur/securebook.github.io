export interface Worker {
	processData(data: any): Promise<any>;
}
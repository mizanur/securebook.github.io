export type QueryFromString = {
	[k: string]: string | string[] | null | undefined
}

export type QueryToString = {
	[key: string]: unknown
};

export interface QueryBuilder {
	getStringFromQuery(query: QueryToString): string;
	getQueryFromString(string: string): QueryFromString;
}
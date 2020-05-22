export interface QueryParameters {
	[key: string]: string;
}

export interface Location {
	location: Window['location']
	pathname: string;
	query: QueryParameters;
}
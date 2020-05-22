import { Location } from "@interfaces/Location";
import { QueryBuilder } from "@interfaces/QueryBuilder";

export function createLocation(queryBuilder: QueryBuilder): Location {
	return {
		location: window.location,
	
		get pathname() {
			return this.location.pathname;
		},
	
		get query() {
			const { search, hash } = this.location;
			const searchQuery: any = queryBuilder.getQueryFromString(search) || {};
			const hashQuery: any = queryBuilder.getQueryFromString(hash) || {};
			return {
				...searchQuery,
				...hashQuery
			}
		}
	}
}
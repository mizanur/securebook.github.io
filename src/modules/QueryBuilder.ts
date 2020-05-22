import { parse, stringify } from "query-string";
import { QueryToString, QueryFromString, QueryBuilder as IQueryBuilder } from "@interfaces/QueryBuilder";

export class QueryBuilder implements IQueryBuilder {
    getStringFromQuery(query: QueryToString): string {
        return stringify(query);
    }
    
    getQueryFromString(string: string): QueryFromString {
        return parse(string);
    }
}
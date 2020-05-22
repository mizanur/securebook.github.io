import test from "ava";
import { QueryBuilder } from "@modules/QueryBuilder";

test('getStringFromQuery converts url query object to string', t => {
	const queryBuilder = new QueryBuilder();
	const query = { happy: 'birthday', hello: 'world' };
	const expectedResult = "happy=birthday&hello=world";
	t.assert(queryBuilder.getStringFromQuery(query) === expectedResult);
});

test('getQueryFromString converts url query string to object', t => {
	const queryBuilder = new QueryBuilder();
	const string = "happy=birthday&hello=world";
	const expectedResult = { happy: 'birthday', hello: 'world' };
	t.deepEqual(
		queryBuilder.getQueryFromString(string),
		expectedResult
	);
});
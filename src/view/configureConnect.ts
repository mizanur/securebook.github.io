import { configureConnect as configureTypeConnect } from 'typeconnect';

export function configureConnect() {
	if (process.env.NODE_ENV === 'development') {
		configureTypeConnect({
			addNodeLookupToClass: true,
			addPropertyNamesToNodes: true
		});
	}
}
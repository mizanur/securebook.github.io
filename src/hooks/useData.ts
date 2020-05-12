import { useState, useMemo, useContext } from 'preact/hooks';
import { Store } from '@interfaces/Store';
import { StoreContext } from '@context/StoreContext';
import { connect } from 'typeconnect';

export function useData<T extends keyof Store>(location: T): Store[T] {
	const store = useContext(StoreContext);
	
	const data = store[location];
	const [,setState] = useState({ data });

	useMemo(() => {
		const DependencyClass = connect(class {
			updateState() {
				for (let key in data) {
					data[key]; // Calling getter to provide dependency
				}
				setState({ data });
			}
		});
		
		new DependencyClass;
	}, []);

	return data;
}
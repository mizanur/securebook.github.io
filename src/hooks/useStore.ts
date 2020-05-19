import { useState, useMemo, useContext, StateUpdater } from 'preact/hooks';
import { connect } from 'typeconnect';
import { Store } from '@interfaces/Store';
import { StoreContext } from '@context/StoreContext';
import { useUnmount } from '@hooks/useUnmount';

type Fun<T> = (store: Store) => T;

interface ResultClass {
	val: any;
}

const ResultClass = connect(class {
	public isStopped: boolean = false;

	private readonly fun: { fun: Fun<any> };
	private readonly store: Store;

	constructor(fun: Fun<any>, store: Store) {
		this.fun = { fun };
		this.store = store;
	}

	get val(): any {
		if (!this.isStopped) {
			return this.fun.fun(this.store);
		}
	}
});

const UpdateClass = connect(class {
	private readonly result: ResultClass;
	private readonly setState: { fun: StateUpdater<any> };

	constructor(result: ResultClass, setState: StateUpdater<any>) {
		this.result = result;
		this.setState = { fun: setState };
	}

	setStateToResultValue() {
		this.setState.fun(this.result.val);
		return "just for funsies";
	}
});

export function useStore<T>(fun: Fun<T>): T {
	const store = useContext(StoreContext);
	const result = useMemo(() => {
		return new ResultClass(fun, store);
	}, []);
	const [state, setState] = useState(() => result.val);
	useMemo(() => {
		new UpdateClass(result, setState);
	}, []);
	useUnmount(() => () => {
		result.isStopped = true;
	});
	return state as T;
}
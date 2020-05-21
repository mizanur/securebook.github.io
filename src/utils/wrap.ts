import { Wrapped } from '@interfaces/Wrapped';

export function wrap<T>(value: T): Wrapped<T> {
	return { value };
}

export function unwrap<T>({ value }: Wrapped<T>) {
	return value;
}
import { useRef, useEffect } from "preact/hooks";

export function usePrevious<T>(value: T): null | T {
	const ref = useRef<null | T>(null);

	useEffect(() => {
		ref.current = value;
	}, [value]);
	
	return ref.current;
}
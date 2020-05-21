import { useMemo } from "preact/hooks";

export function useOnce<T>(fun: () => T): T {
	return useMemo(fun, []);
}
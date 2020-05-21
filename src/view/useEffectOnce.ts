import { useEffect, EffectCallback } from "preact/hooks";

export function useEffectOnce(fun: EffectCallback) {
	useEffect(fun, []);
}
import { useRef } from "preact/hooks";
import { useEffectOnce } from "@view/useEffectOnce";

export function useFocusOnMount() {
	const fieldRef = useRef<HTMLInputElement>(null);
	const useField = () => {
		useEffectOnce(() => {
			const timeoutId = setTimeout(() => {
				if (fieldRef.current) {
					fieldRef.current.focus();
				}
			}, 0);
			return () => {
				clearTimeout(timeoutId);
			}
		});
	};
	return { fieldRef, useField };
}
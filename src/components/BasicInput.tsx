import { h } from 'preact';
import { useState, Ref, useRef, useEffect } from 'preact/hooks';

type SelectionRange = {
	selectionStart: number | null,
	selectionEnd: number | null,
	selectionDirection: "forward" | "backward" | "none" | null,
}

export default function BasicInput(
	{ fieldRef = useRef<HTMLInputElement>(null), useField, ...props }:
	{ fieldRef?: Ref<HTMLInputElement>, useField?: () => void } & h.JSX.HTMLAttributes<HTMLInputElement>
) {
	const {onInput, onChange} = props;
	const [,setState] = useState({});
	const [selectionState, setSelectionState] = useState<SelectionRange>({
		selectionStart: null,
		selectionEnd: null,
		selectionDirection: null,
	});
	if (onInput) {
		props.onInput = function (...args) {
			setSelectionState({
				selectionStart: fieldRef.current.selectionStart,
				selectionEnd: fieldRef.current.selectionEnd,
				selectionDirection: fieldRef.current.selectionDirection,
			});
			const result = onInput.apply(this, args);
			return result;
		}
	}
	if (onChange) {
		props.onChange = function (...args) {
			const result = onChange.apply(this, args);
			setState({});
			return result;
		}
	}
	useEffect(() => {
		const timeoutId = setTimeout(() => {
			if (
				selectionState.selectionStart !== null &&
				selectionState.selectionEnd !== null &&
				selectionState.selectionDirection !== null
			) {
				fieldRef.current.setSelectionRange(
					selectionState.selectionStart,
					selectionState.selectionEnd,
					selectionState.selectionDirection,
				);
			}
		},0);
		return () => {
			clearTimeout(timeoutId);
		}
	}, [selectionState]);
	if (useField) {
		useField();
	}
	return <input {...props} ref={fieldRef} />;
}
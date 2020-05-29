import { h } from 'preact';
import { useState, Ref, EffectCallback, useMemo, useEffect } from 'preact/hooks';

export default function BasicInput(props: { fieldRef?: Ref<HTMLInputElement>, useField?: ()=>void } & h.JSX.HTMLAttributes<HTMLInputElement>) {
	const {onInput, onChange} = props;
	const [,setState] = useState({});
	if (onInput) {
		props.onInput = function (...args) {
			const result = onInput.apply(this, args);
			setState({});
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
	if (props.useField) {
		props.useField();
	}
	return <input {...props} ref={props.fieldRef} />;
}
import { h } from 'preact';
import { useState } from 'preact/hooks';

export function Input(props: h.JSX.HTMLAttributes<HTMLInputElement>) {
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
	return <input {...props} />;
}
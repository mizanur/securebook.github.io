import { h } from 'preact';
import "@styles/Input.scss";
import BasicInput from "@components/BasicInput";
import { useState, Ref } from 'preact/hooks';
import ThemeBorder from '@components/ThemeBorder';
import { IconType } from '@interfaces/Icon';
import Icon from '@components/Icon';

export type InputProps = {
		iconType?: IconType,
		fieldClass?: string,
		fieldClassName?: string,
		fieldRef?: Ref<HTMLInputElement>,
		useField?: () => void
	}
	& h.JSX.HTMLAttributes<HTMLInputElement>
;

function Input(props: InputProps) {
	const [isFocused, setFocused] = useState<boolean>(false);
	const className = props.class || props.className || ``;
	const fieldClassName = props.fieldClass || props.fieldClassName || ``;
	function onFocus(this: HTMLInputElement, e: h.JSX.TargetedEvent<HTMLInputElement, FocusEvent>) {
		setFocused(true);
		if (props.onFocus) {
			return props.onFocus.call(this, e);
		}
	}
	function onBlur(this: HTMLInputElement, e: h.JSX.TargetedEvent<HTMLInputElement, FocusEvent>) {
		setFocused(false);
		if (props.onBlur) {
			return props.onBlur.call(this, e);
		}
	}
	return <div className={`Input ${className}`}>
		{props.iconType &&
			<Icon
				type={props.iconType}
				className="Input__Icon"
			/>}
		{isFocused &&
			<ThemeBorder
				widths={{ bottom: 1 }}
				className="Input__ThemeBorder"
			/>}
		<BasicInput
			{...props}
			fieldRef={props.fieldRef}
			useField={props.useField}
			onFocus={onFocus}
			onBlur={onBlur}
			className={`Input__Basic ${fieldClassName} ${props.iconType ? `Input__Basic--with-icon` : ``}`}
		/>
	</div>;
}

export default Input;
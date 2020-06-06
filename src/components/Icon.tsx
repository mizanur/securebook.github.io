import { h } from 'preact';
import { IconType } from "@interfaces/Icon";
import "@styles/Icon.scss";

function Icon({ type, iconStyle, ...rest }: { type?: IconType, iconStyle?: 'outlined' | 'round' | 'sharp' | 'two-tone' } & h.JSX.HTMLAttributes<HTMLElement>) {
	return <i
		{...rest}
		className={`Icon ${
			type ? `Icon--${type}` : ``
		} ${
			iconStyle ? `Icon--font-${iconStyle}` : ``
		} ${
			rest.class || rest.className || ''
		}`}
	/>;
}

export default Icon;
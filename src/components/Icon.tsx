import { h } from 'preact';
import { IconType } from "@interfaces/Icon";
import "@styles/Icon.scss";

function Icon({ type, ...rest }: { type: IconType } & h.JSX.HTMLAttributes<HTMLElement>) {
	return <i {...rest} className={`Icon Icon--${type} ${rest.class || rest.className || ''}`}></i>;
}

export default Icon;
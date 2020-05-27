import { h } from 'preact';
import { IconType } from "@interfaces/Icon";
import "@styles/Icon.scss";

function Icon({ type }: { type: IconType }) {
	return <i className={`Icon Icon--${type}`}></i>;
}

export default Icon;
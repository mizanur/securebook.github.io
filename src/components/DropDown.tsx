import { h, ComponentChildren } from "preact";
import { IconType } from "@interfaces/Icon";
import Icon from "@components/Icon";
import "@styles/DropDown.scss";

export function DropDownItem({ type, label, ...rest }: { type: IconType, label: string } & h.JSX.HTMLAttributes<HTMLDivElement>) {
	return <div
		{...rest}
		title={label}
		className={`DropDown__Item ${rest.class || rest.className || ''} ${rest.onClick ? `DropDown__Item--with-click` : ``}`}
	>
		<span className="DropDown__Icon"><Icon type={type} /></span>
		<span className="DropDown__Label">{label}</span>
	</div>;
}

export function DropDown({ children }: { children: ComponentChildren }) {
	return <div className="DropDown">{children}</div>;
}
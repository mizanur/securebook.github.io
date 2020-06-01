import { h, ComponentChildren } from "preact";
import { IconType } from "@interfaces/Icon";
import Icon from "@components/Icon";
import "@styles/DropDown.scss";

export function DropDownItem({ iconType, label, children, ...rest }: { iconType?: IconType, label?: string, children?: ComponentChildren } & h.JSX.HTMLAttributes<HTMLDivElement>) {
	return <div
		{...rest}
		title={label}
		className={`DropDown__Item ${rest.class || rest.className || ''} ${rest.onClick ? `DropDown__Item--with-click` : ``}`}
	>
		{!!iconType && <span className="DropDown__Icon"><Icon type={iconType} /></span>}
		<span className="DropDown__Label">{!children ? label : children}</span>
	</div>;
}

export function DropDown({ children }: { children: ComponentChildren }) {
	return <div className="DropDown">{children}</div>;
}
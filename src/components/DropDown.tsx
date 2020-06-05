import { h, ComponentChildren } from "preact";
import { IconType } from "@interfaces/Icon";
import Icon from "@components/Icon";
import "@styles/DropDown.scss";

export function DropDownItem({ iconType, label, children, selected = false, labelProps = {}, ...rest }: { selected?: boolean, iconType?: IconType, label?: string, labelProps?: h.JSX.HTMLAttributes<HTMLSpanElement>, children?: ComponentChildren } & h.JSX.HTMLAttributes<HTMLDivElement>) {
	return <div
		{...rest}
		title={label}
		className={
			`DropDown__Item ${
				rest.class || rest.className || ''
			} ${
				selected ? `DropDown__Item--selected` : ``
			} ${
				rest.onClick ? `DropDown__Item--with-click` : ``
			}`
		}
	>
		{!!iconType && <span className="DropDown__Icon"><Icon type={iconType} /></span>}
		<span
			{...labelProps}
			className={`DropDown__Label ${
				labelProps.class || labelProps.className || ''
			}`}
		>
			{!children ? label : children}
		</span>
	</div>;
}

export function DropDown(props: h.JSX.HTMLAttributes<HTMLDivElement>) {
	return <div {...props} className={`DropDown ${props.class || props.className || ''}`} />;
}
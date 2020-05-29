import { h, Fragment } from 'preact';
import "@styles/ThemeBorder.scss";

type BorderKey = 'top' | 'left' | 'bottom' | 'right';

type BorderWidths = {
	[key in BorderKey]?: number
};

export default function ThemeBorder({ widths, ...rest }: { widths: BorderWidths } & h.JSX.HTMLAttributes<HTMLDivElement>) {
	return <Fragment>
		{!!widths.left && <div {...rest} style={{ width: `${widths.left ?? 0}px` }} className={`ThemeBorder__BorderLeft ${rest.class || rest.className || ''}`} ></div>}
		{!!widths.top && <div {...rest} style={{ height: `${widths.top ?? 0}px` }} className={`ThemeBorder__BorderTop ${rest.class || rest.className || ''}`}></div>}
		{!!widths.bottom && <div {...rest} style={{ height: `${widths.bottom ?? 0}px` }} className={`ThemeBorder__BorderBottom ${rest.class || rest.className || ''}`}></div>}
		{!!widths.right && <div {...rest} style={{ width: `${widths.right ?? 0}px` }} className={`ThemeBorder__BorderRight ${rest.class || rest.className || ''}`}></div>}
	</Fragment>;
}
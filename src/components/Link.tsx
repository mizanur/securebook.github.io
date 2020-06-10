import { h } from 'preact';
import { isLinkExternal } from '@utils/link';
import { connect } from '@view/connect';
import { useContext } from 'preact/hooks';
import { ManagersContext } from '@view/ManagersContext';

function Link(props: h.JSX.HTMLAttributes<HTMLAnchorElement>) {
	const { locationManager } = useContext(ManagersContext);
	const newProps = {...props};
	if (props.href && isLinkExternal(props.href)) {
		newProps.rel = "noopener noreferrer";
		newProps.target = "_blank";
	}
	else {
		newProps.onClick = function (e) {
			if (props.href) {
				e.preventDefault();
				locationManager.push(props.href);
			}
			if (props.onClick) {
				return props.onClick.call(this, e);
			}
		}
	}
	return <a {...newProps} />;
}

export function LinkNodeView(
	{ attrs }:
	{ attrs: h.JSX.HTMLAttributes<HTMLAnchorElement>, setAttrs: any }
) {
	return <Link {...attrs} />;
}

export default connect(Link);
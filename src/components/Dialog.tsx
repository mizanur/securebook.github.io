import { h, ComponentChildren } from 'preact';
import "@styles/Dialog.scss";
import { withPortal } from '@components/Portals';

function Dialog({ children }: { children: ComponentChildren }) {
	return <div className="Dialog">
		<div className="Dialog__Overlay"></div>
		<div className="Dialog__Main">
			{children}
		</div>
	</div>;
}

export default withPortal(Dialog);
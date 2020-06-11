import { h } from 'preact';
import "@styles/LoadingSpinner.scss";
import Icon from '@components/Icon';

function LoadingSpinner(props: h.JSX.HTMLAttributes<HTMLElement>) {
	return <div className={`LoadingSpinner ${props.class || props.className || ``}`}>
		<Icon {...props} type="refresh" className="LoadingSpinner__Icon" />
	</div>;
}

export default LoadingSpinner;
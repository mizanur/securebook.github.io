import { h } from 'preact';
import "@styles/TextLoading.scss";

function TextLoading({ className = `` }: { className?: string }) {
	return <div className={`TextLoading ${className}`}>
		<div className="TextLoading__Line TextLoading__Line-1">
			<div className="TextLoading__Gradient"></div>
		</div>
		<div className="TextLoading__Line TextLoading__Line-2">
			<div className="TextLoading__Gradient"></div>
		</div>
		<div className="TextLoading__Line TextLoading__Line-3">
			<div className="TextLoading__Gradient"></div>
		</div>
	</div>;
}

export default TextLoading;
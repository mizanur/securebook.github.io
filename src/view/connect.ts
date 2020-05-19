import { useState, useMemo, useContext } from "preact/hooks";
import { useUnmount } from "@view/useUnmount";
import { ConnectedRenderContext } from "@view/ConnectedRenderContext";

export function connect(Component) {
	return function(...args) {
		let result;
		const ConnectedRender = useContext(ConnectedRenderContext);
		const [,setState] = useState({});
		const render = useMemo(() => {
			return new ConnectedRender;
		}, []);
		render.calculation = {
			isInitialRender: true,
			perform() {
				result = Component(...args);
			},
			onUpdate() {
				setState({});
			}
		};
		useUnmount(() => {
			render.isStopped = true;
		});
		return result;
	}
}
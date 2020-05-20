import { useState, useMemo, useContext } from "preact/hooks";
import { useUnmount } from "@view/useUnmount";
import { RendererContext } from "@view/RendererContext";

export function connect(Component) {
	return function(...args) {
		let result;
		const createRenderer = useContext(RendererContext);
		const [,setState] = useState({});
		const renderer = useMemo(() => {
			return createRenderer();
		}, []);
		renderer.calculation = {
			isInitialRender: true,
			perform() {
				result = Component(...args);
			},
			onUpdate() {
				setState({});
			}
		};
		useUnmount(() => {
			renderer.isStopped = true;
		});
		return result;
	}
}
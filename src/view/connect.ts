import { useState, useContext } from "preact/hooks";
import { useUnmount } from "@view/useUnmount";
import { ConnectedContext } from "@view/ConnectedContext";
import { useOnce } from "@view/useOnce";

export function connect(Component) {
	return function(...args) {
		let result;
		const { createRenderer } = useContext(ConnectedContext);
		const [,setState] = useState({});
		const renderer = useOnce(() => {
			return createRenderer();
		});
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
			renderer.calculation = null;
		});
		return result;
	}
}
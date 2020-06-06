import { EditorCurrentState } from "@editor/interfaces/EditorCurrentState";

export function createEditorCurrentState(): EditorCurrentState {
	return <EditorCurrentState> {
		view: null,
		state: null,
		get exists() {
			return !!this.view && !!this.state;
		},
	};
};
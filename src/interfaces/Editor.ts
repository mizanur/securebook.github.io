import { EditorSchema } from "@editor/interfaces/EditorSchema";
import { EditorPluginsManager } from "@editor/interfaces/EditorPluginsManager";
import { DOMParser, DOMSerializer } from "prosemirror-model";
import { EditorMenu } from "@editor/interfaces/EditorMenu";
import { EditorState } from "prosemirror-state";
import { Wrapped } from "@interfaces/Wrapped";
import { NodeViewLookup } from "@interfaces/NodeView";
import { Dispatch } from "@editor/interfaces/Actions";

export interface Editor {
	menu: Wrapped<null | EditorMenu>,
	editorSchema: EditorSchema,
	editorPluginsManager: EditorPluginsManager,
	domParser: DOMParser,
	domSerializer: DOMSerializer,
	nodeViews: NodeViewLookup,
	createMenu: (state: Wrapped<EditorState>, dispatchTransaction: Dispatch) => void,
}
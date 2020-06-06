import { EditorSchema } from "@editor/interfaces/EditorSchema";
import { EditorPluginsManager } from "@editor/interfaces/EditorPluginsManager";
import { DOMParser, DOMSerializer } from "prosemirror-model";
import { NodeViewLookup } from "@interfaces/NodeView";
import { EditorCurrentMenuState } from "@editor/interfaces/EditorCurrentMenuState";
import { EditorCurrentState } from "@editor/interfaces/EditorCurrentState";

export interface Editor {
	menu: EditorCurrentMenuState,
	current: EditorCurrentState,
	editorSchema: EditorSchema,
	editorPluginsManager: EditorPluginsManager,
	domParser: DOMParser,
	domSerializer: DOMSerializer,
	nodeViews: NodeViewLookup,
}
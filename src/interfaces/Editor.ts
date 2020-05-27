import { EditorSchema } from "@editor/interfaces/EditorSchema";
import { EditorPluginsManager } from "@editor/interfaces/EditorPluginsManager";
import { DOMParser, DOMSerializer } from "prosemirror-model";

export interface Editor {
	editorSchema: EditorSchema,
	editorPluginsManager: EditorPluginsManager,
	domParser: DOMParser,
	domSerializer: DOMSerializer,
}
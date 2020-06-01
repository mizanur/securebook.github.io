import { EditorSchema } from "@editor/interfaces/EditorSchema";
import { EditorPluginsManager } from "@editor/interfaces/EditorPluginsManager";
import { DOMParser, DOMSerializer } from "prosemirror-model";
import { EditorMenu } from "@editor/interfaces/EditorMenu";
import { EditorState, Transaction } from "prosemirror-state";
import { Wrapped } from "@interfaces/Wrapped";

export interface Editor {
	menu: Wrapped<null | EditorMenu>,
	editorSchema: EditorSchema,
	editorPluginsManager: EditorPluginsManager,
	domParser: DOMParser,
	domSerializer: DOMSerializer,
	createMenu: (state: Wrapped<EditorState>, dispatchTransaction: (t: Transaction) => any) => void,
}
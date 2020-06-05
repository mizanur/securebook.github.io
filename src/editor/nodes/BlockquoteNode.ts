import { NodeSpec, Schema } from "prosemirror-model";
import { wrapIn } from "prosemirror-commands";
import { wrappingInputRule } from "prosemirror-inputrules";
import { EditorNode } from "@editor/interfaces/EditorNode";
import { KeyBindings, AddKeyBinding } from "@editor/interfaces/KeyBindings";
import { InputRules, AddInputRule } from "@editor/interfaces/InputRules";
import { Wrapped } from "@interfaces/Wrapped";
import { EditorState } from "prosemirror-state";
import { unwrap } from "@utils/wrap";
import { isActiveNode } from "@editor/utils/isActiveNode";
import { toggleWrap } from "@editor/utils/toggleWrap";

export class BlockquoteNode implements EditorNode, KeyBindings, InputRules {
	name: string = 'blockquote';

	nodeSpec: NodeSpec = {
		content: "block+",
		group: "block",
		defining: true,
		parseDOM: [
			{tag: "blockquote"}
		],
		toDOM() {
			return ["blockquote", 0];
		}
	}

	addKeyBindings(addKeyBinding: AddKeyBinding, schema: Schema) {
		addKeyBinding("Ctrl-.", wrapIn(schema.nodes.blockquote));
	}

	addInputRules(addInputRule: AddInputRule, schema: Schema) {
		addInputRule(wrappingInputRule(/^\s*>\s$/, schema.nodes.blockquote));
	}

	getMenuState(state: Wrapped<EditorState>, schema: Schema) {
		return {
			get isCurrent() {
				return isActiveNode(unwrap(state), schema.nodes.blockquote);
			},
			get canToggle() {
				return !!toggleWrap(schema.nodes.blockquote)(unwrap(state));
			},
		}
	}

	getMenuActions(schema: Schema) {
		return {
			toggle: () => toggleWrap(schema.nodes.blockquote),
		}
	}
}

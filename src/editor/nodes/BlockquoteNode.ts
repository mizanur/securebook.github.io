import { NodeSpec, Schema } from "prosemirror-model";
import { wrapIn } from "prosemirror-commands";
import { wrappingInputRule } from "prosemirror-inputrules";
import { EditorNode } from "@editor/interfaces/EditorNode";
import { KeyBindings, AddKeyBinding } from "@editor/interfaces/KeyBindings";
import { InputRules, AddInputRule } from "@editor/interfaces/InputRules";
import { EditorState } from "prosemirror-state";
import { isActiveNode } from "@editor/utils/isActiveNode";
import { toggleWrap } from "@editor/utils/toggleWrap";
import { MenuStateItem, MenuActionItem } from "@editor/interfaces/MenuItem";

export class BlockquoteNode implements EditorNode, KeyBindings, InputRules, MenuStateItem<'blockquote'>, MenuActionItem<'blockquote'> {
	readonly name = 'blockquote';

	readonly nodeSpec: NodeSpec = {
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

	getMenuState(state: EditorState, schema: Schema) {
		return {
			get isCurrent() {
				return isActiveNode(state, schema.nodes.blockquote);
			},
			get canToggle() {
				return !!toggleWrap(schema.nodes.blockquote)(state);
			},
		}
	}

	getMenuActions(schema: Schema) {
		return {
			toggle: () => toggleWrap(schema.nodes.blockquote),
		}
	}
}

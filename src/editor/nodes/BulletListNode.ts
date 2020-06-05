import { EditorNode } from "@editor/interfaces/EditorNode";
import { NodeSpec, Schema } from "prosemirror-model";
import { KeyBindings, AddKeyBinding } from "@editor/interfaces/KeyBindings";
import { wrapInList } from "@editor/utils/wrapInList";
import { InputRules, AddInputRule } from "@editor/interfaces/InputRules";
import { wrappingInputRule } from "prosemirror-inputrules";
import { isActiveNode } from "@editor/utils/isActiveNode";
import { unwrap } from "@utils/wrap";
import { Wrapped } from "@interfaces/Wrapped";
import { EditorState } from "prosemirror-state";
import { toggleList } from "@editor/utils/toggleList";

export class BulletListNode implements EditorNode, KeyBindings, InputRules {
	name: string = 'bullet_list';

	nodeSpec: NodeSpec = {
		content: "list_item+",
		group: "block",
		parseDOM: [{ tag: "ul" }],
		toDOM() {
			return ["ul", 0];
		}
	}

	addKeyBindings(addKeyBinding: AddKeyBinding, schema: Schema) {
		addKeyBinding("Shift-Ctrl-8", wrapInList(schema.nodes.bullet_list));
	}

	addInputRules(addInputRule: AddInputRule, schema: Schema) {
		addInputRule(wrappingInputRule(/^\s*([-+*])\s$/, schema.nodes.bullet_list));
	}

	getMenuState(state: Wrapped<EditorState>, schema: Schema) {
		return {
			get isCurrent() {
				return isActiveNode(unwrap(state), schema.nodes.bullet_list);
			},
			get canToggle() {
				return !!toggleList(schema.nodes.bullet_list, schema.nodes.list_item)(unwrap(state));
			},
		}
	}

	getMenuActions(schema: Schema) {
		return {
			toggle: () => toggleList(schema.nodes.bullet_list, schema.nodes.list_item),
		}
	}
}
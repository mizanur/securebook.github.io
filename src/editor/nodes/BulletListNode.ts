import { EditorNode } from "@editor/interfaces/EditorNode";
import { NodeSpec, Schema } from "prosemirror-model";
import { KeyBindings, AddKeyBinding } from "@editor/interfaces/KeyBindings";
import { wrapInList } from "@editor/utils/wrapInList";
import { InputRules, AddInputRule } from "@editor/interfaces/InputRules";
import { wrappingInputRule } from "prosemirror-inputrules";
import { isActiveNode } from "@editor/utils/isActiveNode";
import { EditorActiveState } from "@editor/interfaces/EditorCurrentState";
import { toggleList } from "@editor/utils/toggleList";
import { MenuStateItem, MenuActionItem } from "@editor/interfaces/MenuItem";

export class BulletListNode implements EditorNode, KeyBindings, InputRules, MenuStateItem<'bullet_list'>, MenuActionItem<'bullet_list'> {
	readonly name = 'bullet_list';

	readonly nodeSpec: NodeSpec = {
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

	getMenuState(current: EditorActiveState, schema: Schema) {
		return {
			get isCurrent() {
				return isActiveNode(current.state, schema.nodes.bullet_list);
			},
			get canToggle() {
				return !!toggleList(schema.nodes.bullet_list, schema.nodes.list_item)(current.state);
			},
		}
	}

	getMenuActions(schema: Schema) {
		return {
			toggle: () => toggleList(schema.nodes.bullet_list, schema.nodes.list_item),
		}
	}
}
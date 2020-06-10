import { EditorNode } from "@editor/interfaces/EditorNode";
import { NodeSpec, Schema } from "prosemirror-model";
import { InputRules, AddInputRule } from "@editor/interfaces/InputRules";
import { wrappingInputRule } from "prosemirror-inputrules";
import { isActiveNode } from "@editor/utils/isActiveNode";
import { EditorActiveState } from "@editor/interfaces/EditorCurrentState";
import { toggleList } from "@editor/utils/toggleList";
import "@styles/TodoList.scss";
import { MenuStateItem, MenuActionItem } from "@editor/interfaces/MenuItem";

export class TodoListNode implements EditorNode, InputRules, MenuStateItem<'todo_list'>, MenuActionItem<'todo_list'> {
	readonly name = 'todo_list';

	readonly nodeSpec: NodeSpec = {
		content: "todo_item+",
		group: "block",
		parseDOM: [{ tag: `ul[data-type="todo_list"]` }],
		toDOM() {
			return ["ul", {
				class: 'TodoList',
				"data-type": "todo_list",
			}, 0];
		}
	}

	addInputRules(addInputRule: AddInputRule, schema: Schema) {
		addInputRule(wrappingInputRule(/^\s*(\[ \])\s$/, schema.nodes.todo_list));
	}

	getMenuState(current: EditorActiveState, schema: Schema) {
		return {
			get isCurrent() {
				return isActiveNode(current.state, schema.nodes.todo_list);
			},
			get canToggle() {
				return !!toggleList(schema.nodes.todo_list, schema.nodes.todo_item)(current.state);
			},
		}
	}

	getMenuActions(schema: Schema) {
		return {
			toggle: () => toggleList(schema.nodes.todo_list, schema.nodes.todo_item),
		}
	}
}
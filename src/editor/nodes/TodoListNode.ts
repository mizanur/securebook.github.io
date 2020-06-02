import { EditorNode } from "@editor/interfaces/EditorNode";
import { NodeSpec, Schema } from "prosemirror-model";
import { InputRules, AddInputRule } from "@editor/interfaces/InputRules";
import { wrappingInputRule } from "prosemirror-inputrules";
import { isActiveNode } from "@editor/utils/isActiveNode";
import { unwrap } from "@utils/wrap";
import { Wrapped } from "@interfaces/Wrapped";
import { EditorState } from "prosemirror-state";
import { toggleList } from "@editor/utils/toggleList";
import "@styles/TodoList.scss";

export class TodoListNode implements EditorNode, InputRules {
	name: string = 'todo_list';

	nodeSpec: NodeSpec = {
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

	getMenuState(state: Wrapped<EditorState>, schema: Schema) {
		return {
			get isCurrent() {
				return isActiveNode(unwrap(state), schema.nodes.todo_list);
			}
		}
	}

	getMenuActions(schema: Schema) {
		return {
			toggle: () => toggleList(schema.nodes.todo_list, schema.nodes.todo_item),
		}
	}
}
import { EditorNode } from "@editor/interfaces/EditorNode";
import { NodeSpec, Schema } from "prosemirror-model";
import { EditorState, Transaction } from "prosemirror-state";

export class HorizontalRuleNode implements EditorNode {
	name: string = 'horizontal_rule';

	nodeSpec: NodeSpec = {
		group: "block",
		parseDOM: [{tag: "hr"}],
		toDOM() {
			return ["hr"];
		}
	}

	getMenuActions(schema: Schema) {
		return {
			add: () =>
				(state: EditorState, dispatch: (t: Transaction) => any) =>
					dispatch(state.tr.replaceSelectionWith(schema.nodes.horizontal_rule.create()))
		}
	}
}
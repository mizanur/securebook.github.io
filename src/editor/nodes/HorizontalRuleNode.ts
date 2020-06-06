import { EditorNode } from "@editor/interfaces/EditorNode";
import { NodeSpec, Schema } from "prosemirror-model";
import { EditorState } from "prosemirror-state";
import { Dispatch } from "@editor/interfaces/Actions";
import { MenuActionItem } from "@editor/interfaces/MenuItem";

export class HorizontalRuleNode implements EditorNode, MenuActionItem<'horizontal_rule'> {
	readonly name = 'horizontal_rule';

	readonly nodeSpec: NodeSpec = {
		group: "block",
		parseDOM: [{tag: "hr"}],
		toDOM() {
			return ["hr"];
		}
	}

	getMenuActions(schema: Schema) {
		return {
			add: () =>
				(state: EditorState, dispatch: Dispatch) =>
					dispatch(state.tr.replaceSelectionWith(schema.nodes.horizontal_rule.create()))
		}
	}
}
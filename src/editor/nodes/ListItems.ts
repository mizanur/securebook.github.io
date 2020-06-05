import { EditorNode } from "@editor/interfaces/EditorNode";
import { KeyBindings, AddKeyBinding } from "@editor/interfaces/KeyBindings";
import { Schema } from "prosemirror-model";
import { splitListItem } from "@editor/utils/splitListItem";
import { liftListItem } from "@editor/utils/liftListItem";
import { sinkListItem } from "@editor/utils/sinkListItem";
import { Wrapped } from "@interfaces/Wrapped";
import { EditorState } from "prosemirror-state";
import { unwrap } from "@utils/wrap";
import { Dispatch } from "@editor/interfaces/Actions";

export class ListItems implements KeyBindings {
	private readonly schema: Schema;
	private readonly listItemNodes: EditorNode[];
	
	constructor(schema: Schema, listItemNodes: EditorNode[]) {
		this.schema = schema;
		this.listItemNodes = listItemNodes;
	}
	
	private splitListItem = () => {
		return (state: EditorState, dispatch?: Dispatch) => {
			for (let i = 0; i < this.listItemNodes.length; i++) {
				const name = this.listItemNodes[i].name;
				const action = !!splitListItem(this.schema.nodes[name])(state, dispatch);
				if (action) {
					return true;
				}
			}
			return false;
		};
	}
	
	private increaseIndent = () => {
		return (state: EditorState, dispatch?: Dispatch) => {
			for (let i = 0; i < this.listItemNodes.length; i++) {
				const name = this.listItemNodes[i].name;
				const action = !!sinkListItem(this.schema.nodes[name])(state, dispatch);
				if (action) {
					return true;
				}
			}
			return false;
		};
	}
	
	private decreaseIndent = () => {
		return (state: EditorState, dispatch?: Dispatch) => {
			for (let i = 0; i < this.listItemNodes.length; i++) {
				const name = this.listItemNodes[i].name;
				const action = !!liftListItem(this.schema.nodes[name])(state, dispatch);
				if (action) {
					return true;
				}
			}
			return false;
		};
	}

	addKeyBindings = (addKeyBinding: AddKeyBinding) => {
		addKeyBinding("Enter", this.splitListItem());
		addKeyBinding("Mod-[", this.increaseIndent());
		addKeyBinding("Mod-]", this.decreaseIndent());
	}

	getMenuState = (state: Wrapped<EditorState>) => {
		const self = this;
		return {
			get canIncreaseIndent() {
				return self.increaseIndent()(unwrap(state));
			},
			get canDecreaseIndent() {
				return self.decreaseIndent()(unwrap(state));
			},
		}
	}

	getMenuActions = () => {
		return {
			increaseIndent: () => this.increaseIndent(),
			decreaseIndent: () => this.decreaseIndent(),
		}
	}
}
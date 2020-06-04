import { EditorNode } from "@editor/interfaces/EditorNode";
import { NodeSpec, Schema } from "prosemirror-model";
import { KeyBindings, AddKeyBinding } from "@editor/interfaces/KeyBindings";
import { splitListItem } from "@editor/utils/splitListItem";
import { liftListItem } from "@editor/utils/liftListItem";
import { sinkListItem } from "@editor/utils/sinkListItem";
import { getDefaultAttrs, getParseDOM, getToDOM } from "@view/NodeView";
import TodoListItem from "@components/TodoListItem";
import { NodeViewProvider } from "@interfaces/NodeView";

export class TodoListItemNode implements EditorNode, KeyBindings, NodeViewProvider {
	nodeView = TodoListItem;

	name: string = TodoListItem.type;

	nodeSpec: NodeSpec = {
		content: "paragraph block*",
		defining: true,
		attrs: TodoListItem.attrs,
		parseDOM: TodoListItem.parseDOM,
		toDOM: TodoListItem.toDOM,
	}

	addKeyBindings(addKeyBinding: AddKeyBinding, schema: Schema) {
		addKeyBinding("Enter", splitListItem(schema.nodes[TodoListItem.type]));
		addKeyBinding("Mod-[", liftListItem(schema.nodes[TodoListItem.type]));
		addKeyBinding("Mod-]", sinkListItem(schema.nodes[TodoListItem.type]));
	}
}
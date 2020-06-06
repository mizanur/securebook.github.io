import { EditorNode } from "@editor/interfaces/EditorNode";
import { NodeSpec } from "prosemirror-model";
import { createNodeViewForComponent } from "@view/NodeView";
import TodoListItem from "@components/TodoListItem";
import { NodeViewProvider } from "@interfaces/NodeView";

export class TodoListItemNode implements EditorNode, NodeViewProvider {
	readonly nodeView = createNodeViewForComponent(TodoListItem);

	readonly name = TodoListItem.type;

	readonly nodeSpec: NodeSpec = {
		content: "paragraph block*",
		defining: true,
		attrs: TodoListItem.attrs,
		parseDOM: TodoListItem.parseDOM,
		toDOM: TodoListItem.toDOM,
	}
}
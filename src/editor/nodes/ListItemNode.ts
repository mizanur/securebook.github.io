import { EditorNode } from "@editor/interfaces/EditorNode";
import { NodeSpec, Schema } from "prosemirror-model";
import { KeyBindings, AddKeyBinding } from "@editor/interfaces/KeyBindings";
import { splitListItem } from "@editor/utils/splitListItem";
import { liftListItem } from "@editor/utils/liftListItem";
import { sinkListItem } from "@editor/utils/sinkListItem";

export class ListItemNode implements EditorNode, KeyBindings {
	name: string = 'list_item';

	nodeSpec: NodeSpec = {
		content: "paragraph block*",
		parseDOM: [{ tag: "li" }],
		toDOM() {
			return ["li", 0];
		},
		defining: true
	}

	addKeyBindings(addKeyBinding: AddKeyBinding, schema: Schema) {
		addKeyBinding("Enter", splitListItem(schema.nodes.list_item));
		addKeyBinding("Mod-[", liftListItem(schema.nodes.list_item));
		addKeyBinding("Mod-]", sinkListItem(schema.nodes.list_item));
	}
}
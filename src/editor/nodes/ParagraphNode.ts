import { EditorNode } from "@editor/interfaces/EditorNode";
import { NodeSpec, Schema } from "prosemirror-model";
import { KeyBindings, AddKeyBinding } from "@editor/interfaces/KeyBindings";
import { setBlockType } from "prosemirror-commands";

export class ParagraphNode implements EditorNode, KeyBindings {
    name: string = 'paragraph';

    nodeSpec: NodeSpec = {
        content: "inline*",
        group: "block",
        parseDOM: [
            {tag: "p"}
        ],
        toDOM() {
            return ["p", 0];
        }
    }
    
    addKeyBindings(addKeyBinding: AddKeyBinding, schema: Schema) {
        addKeyBinding("Shift-Ctrl-0", setBlockType(schema.nodes.paragraph));
    }
}
import { NodeSpec, Schema } from "prosemirror-model";
import { wrapIn } from "prosemirror-commands";
import { wrappingInputRule } from "prosemirror-inputrules";
import { EditorNode } from "@editor/interfaces/EditorNode";
import { KeyBindings, AddKeyBinding } from "@editor/interfaces/KeyBindings";
import { InputRules, AddInputRule } from "@editor/interfaces/InputRules";

export class BlockquoteNode implements EditorNode, KeyBindings, InputRules {
    name: string = 'blockquote';

    nodeSpec: NodeSpec = {
        content: "block+",
        group: "block",
        defining: true,
        parseDOM: [
            {tag: "blockquote"}
        ],
        toDOM() {
            return ["blockquote", 0];
        }
    }

    addKeyBindings(addKeyBinding: AddKeyBinding, schema: Schema) {
        addKeyBinding("Ctrl-.", wrapIn(schema.nodes.blockquote));
    }

    addInputRules(addInputRule: AddInputRule, schema: Schema) {
        addInputRule(wrappingInputRule(/^\s*>\s$/, schema.nodes.blockquote));
    }
}

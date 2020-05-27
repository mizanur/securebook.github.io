import { NodeSpec, Schema } from "prosemirror-model";
import { setBlockType } from "prosemirror-commands";
import { textblockTypeInputRule } from "prosemirror-inputrules";
import { EditorNode } from "@editor/interfaces/EditorNode";
import { KeyBindings, AddKeyBinding } from "@editor/interfaces/KeyBindings";
import { InputRules, AddInputRule } from "@editor/interfaces/InputRules";

export class CodeBlockNode implements EditorNode, KeyBindings, InputRules {
    name: string = 'code_block';

    nodeSpec: NodeSpec = {
        content: "text*",
        marks: "",
        group: "block",
        code: true,
        defining: true,
        parseDOM: [
            {tag: "pre", preserveWhitespace: "full"}
        ],
        toDOM() {
            return ["pre", ["code", 0]];
        }
    }
    
    addKeyBindings(addKeyBinding: AddKeyBinding, schema: Schema) {
        addKeyBinding("Shift-Ctrl-\\", setBlockType(schema.nodes.code_block));
    }

    addInputRules(addInputRule: AddInputRule, schema: Schema) {
        addInputRule(textblockTypeInputRule(/^```$/, schema.nodes.code_block));
    }
}
import { EditorNode } from "@editor/interfaces/EditorNode";
import { NodeSpec, Schema } from "prosemirror-model";
import { KeyBindings, AddKeyBinding } from "@editor/interfaces/KeyBindings";
import { wrapInList } from "@editor/commands/wrapInList";
import { InputRules, AddInputRule } from "@editor/interfaces/InputRules";
import { wrappingInputRule } from "prosemirror-inputrules";

export class BulletListNode implements EditorNode, KeyBindings, InputRules {
    name: string = 'bullet_list';

    nodeSpec: NodeSpec = {
        content: "list_item+",
        group: "block",
        parseDOM: [{ tag: "ul" }],
        toDOM() {
            return ["ul", 0];
        }
    }

    addKeyBindings(addKeyBinding: AddKeyBinding, schema: Schema) {
        addKeyBinding("Shift-Ctrl-8", wrapInList(schema.nodes.bullet_list));
    }

    addInputRules(addInputRule: AddInputRule, schema: Schema) {
        addInputRule(wrappingInputRule(/^\s*([-+*])\s$/, schema.nodes.bullet_list))
    }
}
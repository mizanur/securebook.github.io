import { EditorNode } from "@editor/interfaces/EditorNode";
import { NodeSpec } from "prosemirror-model";

export class HorizontalRuleNode implements EditorNode {
    name: string = 'horizontal_rule';

    nodeSpec: NodeSpec = {
        group: "block",
        parseDOM: [{tag: "hr"}],
        toDOM() {
            return ["hr"];
        }
    }
}
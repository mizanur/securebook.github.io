import { EditorNode } from "@editor/interfaces/EditorNode";
import { NodeSpec, Schema } from "prosemirror-model";
import { KeyBindings, AddKeyBinding } from "@editor/interfaces/KeyBindings";
import { wrapInList } from "@editor/commands/wrapInList";
import { InputRules, AddInputRule } from "@editor/interfaces/InputRules";
import { wrappingInputRule } from "prosemirror-inputrules";

export class OrderedListNode implements EditorNode, KeyBindings, InputRules {
	name: string = 'ordered_list';

	nodeSpec: NodeSpec = {
		content: "list_item+",
		group: "block",
		attrs: { order: { default: 1 } },
		parseDOM: [{
			tag: "ol",
			getAttrs(dom: any) {
				return {
					order: dom.hasAttribute("start") ? +dom.getAttribute("start") : 1
				};
			}
		}],
		toDOM(node) {
			return node.attrs.order == 1
				? ["ol", 0]
				: ["ol", { start: node.attrs.order }, 0];
		}
	}

	addKeyBindings(addKeyBinding: AddKeyBinding, schema: Schema) {
		addKeyBinding("Shift-Ctrl-9", wrapInList(schema.nodes.ordered_list));
	}

	addInputRules(addInputRule: AddInputRule, schema: Schema) {
		addInputRule(wrappingInputRule(
			/^(\d+)\.\s$/,
			schema.nodes.ordered_list,
			match => ({order: +match[1]}),
			(match, node) => node.childCount + node.attrs.order == +match[1]
		));
	}
}
import { EditorNode } from "@editor/interfaces/EditorNode";
import { NodeSpec, Schema } from "prosemirror-model";
import { KeyBindings, AddKeyBinding } from "@editor/interfaces/KeyBindings";
import { wrapInList } from "@editor/utils/wrapInList";
import { InputRules, AddInputRule } from "@editor/interfaces/InputRules";
import { wrappingInputRule } from "prosemirror-inputrules";
import { Wrapped } from "@interfaces/Wrapped";
import { EditorState } from "prosemirror-state";
import { isActiveNode } from "@editor/utils/isActiveNode";
import { unwrap } from "@utils/wrap";
import { toggleList } from "@editor/utils/toggleList";

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

	getMenuState(state: Wrapped<EditorState>, schema: Schema) {
		return {
			get isCurrent() {
				return isActiveNode(unwrap(state), schema.nodes.ordered_list);
			}
		}
	}

	getMenuActions(schema: Schema) {
		return {
			toggle: () => toggleList(schema.nodes.ordered_list, schema.nodes.list_item),
		}
	}
}
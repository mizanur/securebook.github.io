import { EditorNode } from "@editor/interfaces/EditorNode";
import { NodeSpec, Schema } from "prosemirror-model";
import { KeyBindings, AddKeyBinding } from "@editor/interfaces/KeyBindings";
import { setBlockType } from "prosemirror-commands";
import { InputRules, AddInputRule } from "@editor/interfaces/InputRules";
import { textblockTypeInputRule } from "prosemirror-inputrules";
import { Wrapped } from "@interfaces/Wrapped";
import { EditorState } from "prosemirror-state";
import { isActiveNode } from "@editor/utils/isActiveNode";
import { unwrap } from "@utils/wrap";
import { getNodeAttrs } from "@editor/utils/getNodeAttrs";
import { toggleBlockType } from "@editor/utils/toggleBlockType";

export class HeadingNode implements EditorNode, KeyBindings, InputRules {
	name: string = 'heading';

	nodeSpec: NodeSpec = {
		attrs: {level: {default: 1}},
		content: "inline*",
		group: "block",
		defining: true,
		parseDOM: [
			{tag: "h1", attrs: {level: 1}},
			{tag: "h2", attrs: {level: 2}},
			{tag: "h3", attrs: {level: 3}},
			{tag: "h4", attrs: {level: 4}},
			{tag: "h5", attrs: {level: 5}},
			{tag: "h6", attrs: {level: 6}}
		],
		toDOM(node) {
			return ["h" + node.attrs.level, 0];
		}
	}

	addKeyBindings(addKeyBinding: AddKeyBinding, schema: Schema): void {
		for (let i = 1; i <= 6; i++) {
			addKeyBinding("Shift-Ctrl-" + i, setBlockType(schema.nodes.heading, { level: i }));
		}
	}

	addInputRules(addInputRule: AddInputRule, schema: Schema) {
		addInputRule(textblockTypeInputRule(
			new RegExp("^(#{1,6})\\s$"),
			schema.nodes.heading,
			match => ({ level: match[1].length })
		));
	}

	getMenuState(state: Wrapped<EditorState>, schema: Schema) {
		return {
			get isCurrent(): boolean {
				return isActiveNode(unwrap(state), schema.nodes.heading);
			},
			get canToggle() {
				return !!toggleBlockType(schema.nodes.heading, schema.nodes.paragraph)(unwrap(state));
			},
			get level(): number {
				return this.isCurrent && getNodeAttrs(unwrap(state), schema.nodes.heading).level || 0;
			}
		}
	}

	getMenuActions(schema: Schema) {
		return {
			setLevel: (level: number) => toggleBlockType(schema.nodes.heading, schema.nodes.heading, { level }),
			remove: () => toggleBlockType(schema.nodes.heading, schema.nodes.paragraph),
		}
	}
}
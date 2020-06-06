import { NodeSpec, Schema } from "prosemirror-model";
import { setBlockType } from "prosemirror-commands";
import { textblockTypeInputRule } from "prosemirror-inputrules";
import { EditorNode } from "@editor/interfaces/EditorNode";
import { KeyBindings, AddKeyBinding } from "@editor/interfaces/KeyBindings";
import { InputRules, AddInputRule } from "@editor/interfaces/InputRules";
import { EditorState } from "prosemirror-state";
import { isActiveNode } from "@editor/utils/isActiveNode";
import { toggleBlockType } from "@editor/utils/toggleBlockType";
import { CodeBlockView, arrowHandler } from "@view/CodeBlockView";
import { NodeViewProvider } from "@interfaces/NodeView";
import { MenuStateItem, MenuActionItem } from "@editor/interfaces/MenuItem";

export class CodeBlockNode implements EditorNode, KeyBindings, InputRules, NodeViewProvider, MenuStateItem<'code_block'>, MenuActionItem<'code_block'> {
	readonly nodeView = CodeBlockView;

	readonly name = 'code_block';

	readonly nodeSpec: NodeSpec = {
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
		addKeyBinding("ArrowLeft", arrowHandler("left"));
		addKeyBinding("ArrowRight", arrowHandler("right"));
		addKeyBinding("ArrowUp", arrowHandler("up"));
		addKeyBinding("ArrowDown", arrowHandler("down"));
	}

	addInputRules(addInputRule: AddInputRule, schema: Schema) {
		addInputRule(textblockTypeInputRule(/^```$/, schema.nodes.code_block));
	}

	getMenuState(state: EditorState, schema: Schema) {
		return {
			get isCurrent() {
				return isActiveNode(state, schema.nodes.code_block);
			},
			get canToggle() {
				return !!toggleBlockType(schema.nodes.code_block, schema.nodes.paragraph)(state);
			},
		}
	}

	getMenuActions(schema: Schema) {
		return {
			toggle: () => toggleBlockType(schema.nodes.code_block, schema.nodes.paragraph),
		}
	}
}
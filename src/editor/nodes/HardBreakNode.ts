import { EditorNode } from "@editor/interfaces/EditorNode";
import { NodeSpec, Schema } from "prosemirror-model";
import { KeyBindings, AddKeyBinding } from "@editor/interfaces/KeyBindings";
import { chainCommands, exitCode } from "prosemirror-commands";

export class HardBreakNode implements EditorNode, KeyBindings {
	name: string = "hard_break";

	nodeSpec: NodeSpec = {
		inline: true,
		group: "inline",
		selectable: false,
		parseDOM: [{tag: "br"}],
		toDOM() {
			return ["br"];
		}
	}

	addKeyBindings(addKeyBinding: AddKeyBinding, schema: Schema, isMac: boolean) {
		const cmd = chainCommands(exitCode, (state, dispatch) => {
			if (dispatch) {
				dispatch(state.tr.replaceSelectionWith(schema.nodes.hard_break.create()).scrollIntoView());
				return true;
			}
			return false;
		});

		addKeyBinding("Mod-Enter", cmd);
		addKeyBinding("Shift-Enter", cmd);

		if (isMac) {
			addKeyBinding("Ctrl-Enter", cmd);
		}
	}
}
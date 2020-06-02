import { EditorNode } from "@editor/interfaces/EditorNode";
import { NodeSpec, Schema } from "prosemirror-model";
import { KeyBindings, AddKeyBinding } from "@editor/interfaces/KeyBindings";
import { splitListItem } from "@editor/utils/splitListItem";
import { liftListItem } from "@editor/utils/liftListItem";
import { sinkListItem } from "@editor/utils/sinkListItem";
import { EditorEvents, PerformCommand } from "@editor/interfaces/EditorEvents";
import { updateNodeAttrs } from "@editor/utils/updateNodeAttrs";
import { EditorView } from "prosemirror-view";

export type TodoListItemAttrs = {
	done: boolean,
};

const defaultAttrs: TodoListItemAttrs = {
	done: false,
};

export class TodoListItemNode implements EditorNode, KeyBindings, EditorEvents {
	name: string = 'todo_item';

	nodeSpec: NodeSpec = {
		content: "paragraph block*",
		defining: true,
		attrs: {
			done: {default: defaultAttrs.done},
		},
		parseDOM: [{
			tag: `li[data-type="todo_item"]`,
			getAttrs(val: any) {
				const dom: HTMLElement = val;
				try {
					return JSON.parse(dom.getAttribute('data-attrs') || ``);
				}
				catch(_) {
					return { ...defaultAttrs };
				}
			},
		}],
		toDOM(node) {
			const attrs = node.attrs as TodoListItemAttrs;
			return [
				'li', {
					class: 'TodoList__Item',
					'data-type': 'todo_item',
					'data-attrs': JSON.stringify(attrs),
				},
					['button', {
						class: 'TodoList__CheckButton',
						contenteditable: 'false'
					},
						['i', {
							class: `Icon TodoList__Icon Icon--check_box ${
								attrs.done ? `TodoList__Icon--visible`: `TodoList__Icon--invisible`
							}`
						}],
						['i', {
							class: `Icon TodoList__Icon Icon--check_box_outline_blank ${
								attrs.done ? `TodoList__Icon--invisible`: `TodoList__Icon--visible`
							}`
						}],
					],
					['div', {
						class: `TodoList__Content ${
							attrs.done ? `TodoList__Content--done`: ``
						}`
					},
						0
					],
			];
		},
	}

	addKeyBindings(addKeyBinding: AddKeyBinding, schema: Schema) {
		addKeyBinding("Enter", splitListItem(schema.nodes.todo_item));
		addKeyBinding("Mod-[", liftListItem(schema.nodes.todo_item));
		addKeyBinding("Mod-]", sinkListItem(schema.nodes.todo_item));
	}

	addEditorEvents(root: HTMLElement, schema: Schema, performCommand: PerformCommand, viewRef: { current: EditorView }) {
		const listener = (e: MouseEvent) => {
			let listItem: HTMLElement | null;
			if (
				e.target instanceof HTMLElement &&
				e.target.closest('.TodoList__CheckButton') &&
				(listItem = e.target.closest('li[data-type="todo_item"]'))
			) {
				const pos = viewRef.current.posAtDOM(listItem, 0);
				performCommand(updateNodeAttrs(pos, schema.nodes.todo_item, ({ done }) => ({ done: !done })));
			}
		};

		root.addEventListener('click', listener);

		return () => {
			root.removeEventListener('click', listener);
		}
	}
}
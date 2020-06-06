import { ParagraphAttrs } from "@editor/nodes/ParagraphNode";

export interface MenuActions {
	history: {
		undo: () => void,
		redo: () => void,
	},
	strong: {
		toggle: () => void,
	},
	em: {
		toggle: () => void,
	},
	code: {
		toggle: () => void,
	},
	underline: {
		toggle: () => void,
	},
	strikethrough: {
		toggle: () => void,
	},
	link: {
		createUpdate: (attrs: { href: string, title: string }) => void,
		remove: () => void,
	},
	font_size: {
		setFontSize: (fontSize: number) => void,
		reset: () => void,
	},
	font_family: {
		setFontFamily: (fontFamily: string) => void,
		reset: () => void,
	},
	blockquote: {
		toggle: () => void,
	},
	code_block: {
		toggle: () => void,
	},
	heading: {
		setLevel: (level: number) => void,
		remove: () => void,
	},
	horizontal_rule: {
		add: () => void,
	},
	paragraph: {
		setAttrs: (attrs: ParagraphAttrs) => void,
	},
	bullet_list: {
		toggle: () => void,
	},
	ordered_list: {
		toggle: () => void,
	},
	todo_list: {
		toggle: () => void,
	},
	list_items: {
		increaseIndent: () => void,
		decreaseIndent: () => void,
	},
}
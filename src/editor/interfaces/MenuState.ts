import { ParagraphAttrs } from "@editor/nodes/ParagraphNode";
import { FontSizeMarkAttrs } from "@editor/marks/FontSizeMark";
import { FontFamilyMarkAttrs } from "@editor/marks/FontFamilyMark";
import { FontColorMarkAttrs } from "@editor/marks/FontColorMark";
import { HighlightMarkAttrs } from "@editor/marks/HighlightMark";

export interface MenuState {
	history: {
		canUndo: boolean,
		canRedo: boolean,
	},
	strong: {
		isCurrent: boolean,
		canToggle: boolean,
	},
	em: {
		isCurrent: boolean,
		canToggle: boolean,
	},
	code: {
		isCurrent: boolean,
		canToggle: boolean,
	},
	underline: {
		isCurrent: boolean,
		canToggle: boolean,
	},
	strikethrough: {
		isCurrent: boolean,
		canToggle: boolean,
	},
	link: {
		isCurrent: boolean,
		canToggle: boolean,
		isSelected: boolean,
		attrs: {
			href: string,
			title: string,
		},
	},
	font_size: {
		isCurrent: boolean,
		attrs: FontSizeMarkAttrs,
		canToggle: boolean,
	},
	font_family: {
		isCurrent: boolean,
		attrs: FontFamilyMarkAttrs,
		canToggle: boolean,
	},
	font_color: {
		isCurrent: boolean,
		attrs: FontColorMarkAttrs,
		canToggle: boolean,
	},
	highlight: {
		isCurrent: boolean,
		attrs: HighlightMarkAttrs,
		canToggle: boolean,
	},
	blockquote: {
		isCurrent: boolean,
		canToggle: boolean,
	},
	code_block: {
		isCurrent: boolean,
		canToggle: boolean,
	},
	heading: {
		isCurrent: boolean,
		level: number,
		canToggle: boolean,
	},
	paragraph: {
		isCurrent: boolean,
		attrs: ParagraphAttrs,
	},
	bullet_list: {
		isCurrent: boolean,
		canToggle: boolean,
	},
	ordered_list: {
		isCurrent: boolean,
		canToggle: boolean,
	},
	todo_list: {
		isCurrent: boolean,
		canToggle: boolean,
	},
	list_items: {
		canIncreaseIndent: boolean,
		canDecreaseIndent: boolean,
	},
}
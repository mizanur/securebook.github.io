import { ParagraphAttrs } from "@editor/nodes/ParagraphNode";
import { FontSizeMarkAttrs } from "@editor/marks/FontSizeMark";
import { FontFamilyMarkAttrs } from "@editor/marks/FontFamilyMark";

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
	fontSize: {
		isCurrent: boolean,
		attrs: FontSizeMarkAttrs,
		canToggle: boolean,
	},
	fontFamily: {
		isCurrent: boolean,
		attrs: FontFamilyMarkAttrs,
		canToggle: boolean,
	},
	blockquote: {
		isCurrent: boolean,
		canToggle: boolean,
	},
	codeBlock: {
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
	bulletList: {
		isCurrent: boolean,
		canToggle: boolean,
	},
	orderedList: {
		isCurrent: boolean,
		canToggle: boolean,
	},
	todoList: {
		isCurrent: boolean,
		canToggle: boolean,
	},
	listItems: {
		canIncreaseIndent: boolean,
		canDecreaseIndent: boolean,
	},
}
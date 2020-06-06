import { MarkSpec } from "prosemirror-model";

export interface EditorMark {
	name: string,
	readonly markSpec: MarkSpec
}
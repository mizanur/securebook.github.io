import { Schema } from "prosemirror-model";
import { InputRule } from "prosemirror-inputrules";

export interface InputRulesManager {
	getInputRules(schema: Schema): InputRule[]
}
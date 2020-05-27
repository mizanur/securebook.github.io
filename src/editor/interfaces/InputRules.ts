import { InputRule } from "prosemirror-inputrules";
import { Schema } from "prosemirror-model";

export interface InputRules {
    addInputRules(addInputRule: AddInputRule, schema: Schema): void;
}

export type AddInputRule = (inputRule: InputRule) => void;
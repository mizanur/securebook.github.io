import { KeyBindings, AddKeyBinding } from "@editor/interfaces/KeyBindings";
import { undoInputRule, InputRule, inputRules } from "prosemirror-inputrules";
import { Schema } from "prosemirror-model";
import { InputRulesManager as IInputRulesManager } from "@editor/interfaces/InputRulesManager";
import { InputRules, AddInputRule } from "@editor/interfaces/InputRules";
import { EditorPlugins, AddEditorPlugin } from "@editor/interfaces/EditorPlugins";

export class InputRulesManager implements IInputRulesManager, KeyBindings, EditorPlugins {
    private readonly inputRules: InputRules[];

    constructor(inputRules: InputRules[]) {
        this.inputRules = inputRules;
    }

    addEditorPlugins(addEditorPlugin: AddEditorPlugin, schema: Schema) {
        addEditorPlugin(inputRules({ rules: this.getInputRules(schema) }));
    }

    getInputRules(schema: Schema) {
        const rules: InputRule[] = [];
        const addInputRule: AddInputRule = (inputRule) => {
            rules.push(inputRule);
        };
        for (let i = 0; i < this.inputRules.length; i++) {
            const inputRules = this.inputRules[i];
            inputRules.addInputRules(addInputRule, schema);
        }
        return rules;
    }
    
    addKeyBindings(addKeyBinding: AddKeyBinding, _schema: Schema) {
        addKeyBinding("Backspace", undoInputRule);
    }
}
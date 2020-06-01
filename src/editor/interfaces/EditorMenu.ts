import { MenuState } from "@editor/interfaces/MenuState";
import { MenuActions } from "@editor/interfaces/MenuActions";

export interface EditorMenu {
	state: MenuState,
	actions: MenuActions
}
import { MenuState } from "./MenuState";
import { MenuActions } from "./MenuActions";

export type EditorCurrentMenuState = {
	exists: false,
	state: null | MenuState,
	actions: null | MenuActions,
} | {
	exists: true,
	state: MenuState,
	actions: MenuActions,
};
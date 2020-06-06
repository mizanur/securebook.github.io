import { MenuState } from "@editor/interfaces/MenuState";
import { MenuActions } from "@editor/interfaces/MenuActions";

export type EditorCurrentMenuState = {
	exists: false,
	state: null | MenuState,
	actions: null | MenuActions,
} | {
	exists: true,
	state: MenuState,
	actions: MenuActions,
};
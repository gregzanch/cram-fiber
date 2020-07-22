import { atom } from 'recoil';
import { HOTKEY_SCOPES } from "../constants";

export const hotkeyScopeState = atom({
	key: "hotkeyScopeState",
	default: HOTKEY_SCOPES.EDITOR,
});

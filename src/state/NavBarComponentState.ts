import { atom } from "recoil";

export const navBarMenuState = atom({
	key: "navBarMenuState",
	default: {
		openMenu: "",
		navBarHasFocus: false,
	},
});

export default {
	navBarMenuState,
};

import { atom } from "recoil";

export const layoutChangingState = atom({
	key: "layoutChangingState",
	default: false,
});

export default {
	layoutChangingState,
};

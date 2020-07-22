import { atom } from "recoil";
import { OBJECT_DISPLAY_STYLES } from "../constants";
import {
	AcousticSourceProps,
	getDefaultAcousticSourceProps,
} from "../components/Editor/Objects/AcousticSource";



export const objectDisplayStyleState = atom({
	key: "objectDisplayStyleState",
	default: OBJECT_DISPLAY_STYLES.NORMAL,
});

export const sourcesState = atom({
	key: "sourcesState",
	default: [getDefaultAcousticSourceProps()] as AcousticSourceProps[],
});



export default {
	objectDisplayStyleState,
	sourcesState,
};

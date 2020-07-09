import { atom } from "recoil";
import { OBJECT_DISPLAY_STYLES } from './Editor.const';



export const objectDisplayStyleState = atom({
	key: "objectDisplayStyleState",
	default: OBJECT_DISPLAY_STYLES.NORMAL,
});


export default {
  objectDisplayStyleState
}
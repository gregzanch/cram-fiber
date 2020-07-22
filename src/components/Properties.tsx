import React from 'react';
import { useRecoilState } from "recoil";
import { hotkeyScopeState } from "../state/GlobalState";
import { HOTKEY_SCOPES } from '../constants';
import "./Properties.css";



export interface PropertiesProps {

}

export const Properties = (props: PropertiesProps) => {
  
  const [hotkeyScope, setHotkeyScope] = useRecoilState(hotkeyScopeState);
  
  const handleMouseEnter = () => {
    setHotkeyScope(HOTKEY_SCOPES.PROPERTIES)
  }
  
  return (
    <div className="properties-container" onMouseEnter={handleMouseEnter}>
      Properties
      <div>{hotkeyScope}</div>
    </div>
  );
};

export default Properties
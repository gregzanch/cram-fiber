import React from 'react';
import { useRecoilState } from "recoil";
import { hotkeyScopeState, sourcesState } from '../state/GlobalState';
import { HOTKEY_SCOPES } from '../constants';
import { AcousticSourceProps } from './Editor/Objects';

import "./Properties.css";


export interface PropertiesProps {

}

export const Properties = (props: PropertiesProps) => {
  
  const [hotkeyScope, setHotkeyScope] = useRecoilState(hotkeyScopeState);
  const [sources, setSources] = useRecoilState(sourcesState);
  
  const handleMouseEnter = () => {
    setHotkeyScope(HOTKEY_SCOPES.PROPERTIES)
  }
  
  return (
    <div className="properties-container" onMouseEnter={handleMouseEnter}>
      <input type="number" min={0} max={10} value={sources[0].position[0]} onChange={e => {
        const val = e.currentTarget.valueAsNumber;
        setSources(sources => {
          const newSrc = {
            ...sources[0],
            position: [
              val,
              sources[0].position[1],
              sources[0].position[2]
            ]
          } as AcousticSourceProps;
          return [newSrc];
        });
      }
      } />
    </div>
  );
};

export default Properties
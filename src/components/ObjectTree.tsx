import React from 'react';
import { useRecoilState } from 'recoil';
import { hotkeyScopeState, sourcesState } from '../state/GlobalState';
import { HOTKEY_SCOPES } from "../constants";
import "./ObjectTree.css";
import { AcousticSourceProps } from './Editor/Objects';

export interface ObjectTreeItem {
  label: string;
  id: string;
  children: ObjectTreeItem[];
  kind: string;
}

export interface ObjectTreeProps {

}

export const ObjectTree = (props: ObjectTreeProps) => {
  
  const [hotkeyScope, setHotkeyScope] = useRecoilState(hotkeyScopeState);
  const [sources, setSources] = useRecoilState(sourcesState);
  
  const handleMouseEnter = () => {
		setHotkeyScope(HOTKEY_SCOPES.OBJECT_TREE);
	};
  
  return (
    <div className="object-tree-container" onMouseEnter={handleMouseEnter}>
      <input type="range" min={0} max={10} value={sources[0].position[0]} onChange={e => {
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
          return [newSrc]
        });
      }
      } />
		</div>
  );
}

export default ObjectTree
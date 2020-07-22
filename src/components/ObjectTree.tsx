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
      
		</div>
  );
}

export default ObjectTree
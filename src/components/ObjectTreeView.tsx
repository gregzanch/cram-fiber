import React from 'react';

export interface ObjectTreeItem {
  label: string;
  id: string;
  children: ObjectTreeItem[];
  kind: string;
}

export interface ObjectTreeViewProps {

}

export const ObjectTreeView = (props: ObjectTreeViewProps) => {
  return (<div></div>)
}

export default {
  ObjectTreeView
}
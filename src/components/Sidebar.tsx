import React from "react";

import './Sidebar.css';
import SplitterLayout from "./SplitterLayout";

import ObjectTree from './ObjectTree';
import Properties from './Properties';

export interface SidebarProps{
  
}

export const Sidebar = (props: SidebarProps) => {
	return <div className="sidebar">
		<SplitterLayout
			vertical
			primaryIndex={0}
			customClassName="object_tree-properties"
		>
			<ObjectTree />
			<Properties />
		</SplitterLayout>
	</div>;
};

export default {
	Sidebar,
};

import React from 'react';
import { NavBarComponent } from './components/NavBarComponent';
import { Editor } from './components/Editor';
import { RecoilRoot, MutableSnapshot } from "recoil";
import { PersistenceObserver } from './state/Persistence';
import * as GlobalState from './state/GlobalState';
import SplitterLayout from './components/SplitterLayout';

import './App.css';
import { Sidebar } from './components/Sidebar';
import { useRecoilState } from 'recoil';

console.log(GlobalState);

const initializeState = (mutSnapshot: MutableSnapshot) => {
	Object.keys(GlobalState).forEach((key) => {
		if (typeof GlobalState[key] !== undefined) {
			if (localStorage.getItem(key)) {
				mutSnapshot.set(
					GlobalState[key],
					JSON.parse(localStorage.getItem(key)).value
				);
			}
			else {
				localStorage.setItem(key, JSON.stringify(mutSnapshot.getLoadable(GlobalState[key]).contents));
			}
		}
	});
};



function App() {
	const [layoutChangingState, setLayoutChangingState] = useRecoilState(GlobalState.layoutChangingState);
	return (
			<div className="app">
				<NavBarComponent />
				<SplitterLayout
					primaryIndex={0}
					onDragStart={() => setLayoutChangingState(true)}
					onDragEnd={() => setLayoutChangingState(false)}>
					<Editor />
					<Sidebar />
				</SplitterLayout>
			</div>
	);
}
function AppWrapper() {
	return (
		<RecoilRoot>
			<PersistenceObserver />
			<App />
		</RecoilRoot>
	);
}

export default AppWrapper;

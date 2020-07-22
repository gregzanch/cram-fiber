import React, { useRef, useEffect } from "react";
import {
	atom,
	useRecoilState
} from "recoil";

import { useClickOutside } from '../hooks';


import {
	navBarMenuState,
	objectDisplayStyleState,
	hotkeyScopeState,
} from "../state/GlobalState";

import { OBJECT_DISPLAY_STYLES, HOTKEY_SCOPES } from "../constants";



import "./NavBarComponent.css";

console.log(navBarMenuState);

const Characters = {
	COMMAND: "⌘",
	CONTROL: "⌃",
	SHIFT: "⇧",
	OPTION: "⌥",
	DELETE: "⌫",
	DELETE_FORWARDS: "⌦",
	UP_ARROW: "↑",
	RIGHT_ARROW: "→",
	LEFT_ARROW: "←",
	DOWN_ARROW: "↓",
	TAB: "⇥",
	ESCAPE: "⎋",
};

const HotKeyModifierOrder = {
  [Characters.CONTROL]: 0,
  [Characters.SHIFT]: 1,
  [Characters.OPTION]: 2,
  [Characters.COMMAND]: 3,
}

function sortHotKey(hotkey: string[]) {
  if (hotkey.length === 0) {
    return hotkey;
  }
  const nonMeta = hotkey[hotkey.length-1];
  return hotkey
    .slice(0, -1)
    .sort((a, b) => (HotKeyModifierOrder[a] || 4) - (HotKeyModifierOrder[b] || 4))
    .concat(nonMeta);  
}



//--------------------------------------------------------

export interface NavBarProps {
	// ref: React.MutableRefObject<HTMLDivElement>;
	onMouseEnter: (e: React.MouseEvent) => void;
	children: React.ReactNode;
}

export const NavBar = React.forwardRef((props: NavBarProps, ref: React.RefObject<HTMLDivElement>) => {
	
	return (
		<div ref={ref} className="nav-bar" onMouseEnter={props.onMouseEnter}>{props.children}</div>
	)
}
)

//--------------------------------------------------------

export interface NavBarGroupProps {
	children: React.ReactNode;
}

export function NavBarGroup(props: NavBarGroupProps) {
  return <div className="nav-bar-group">{props.children}</div>
}

//--------------------------------------------------------

export interface NavBarMenuProps {
  label: string;
	children: React.ReactNode;
}

export function NavBarMenu(props: NavBarMenuProps) {
  const [menuState, setMenuState] = useRecoilState(navBarMenuState);
  const handleMouseDown = (e: React.MouseEvent) => {
		if (menuState.openMenu === props.label) {
      setMenuState({
        navBarHasFocus: false,
        openMenu: ""
      });
		} else {
      setMenuState({
			navBarHasFocus: true,
			openMenu: props.label,
		});
		}
  };
  const handleMouseEnter = (e: React.MouseEvent) => {
    if (menuState.navBarHasFocus) {
      if (menuState.openMenu !== props.label) {
        setMenuState((oldMenuState) => ({
          ...oldMenuState,
          ...{ openMenu: props.label },
        }));
      }
    }
  };

	
	const isOpen = menuState.openMenu === props.label;
	const wasReset = menuState.openMenu === "";
	
	const menuContentRef = useRef<HTMLDivElement>();
	
	useEffect(() => {
		setTimeout(() => {
			if (menuContentRef.current) {
				menuContentRef.current.classList.remove("nav-bar-menu-content-fadeout");
			}
			// menuContentRef.current.style.display = "none";
		}, 150)
	
	},[wasReset])
	
	const menuButtonClass = [
		"nav-bar-menu-button",
		isOpen ? "nav-bar-menu-button-open" : "",
	]
		.join(" ")
		.trimEnd();
	const menuContentClass = [
		"nav-bar-menu-content",
		!isOpen ? "nav-bar-menu-content-hidden" : "nav-bar-menu-content-visible",
		wasReset ? "nav-bar-menu-content-fadeout" : "",
	]
		.join(" ")
		.trimEnd();
	
  return (
		<div className="nav-bar-menu">
			<button
				className={menuButtonClass}
				onMouseDown={handleMouseDown}
        onMouseEnter={handleMouseEnter}
      >
				<span className="nav-bar-menu-button-label">{props.label}</span>
			</button>
			<div
				ref={menuContentRef}
				className={menuContentClass}>
				{props.children}
			</div>
		</div>
  );
}

//--------------------------------------------------------



export interface NavBarMenuItemProps {
  label: string;
  checked?: boolean;
	hotkey?: string[]; 
	disabled?: boolean;
	onClick?: (e: React.MouseEvent) => void;
}

export function NavBarMenuItem(props: NavBarMenuItemProps) {
  const hotkey = props.hotkey || [] as string[];
  const joinedHotKey = hotkey.join("");
	const sortedHotKey = sortHotKey(hotkey);
	const className = [
		"nav-bar-menu-item",
		props.disabled ? "nav-bar-menu-item-disabled" : ""
	].join(' ').trim();
	const [menuState, setMenuState] = useRecoilState(navBarMenuState);
  return (
		<div className={className} onClick={(e) => {
			props.onClick && props.onClick(e);
			setMenuState({
				navBarHasFocus: false,
				openMenu: "",
			});
		}}>
      <span className="nav-bar-menu-item-checkmark">{props.checked ? "✓" : ""}</span>
      <span className="nav-bar-menu-item-label">{props.label}</span>
      <span className="nav-bar-menu-item-hotkey-container">
        {sortedHotKey.map((key, i) => <span key={joinedHotKey + String(i)}>{key}</span>)}
      </span>
		</div>
  );
}

//--------------------------------------------------------

export function NavBarMenuSeperator() {
	return <div className="nav-bar-menu-seperator" />;
}


export interface NavBarComponentProps {}

export function NavBarComponent(props: NavBarComponentProps) {

	const [displayStyleState, setDisplayStyleState] = useRecoilState(objectDisplayStyleState);
	const [menuState, setMenuState] = useRecoilState(navBarMenuState);
	const [hotkeyScope, setHotkeyScope] = useRecoilState(hotkeyScopeState)
	const ref = useClickOutside(() => setMenuState({
		navBarHasFocus: false,
		openMenu: ""
	}));
	
	const handleMouseEnter = () => {
		setHotkeyScope(HOTKEY_SCOPES.NAVBAR)
	}
	
	return (
		<NavBar ref={ref} onMouseEnter={handleMouseEnter}>
			<NavBarGroup>
				<NavBarMenu label="File">
					<NavBarMenuItem
						label="New"
						hotkey={[Characters.SHIFT, "N"]}
					/>
					<NavBarMenuItem
						label="Open"
						hotkey={[Characters.SHIFT, "O"]}
					/>
					<NavBarMenuItem
						label="Save"
						hotkey={[Characters.SHIFT, "S"]}
					/>
					<NavBarMenuSeperator />
					<NavBarMenuItem
						label="Import"
						hotkey={[Characters.SHIFT, "I"]}
					/>
				</NavBarMenu>
				<NavBarMenu label="Edit">
					<NavBarMenuItem
						label="Undo"
						hotkey={[Characters.COMMAND, "Z"]}
						disabled
					/>
					<NavBarMenuItem
						label="Redo"
						hotkey={[Characters.COMMAND, Characters.SHIFT, "Z"]}
						disabled
					/>
					<NavBarMenuSeperator />
					<NavBarMenuItem
						label="Duplicate"
						hotkey={[Characters.SHIFT, "D"]}
					/>
					<NavBarMenuItem
						label="Cut"
						hotkey={[Characters.COMMAND, "X"]}
					/>
					<NavBarMenuItem
						label="Copy"
						hotkey={[Characters.COMMAND, "C"]}
					/>
					<NavBarMenuItem
						label="Paste"
						hotkey={[Characters.COMMAND, "V"]}
					/>
				</NavBarMenu>
				<NavBarMenu label="Add">
					<NavBarMenuItem label="Source" />
					<NavBarMenuItem label="Receiver" />
					<NavBarMenuSeperator />
					<NavBarMenuItem
						label="Sketch"
						hotkey={[Characters.SHIFT, "S"]}
					/>
					<NavBarMenuSeperator />
					<NavBarMenuItem label="Ray Tracer" />
					<NavBarMenuItem label="2D-FDTD" />
					<NavBarMenuItem label="RT60" />
				</NavBarMenu>
				<NavBarMenu label="View">
					<NavBarMenuItem
						label="Renderer Stats"
						hotkey={[Characters.OPTION, "`"]}
						checked
					/>
					<NavBarMenuItem
						label={displayStyleState}
						onClick={(e) =>
							setDisplayStyleState((cur) =>
								cur === OBJECT_DISPLAY_STYLES.XRAY
									? OBJECT_DISPLAY_STYLES.NORMAL
									: OBJECT_DISPLAY_STYLES.XRAY
							)
						}
					/>
				</NavBarMenu>
				<NavBarMenu label="Help">
					<NavBarMenuItem label="Clear Local Storage" />
				</NavBarMenu>
			</NavBarGroup>
			<div className="nav-bar-blank-group"></div>
		</NavBar>
	);
}

import React, {
	useRef,
	Suspense,
	useEffect,
	useMemo,
} from "react";

import {
	Canvas,
	extend,
	useUpdate,
	useLoader,
	useResource,
} from "react-three-fiber";



import { useSpring, a } from 'react-spring/three';
import { OrbitControls, TransformControls, StandardEffects } from "drei";


import "./Editor.css";
import * as THREE from "three";

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';


import {
	useRecoilState
} from "recoil";



import {
	objectDisplayStyleState,
	sourcesState,
	hotkeyScopeState,
} from "../../state/GlobalState";
import { OBJECT_DISPLAY_STYLES, HOTKEY_SCOPES } from '../../constants';

import { Grid } from './Objects/Grid';
import { Axes } from "./Objects/Axes";
import { Lights } from './Env/Lights';
import { ContainerProps } from "react-three-fiber/targets/shared/web/ResizeContainer";
import AcousticSource, { AcousticSourceProps } from "./Objects/AcousticSource";

import { expose } from '../../util';



expose({ THREE });

extend({ Grid, Axes, AcousticSource})

const SurfaceGroup = ({ m, displayStyle }: { m: THREE.Mesh, displayStyle: string }) => {
	const meshRef = useRef<THREE.Mesh>(m);
	

	const color = (meshRef.current.material as THREE.MeshStandardMaterial)['color'] as THREE.Color;
	
	// console.log(displayStyle);
	const materialRef = useUpdate(
		(material: THREE.MeshStandardMaterial) => {
			// geometry.addAttribute("position", getVertices(x, y, z));
			// geometry.attributes.position.needsUpdate = true;
			// console.log(material.transparent);
		},
		[displayStyle] // execute only if these properties change
	);
	
	const transparent = displayStyle === OBJECT_DISPLAY_STYLES.XRAY;
	const wireframe = displayStyle === OBJECT_DISPLAY_STYLES.WIREFRAME;
	return (
		<a.mesh
			ref={meshRef}
			geometry={meshRef.current.geometry}
			// material={meshRef.current.material}
			castShadow
			receiveShadow
		>
			<a.meshStandardMaterial ref={materialRef} attach="material" color={color} side={THREE.DoubleSide} transparent={transparent} opacity={transparent ? 0.15 : 1.0}/>
		</a.mesh>
	)
}

const Room = ({ displayStyle }: { displayStyle: string; }) => {
	//@ts-ignore
	const { nodes } = useLoader(GLTFLoader, "/res/models/concord/concord.gltf");
	const groupRef = useRef<THREE.Group>();
	return (
		<group ref={groupRef}>
			{/* {<SurfaceGroup m={nodes.Scene.children[0].children[0]} />} */}
			{nodes.Scene.children[0].children.filter(x => x instanceof THREE.Mesh).map(x => <SurfaceGroup key={x.uuid} m={x} displayStyle={displayStyle} />)}
		</group>
	)
}


function AcousticSourceComponent({ source }: { source: AcousticSourceProps; }) {
	const src = useMemo(() => new AcousticSource(source), []);
	// const srcRef = useRef(src);

	
	useEffect(() => {
		console.log('useEffect');
		if (src.position.x !== source.position[0]) {
			src.position.setX(source.position[0]);
		}
	}, [source]);
	
	
	
	// console.log(srcRef);
	return (
		<primitive object={src} />
		// <acousticSource
		// 	args={[source]}
		// 	onClick={(e) => console.log(e)}
		// />
	);
}

interface ObjectsProps {
	displayStyle: string,
	sources: AcousticSourceProps[]
}

function Objects(props: ObjectsProps) {
	
	return (
		<group name={"objects"}>
			{/* <Room displayStyle={props.displayStyle} /> */}
			{props.sources.map(source => (
					<AcousticSourceComponent key={source.uuid} source={source} />
				)
			)}
		</group>
	);
}







function Environment() {
	const gridRef = useRef<Grid>();
	const axesRef = useRef<Axes>();
	return (
		<group name="environment">
			<grid
				ref={gridRef}
				args={["asdf", 50, 1, 10, 0x000000, 0xFFFFFF]}
			/>
			<axes
				ref={axesRef}
				args={["axes", 50, true, true, false]}
				/>
		</group>
	)
}


export function Editor() {

	
	const [displayStyleState, setDisplayStyleState] = useRecoilState(objectDisplayStyleState);
	const [hotkeyScope, setHotkeyScope] = useRecoilState(hotkeyScopeState);
	
	const [sources] = useRecoilState(sourcesState);
	
	
	const canvasProps: Partial<ContainerProps> = {
		gl2: true,
		shadowMap: true,
		invalidateFrameloop: true,
		pixelRatio: window.devicePixelRatio,
		style: {
			background: "rgb(251,250,249)"
		},
		camera: {
			up: [0, 0, 1],
			position: [30, 30, 4],
			near: 0.1,
			far: 100,
			fov: 45,
		},
		onCreated: ({ gl }) => {
			gl.shadowMap.enabled = true;
			gl.shadowMap.type = THREE.PCFSoftShadowMap;
		}
	}
	
	const orbitRef = useRef<OrbitControls>();

	
	// useEffect(() => {
	// 	if (transform.current) {
	// 		expose({ transform: transform.current });
	// 	}
	// }, [displayStyleState])
	
	
	
	const handleMouseEnter = () => {
		setHotkeyScope(HOTKEY_SCOPES.EDITOR);
	}
	
	
	const transformRef = useRef<TransformControls>();
	

	
	return (
		<div className="editor-container" onMouseEnter={handleMouseEnter}>
			<Canvas {...canvasProps}>
				<Lights />
				<Environment />
				<Suspense fallback={<React.Fragment />}>
					<Objects
						displayStyle={displayStyleState}
						sources={sources}
					/>
					<StandardEffects smaa ao={false} bloom={false} />
				</Suspense>
				<OrbitControls
					ref={orbitRef}
					enableDamping
					dampingFactor={0.5}
					screenSpacePanning
					mouseButtons={{
						LEFT: -1,
						MIDDLE: THREE.MOUSE.ROTATE,
						RIGHT: -1,
					}}
				/>
				{/* <TransformControls ref={transformRef}> */}
					{/* <group /> */}
				{/* </TransformControls> */}
			</Canvas>
		</div>
	);
}
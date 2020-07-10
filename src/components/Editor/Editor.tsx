import React, {
	useRef,
	useState,
	Suspense,
	useMemo,
	useEffect,
	// useEffect
} from "react";

import {
	Canvas,
	extend,
	// useThree,
	// useFrame,
	// useRender,
	useUpdate,
	useLoader,
	useResource,
	useFrame,
	useThree,
} from "react-three-fiber";
// import useMeasure from "react-use-measure";

import _extends from "@babel/runtime/helpers/esm/extends";
//@ts-ignore
import { useSpring, a } from 'react-spring/three';
// import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
// import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
// import { SSAOPass } from 'three/examples/jsm/postprocessing/SSAOPass';
// import { SAOPass } from 'three/examples/jsm/postprocessing/SAOPass';
import { OrbitControls } from "drei";
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import "./Editor.css";
import * as THREE from "three";
import { TextureLoader } from "three/src/loaders/TextureLoader.js";
// import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Controls, useControl } from "react-three-gui";
// import { ControlConfig } from "react-three-gui/dist/types";

import {
	useRecoilState
} from "recoil";

import { layoutChangingState } from '../SplitterLayout.state';

import { objectDisplayStyleState } from './Editor.state';
import { OBJECT_DISPLAY_STYLES } from './Editor.const';
import { RGBA_ASTC_5x4_Format, HalfFloatType } from "three";

import {
	SMAAImageLoader,
	EffectComposer,
	RenderPass,
	SMAAEffect,
	NormalPass,
	SSAOEffect,
	BlendFunction,
	BloomEffect,
	KernelSize,
	EffectPass,
} from "postprocessing";

import { Grid } from './Objects/Grid';
import { Axes } from "./Objects/Axes";

Object.assign(window, { THREE });

extend({Grid, Axes})

function Sphere({ position, radius }: { position: Number[], radius: number }) {
	// This reference will give us direct access to the mesh
	const mesh = useRef<THREE.Mesh>();

	const [hovered, setHovered] = useState(false);
	const [active, setActive] = useState(false);
	const props = useSpring({
		config: {
			duration: 0,
		},
		color: hovered || active ? "#3ABBCC" : "#aaaaaa",
	});

	return (
		<a.mesh
			ref={mesh}
			onPointerOver={() => setHovered(true)}
			onPointerOut={() => setHovered(false)}
			onClick={() => setActive(!active)}
			position={position}
			castShadow
			receiveShadow
		>
			
			<sphereBufferGeometry attach="geometry" args={[radius, 32, 32]} />
			<a.meshStandardMaterial attach="material" color={props.color} />
		</a.mesh>
	);
}

const LIGHTGROUP = 'LightGroup';

function Lights() {
	const [spotRef] = useResource<THREE.SpotLight>();
	

	const HemiIntensity = useControl("Hemi Intensity", {
		type: "number",
		group: LIGHTGROUP,
		distance: 10,
		scrub: false,
		min: 0,
		max: 1,
		spring: false,
		value: 0.25,
	});
	const AmbIntensity = useControl("Amb Intensity", {
		type: "number",
		group: LIGHTGROUP,
		distance: 10,
		scrub: false,
		min: 0,
		max: 1,
		spring: false,
		value: .6,
	});
	const spotIntensity = useControl("Spot Intensity", {
		type: "number",
		group: LIGHTGROUP,
		distance: 10,
		scrub: false,
		min: 0,
		max: 1,
		spring: false,
		value: 1
	});
	const spotLightPosX = useControl("spotLightPosX", {
		type: "number",
		group: LIGHTGROUP,
		// distance: 10,
		// scrub: false,
		min: -50,
		max: 50,
		// spring: false,
		value: 15,
	});
	const spotLightPosY = useControl("spotLightPosY", {
		type: "number",
		group: LIGHTGROUP,
		// distance: 10,
		// scrub: false,
		min: -50,
		max: 50,
		// spring: false,
		value: 10,
	});
	const spotLightPosZ = useControl("spotLightPosZ", {
		type: "number",
		group: LIGHTGROUP,
		// distance: 10,
		// scrub: false,
		min: -50,
		max: 50,
		// spring: false,
		value: 10,
	});

	const spotLightPenumbra = useControl("spotLightPenumbra", {
		type: "number",
		group: LIGHTGROUP,
		min: 0,
		max: 1,
		value: .5,
	});
	
	
	return (
		<>
			<ambientLight intensity={AmbIntensity} color={0xffffff} />
			<spotLight
				ref={spotRef}
				intensity={spotIntensity}
				position={[spotLightPosX, spotLightPosY, spotLightPosZ]}
				// target={[0,0,0]}
				
				distance={0}
				angle={Math.PI/2}
				penumbra={spotLightPenumbra}
				shadow-mapSize-width={2048}
				shadow-mapSize-height={2048}
				castShadow
			/> 
		</>
	);
}

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
function Objects({ displayStyle }: { displayStyle: string }) {
	
	const directLightRef = useRef<THREE.DirectionalLight>(new THREE.DirectionalLight(0xffffff, 0.5));
	

	
	return (
		<group name={"objects"}>
			<Room displayStyle={displayStyle}/>
		</group>
	);
}




const Plane = () => {
	
	const texture = useLoader(
		TextureLoader,
		"https://threejsfundamentals.org/threejs/resources/images/checker.png"
	);
	const planeSize = 1000;
	if (texture) {
			texture.wrapS = THREE.RepeatWrapping;
			texture.wrapT = THREE.RepeatWrapping;
			texture.magFilter = THREE.NearestFilter;
		  const repeats = planeSize / 2;
			texture.repeat.set(repeats, repeats);
			// texture.anisotropy = 16;
		}

	return (
		<group name="ground-plane">
			

			<mesh receiveShadow position={[0, 0, 0]}>
				<planeBufferGeometry
					attach="geometry"
					args={[planeSize, planeSize]}
				/>
				{texture && (
					<meshPhongMaterial
						polygonOffset
						polygonOffsetFactor={0.1}
						attach="material"
						map={texture}
						side={THREE.DoubleSide}
						transparent
						opacity={0.45}
					/>
				)}
			</mesh>
		</group>
	);
}

const Fog = () => {
	return (
		<fog attach="fog" args={[0xffffff, 20, 120]} />
	);
}

export interface EditorProps {}


function StandardEffects({
	smaa = true,
	ao = true,
	bloom = true,
	edgeDetection = 0.1,
	bloomOpacity = 1,
}) {
	const { gl, scene, camera, size } = useThree();
	const smaaProps = useLoader(SMAAImageLoader, "");
	const composer = useMemo(() => {
		const composer = new EffectComposer(gl, {
			frameBufferType: HalfFloatType,
		});
		composer.addPass(new RenderPass(scene, camera));
		//@ts-ignore
		const smaaEffect = new SMAAEffect(...smaaProps);
		smaaEffect.colorEdgesMaterial.setEdgeDetectionThreshold(edgeDetection);
		const normalPass = new NormalPass(scene, camera);
		const ssaoEffect = new SSAOEffect(
			camera,
			normalPass.renderTarget.texture,
			_extends(
				{
					blendFunction: BlendFunction.MULTIPLY,
					samples: 21,
					// May get away with less samples
					rings: 4,
					// Just make sure this isn't a multiple of samples
					distanceThreshold: 1.0,
					distanceFalloff: 0.0,
					rangeThreshold: 0.015,
					// Controls sensitivity based on camera view distance **
					rangeFalloff: 0.002,
					luminanceInfluence: 0.9,
					radius: 20,
					// Spread range
					scale: 1.0,
					// Controls intensity **
					bias: 0.05,
				},
				ao
			)
		);
		const bloomEffect = new BloomEffect(
			_extends(
				{
					opacity: 1,
					blendFunction: BlendFunction.SCREEN,
					kernelSize: KernelSize.VERY_LARGE,
					luminanceThreshold: 0.9,
					luminanceSmoothing: 0.07,
					height: 600,
				},
				bloom
			)
		);
		bloomEffect.blendMode.opacity.value = bloomOpacity;
		let effectsArray = [];
		if (smaa) effectsArray.push(smaaEffect);
		if (ao) effectsArray.push(ssaoEffect);
		if (bloom) effectsArray.push(bloomEffect);
		const effectPass = new EffectPass(camera, ...effectsArray);
		effectPass.renderToScreen = true;
		composer.addPass(normalPass);
		composer.addPass(effectPass);
		// console.log(composer);
		return composer;
	}, [camera, gl, scene, smaa, ao, bloom, edgeDetection, bloomOpacity]);
	useEffect(() => void composer.setSize(size.width, size.height), [
		composer,
		size,
	]);
	return useFrame((_, delta) => {
		composer.render(delta);
	}, 1);
}

export function Editor(props: EditorProps) {

	
	const [displayStyleState] = useRecoilState(objectDisplayStyleState);
	// const [ref, bounds] = useMeasure();
	const gridRef = useRef<Grid>();
	const axesRef = useRef<Axes>();

	
	return (
		<div className="editor-container">
			<Canvas
				gl2
				shadowMap
				invalidateFrameloop
				// resize={{ debounce: 60}}
				pixelRatio={window.devicePixelRatio}
				// color={0x424242}
				style={{
					// background: "#fdfcfd",
					// width: "100%",
					// objectFit: "fill",
					background: "#434342",
				}}
				camera={{
					up: [0, 0, 1],
					position: [30, 30, 4],
					near: 0.1,
					far: 100,
					fov: 45,
				}}
				onCreated={(props) => {
					const { gl } = props;
					// console.log(gl);
					let splitterElement = gl.domElement.parentElement;
					while (
						splitterElement.parentElement &&
						!splitterElement.className.match(/splitter-layout/i)
					) {
						splitterElement = splitterElement.parentElement;
					}
					const attrObserver = new MutationObserver((mutations) => {
						mutations.forEach((mu) => {
							if (mu.type === "attributes") {
								// gl.domElement.style.width = '100%';
								// gl.domElement.parentElement.style.background = '100%';
							}
						})
					});

					const sidebar_element =
						splitterElement.children[
							splitterElement.children.length - 1
						];
					attrObserver.observe(splitterElement, {
						attributes: true,
						attributeOldValue: true,
					});
					attrObserver.observe(sidebar_element, {
						attributes: true,
						attributeOldValue: true,
					});
					



					gl.shadowMap.enabled = true;
					gl.shadowMap.type = THREE.PCFSoftShadowMap;
				}}
			>
				<Lights />
				<Suspense fallback={<React.Fragment />}>
					{/* <Plane />
					 */}
					<grid
						ref={gridRef}
						args={["asdf", 50, 1, 10, 0x000000, 0xFFFFFF]} 
					/>
					<axes
						ref={axesRef}
						args={["axes", 50, true, true, false]} 
					/>
					<Objects displayStyle={displayStyleState} />
					<StandardEffects
						smaa
						ao={false}
						bloom={false}
					/>
				</Suspense>
				<OrbitControls
					enableDamping
					dampingFactor={0.5}
					screenSpacePanning
					mouseButtons={{
						LEFT: -1,
						MIDDLE: THREE.MOUSE.ROTATE,
						RIGHT: -1,
					}}
				/>
			</Canvas>
			{/* <Controls /> */}
		</div>
	);
}
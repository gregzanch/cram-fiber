// import React, { useRef } from "react";
// import { extend } from 'react-three-fiber';
import { ModifiedGridHelper } from "./ModifiedGridHelper";



import { Object3D, Mesh, TextureLoader, RepeatWrapping, NearestFilter, PlaneBufferGeometry, MeshPhongMaterial, FrontSide, LineBasicMaterial} from 'three';


export interface GridProps {
  size?: number;
  cellSize?: number;
  majorLinesEvery?: number;
}


export class Grid extends Object3D {
  gridHelper: ModifiedGridHelper;
  majorGridHelper: ModifiedGridHelper;
  planeMesh: Mesh;
  size: number;
  cellSize: number;
  majorLinesEvery: number;
  divisions: number;
  constructor(name?: string, size?: number, cellSize?: number, majorLinesEvery?: number,) {
    super();
    this.name = name || "grid";
    
    this.size = size || 1000;
    this.cellSize = cellSize || 1;
    this.majorLinesEvery = majorLinesEvery || 10;
    this.divisions = this.size / this.cellSize;
    
    const loader = new TextureLoader();
    
    const TEXTURE_CHECKER = loader.load('/res/textures/checker.png');
    
    TEXTURE_CHECKER.wrapS = RepeatWrapping;
    TEXTURE_CHECKER.wrapT = RepeatWrapping;
    TEXTURE_CHECKER.magFilter = NearestFilter;
    TEXTURE_CHECKER.repeat.set(this.divisions / 2, this.divisions / 2);

    const planeGeo = new PlaneBufferGeometry(this.size, this.size);
    planeGeo.name = "grid-checkered-plane-geometry";
    const planeMat = new MeshPhongMaterial({
      fog: true,
      map: TEXTURE_CHECKER,
      side: FrontSide,
      transparent: true,
      opacity: 0.025,
      name: "grid-checkered-material"
    });
    this.planeMesh = new Mesh(planeGeo, planeMat);


    this.gridHelper = new ModifiedGridHelper(this.size, this.divisions, 0, 0, i => i % this.majorLinesEvery != 0);
    this.gridHelper.renderOrder = -1;
    const material = this.gridHelper.material as LineBasicMaterial;
    material.fog = true;
    material.transparent = true;
    material.opacity = 0.1;
    material.color.setRGB(0, 0, 0);
    this.add(this.gridHelper);

    this.majorGridHelper = new ModifiedGridHelper(this.size, this.divisions, 0, 0, (i) => i % this.majorLinesEvery == 0 && i != this.divisions / 2);
    this.majorGridHelper.renderOrder = -0.5;
    const majorMaterial = this.majorGridHelper.material as LineBasicMaterial;
    majorMaterial.fog = true;
    majorMaterial.transparent = true;
    majorMaterial.opacity = 0.2;
    majorMaterial.color.setRGB(0, 0, 0);
    this.add(this.majorGridHelper);

    this.add(this.planeMesh);
  }
  get mesh() {
    return this.children[2];
  }
}


export default Grid;


// export interface GridProps {
//   size: number;
//   divisions: number;
//   color1: number;
//   color2: number;
//   skipFunction: 
// }

// export const Grid = (props: GridProps) => {
//   const helper = useRef<ModifiedGridHelper>();

  
//   return (
//     <modifiedGridHelper
//       args={[size, divisions, color1, color2, skipFunction]}
//       ref={helper}
//       position={[0, 0, 0]}
//       rotation={[Math.PI / 2, 0, 0, "XYZ"]}
//     />
//   );
// };

// export default Grid;
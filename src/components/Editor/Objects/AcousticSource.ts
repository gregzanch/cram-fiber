
import { Object3D, Mesh, SphereBufferGeometry, MeshStandardMaterial } from "three";
import { MathUtils } from "three/src/math/MathUtils";

export interface AcousticSourceProps {
  name: string;
  kind: string;
  visible: boolean;
  position: [number, number, number];
  scale: [number, number, number];
  rotation: [number, number, number, string];
  uuid: string;
  color: number;
}

export function getDefaultAcousticSourceProps(){
  return {
		name: "acoustic source",
		kind: "AcousticSource",
		visible: true,
		position: [0, 0, 0],
		scale: [1, 1, 1],
		rotation: [0, 0, 0, "XYZ"],
		uuid: MathUtils.generateUUID(),
		color: 0x4CBE04,
  } as AcousticSourceProps;
}


export class AcousticSource extends Object3D {
  props: AcousticSourceProps;
  
  // material: MeshStandardMaterial;
  // geometry: SphereBufferGeometry;
  mesh: Mesh;
  constructor(props?: AcousticSourceProps) {
    super();
    this.mesh = new Mesh(
      new SphereBufferGeometry(.25, 16, 16),
      new MeshStandardMaterial({
        name: "AcousticSource material",
        color: 0x015C01
      })
    );
    this.add(
      this.mesh
    );
    this.props = props || getDefaultAcousticSourceProps();
    this.uuid = this.props.uuid;
    this.name = this.props.name;
    this.visible = this.props.visible;
    this.position.fromArray(this.props.position);
    this.scale.fromArray(this.props.scale);
    this.rotation.fromArray(this.props.rotation);
    (this.mesh.material as MeshStandardMaterial).color.set(this.props.color);
    
    console.log('created acoustic source');
    
    
  }
  
  setFromProps(props: AcousticSourceProps) {
    
  }
  

}

export default AcousticSource;
import { Line, Vector3, LineBasicMaterial, Geometry, Object3D} from "three";

export class Axes extends Object3D {
  Xaxis: Line;
  Yaxis: Line;
  Zaxis: Line;
  constructor(name: string = "axes", size: number = 1000, Xaxis: boolean = true, Yaxis: boolean=true, Zaxis: boolean=false) {
    super();
    this.name = name;
    size = size / 2;
    this.Xaxis = new Line(this.makeLine(
      new Vector3(-size, 0, 0),
      new Vector3(+size, 0, 0)
    ), new LineBasicMaterial({
      fog: true,
      color: 0xCD6E7A,
      visible: Xaxis,
      name: "x-axis-material"
    }));
    this.Xaxis.geometry.name = "x-axis-geometry";

    this.Yaxis = new Line(
      this.makeLine(new Vector3(0, -size, 0), new Vector3(0, +size, 0)),
      new LineBasicMaterial({
        fog: true,
        color: 0x7F984A,
        visible: Yaxis,
        name: "y-axis-material"
      })
    );
    this.Yaxis.geometry.name = "y-axis-geometry";

    this.Zaxis = new Line(
      this.makeLine(
        new Vector3(0, 0, -size),
        new Vector3(0, 0, +size)
      ),
      new LineBasicMaterial({
        fog: true,
        color: 0x0000ff,
        visible: Zaxis,
        name: "z-axis-material",
      })
    );
    this.Zaxis.geometry.name = "z-axis-geometry";

    this.renderOrder = -0.1;
    this.add(this.Xaxis, this.Yaxis, this.Zaxis);

  }
  makeLine(start: Vector3, end: Vector3) {
    const geometry = new Geometry();
    geometry.vertices.push(start);
    geometry.vertices.push(end);
    return geometry;
  }
}

export default Axes;
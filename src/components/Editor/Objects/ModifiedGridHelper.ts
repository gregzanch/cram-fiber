//@ts-nocheck
/**
 * @author mrdoob / http://mrdoob.com/
 */



import {
  LineSegments,
  LineBasicMaterial,
  Float32BufferAttribute,
  BufferGeometry,
  Color
} from "three";

function createGeometryAndMaterial(size, divisions, color1, color2, skipFunction) {
  size = size || 10;
  divisions = divisions || 10;
  color1 = new Color(color1 !== undefined ? color1 : 0x444444);
  color2 = new Color(color2 !== undefined ? color2 : 0x888888);

  var center = divisions / 2;
  var step = size / divisions;
  var halfSize = size / 2;

  var vertices = [],
    colors = [];

  for (var i = 0, j = 0, k = -halfSize; i <= divisions; i++, k += step) {
    if (skipFunction(i)) {

      vertices.push(-halfSize, k, 0, halfSize, k, 0);
      vertices.push(k, -halfSize, 0, k, halfSize, 0);

      var color = i === center ? color1 : color2;

      color.toArray(colors, j);
      j += 3;
      color.toArray(colors, j);
      j += 3;
      color.toArray(colors, j);
      j += 3;
      color.toArray(colors, j);
      j += 3;
    }
  }

  var geometry = new BufferGeometry();
  geometry.name = "grid-helper-geometry";
  geometry.setAttribute("position", new Float32BufferAttribute(vertices, 3));
  geometry.setAttribute("color", new Float32BufferAttribute(colors, 3));


  
  var material = new LineBasicMaterial({
    vertexColors: true,
    name: "grid-helper-material"
  });
  
  return [geometry, material] as [BufferGeometry, LineBasicMaterial];
  
}

export class ModifiedGridHelper extends LineSegments {
  // material: LineBasicMaterial;
  constructor(size, divisions, color1, color2, skipFunction) {
    super(...createGeometryAndMaterial(size, divisions, color1, color2, skipFunction));
  }
  
  copy(source) {
    LineSegments.prototype.copy.call(this, source);

    this.geometry.copy(source.geometry);
    this.material.copy(source.material);

    return this;
  }
}


import React, { useMemo, useEffect } from 'react';
import AcousticSource, { AcousticSourceProps } from './AcousticSource';

export function AcousticSourceComponent({ source }: { source: AcousticSourceProps; }) {
  const src = useMemo(() => new AcousticSource(source), []);
  // const srcRef = useRef(src);


  useEffect(() => {
    src.name !== source.name && (src.name = source.name);
    src.visible !== source.visible && (src.visible = source.visible);
    
    src.position.x !== source.position[0] && src.position.setX(source.position[0]);
    src.position.y !== source.position[1] && src.position.setY(source.position[1]);
    src.position.z !== source.position[2] && src.position.setZ(source.position[2]);

    src.scale.x !== source.scale[0] && src.scale.setX(source.scale[0]);
    src.scale.y !== source.scale[1] && src.scale.setY(source.scale[1]);
    src.scale.z !== source.scale[2] && src.scale.setZ(source.scale[2]);
    
    src.rotation.x !== source.rotation[0] && (src.rotation.x = source.rotation[0]);
    src.rotation.y !== source.rotation[1] && (src.rotation.y = source.rotation[1]);
    src.rotation.z !== source.rotation[2] && (src.rotation.z = source.rotation[2]);
    
        
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

export default AcousticSourceComponent;
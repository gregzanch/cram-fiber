import React from 'react';

import { useResource } from "react-three-fiber";

export function Lights() {
  const [spotRef] = useResource<THREE.SpotLight>();

  return (
    <group name="lights">
      <ambientLight intensity={.8} color={0xffffff} />
      <spotLight
        ref={spotRef}
        intensity={.6}
        position={[15, 10, 10]}
        distance={0}
        angle={Math.PI / 2}
        penumbra={.5}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        castShadow
      />
    </group>
  );
}


export default Lights;
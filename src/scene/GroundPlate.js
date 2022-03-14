import { Plane } from "@react-three/drei";
import * as THREE from "three"

export const GroundPlane = () => (
    <Plane args={[10000, 10000]} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 500]}>
      <meshStandardMaterial 
        color={new THREE.Color("#101010")} 
        roughness={0.7}
        // normalMap={useTexture('./surface_normal.jpg')}
        normalScale={0.5}
      />
    </Plane>
  )
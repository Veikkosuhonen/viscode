import { Text } from "@react-three/drei";
import { forwardRef } from "react";
import { lineHeight } from "../utils/formatting";

export const FlatText = forwardRef(({text, color, fontSize = 1, x = 0, y = 0.5,  z = 0}, ref) => (
    <Text 
        anchorX={'left'}
        anchorY={'top'}
        fontSize={fontSize}
        // font={'./RobotoMono-Regular.ttf'}
        lineHeight={lineHeight}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[x, y, z]}   
    >
        <meshPhongMaterial 
            attach="material" 
            color={color}
            shininess={90}
            ref={ref}
            emissive={color}
            emissiveIntensity={0.2}
        />
        {text}
    </Text>
))
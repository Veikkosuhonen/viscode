import { useFrame } from "@react-three/fiber"
import { Suspense, useEffect, useRef } from "react"
import useHovered from "../hooks/useHovered"
import useSelected from "../hooks/useSelected"
import * as THREE from "three"
import { Box } from "@react-three/drei"
import { colors } from "../utils/colors"
import { FlatText } from "./FlatText"
import { lineHeight } from "../utils/formatting"
import _ from "lodash"

export const Code = ({ token, position, size,  }) => {

    const { selected, select } = useSelected()
    const { hovered, hover, unHover } = useHovered()

    const meshRef = useRef()

    const titleActive = hovered?.token === token
    const srcActive = selected === token

    return (
        <group 
            position={position} 
            onClick={() => select(token)} 
            onPointerOver={() => hover({ mesh: meshRef.current, token })} 
            onPointerOut={() => unHover({ mesh: meshRef.current, token })}
        >
            <Box rotation={[0, 0, 0]} args={[70, 10, size]} position={[30, -5, size / 2 - 1]} ref={meshRef}>
                <meshStandardMaterial 
                    color={(srcActive ? colors.nord1 : colors.nord0)}
                />
            </Box>
            
            {titleActive && 
            <FlatText text={token.name || "Anonymous"} color={colors.snow1} fontSize={6} x={-4} y={1} z={size / 2 - 5}/>
            }
            {srcActive && 
            <Suspense>
                <FlatText text={token.src} color={colors.snow0} z={lineHeight / 2}/>
                <FlatText 
                    text={_.range(token.start, token.end + 1).map(n => n.toString()).reduce((text, lineN) => `${text}${lineN}\n`, '')} 
                    x={-4} z={lineHeight / 2}
                    color={colors.nord3}
                /> 
            </Suspense>
            }
        </group>
    )
}
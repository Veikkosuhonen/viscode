import { useFrame } from "@react-three/fiber"
import { useRef } from "react"
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
    const { hover, unHover } = useHovered()

    const textRef = useRef()
    const lineNumberRef = useRef()
    const titleRef = useRef()
    const meshRef = useRef()

    const active = selected === token

    /*useFrame((state) => {
        //if (!(textRef.current && titleRef.current)) return
        const distance = new THREE.Vector3(...position).distanceTo(state.camera.position)
        const codeOpacity = Math.min(Math.max((150 - distance) * 0.01 + 1, 0), 1)
        const titleOpacity = Math.min(Math.max((distance - 120) * 0.01, 0), 1)
        if (codeOpacity <= 0.05) {
            textRef.current.visible = false
            lineNumberRef.current.visible = false
        } else {
            textRef.current.visible = true
            lineNumberRef.current.visible = true
            textRef.current.opacity = codeOpacity
            lineNumberRef.current.opacity = codeOpacity
        }
        if (titleOpacity <= 0.05) {
            titleRef.current.visible = false
        } else {
            titleRef.current.visible = true
            titleRef.current.opacity = titleOpacity
        }
    })*/

    return (
        <group 
            position={position} 
            onClick={() => select(token)} 
            onPointerOver={() => hover(meshRef.current)} 
            onPointerOut={() => unHover(meshRef.current)}
        >
            <Box rotation={[0, 0, 0]} args={[70, 10, size]} position={[30, -5, size / 2 - 1]} ref={meshRef}>
                <meshStandardMaterial 
                    color={(active ? colors.nord1 : colors.nord0)}
                />
            </Box>
            <FlatText 
                text={_.range(token.start, token.end + 1).map(n => n.toString()).reduce((text, lineN) => `${text}${lineN}\n`, '')} 
                x={-4} z={lineHeight / 2}
                color={colors.nord3}
                ref={lineNumberRef}
            />
            <FlatText text={token.name} color={colors.snow1} fontSize={6} x={-4} y={1} z={size / 2 - 5} ref={titleRef}/>
            <FlatText text={token.src} color={colors.snow0} z={lineHeight / 2} ref={textRef}/>
        </group>
    )
}
import React, { forwardRef, useEffect, useRef, useState } from 'react'
import *  as THREE from 'three'
import { Text, Box, CubicBezierLine, Plane  } from '@react-three/drei'
import './styles.css'
import getParsedCode from './scriptLoader'
import { useFrame } from '@react-three/fiber'
import _ from 'lodash'
import useSelected from './useSelected'
import { colors } from './colors'
import useHovered from './useHovered'

const lineHeight = 1.4

const SourceFile = ({...props}) => {
    const name = props.url.slice(props.url.lastIndexOf('/') + 1, props.url.length)
    const { selected } = useSelected()
    const [tokens, setTokens] = useState(null)
    useEffect(() => {
        getParsedCode(props.url).then(tokens => setTokens(tokens))
    }, [props.url])

    const tokenPosition = (line, index) => line * lineHeight + index * 5

    const dimensions = tokens?.map((t, index) => {
        const size = (t.end - t.start + 2) * lineHeight + 2
        const position = tokenPosition(t.start, index)
        return [size, position]
    })

    const size = tokens ? tokenPosition(tokens[tokens.length - 1].end, tokens.length) + 20 : 0

    return (
        <group position={[props.pos * 300, 20, 0]}>
            <FlatText text={name} x={-30} z={-30} fontSize={14} color={colors.nord3} />
        {tokens?.map(t => (
            <>
            <Code key={t.index} 
                token={t}
                position={[0, 0, dimensions[t.index][1]]}
                size={dimensions[t.index][0]}
            />
            {selected && t.references.filter(r => (t === selected || r.token === selected)).map(r => {
                const outgoing = t !== selected
                const k = Math.abs(r.token.index - t.index) * 5
                const startZ = tokenPosition(r.line, t.index) + 1
                const endZ = dimensions[r.token.index][1] + 1
                

                return (
                    <>
                    <CubicBezierLine 
                        key={`${startZ}-${endZ}`}
                        start={[0, 1, startZ]}
                        midA={[-20 - k, 1, startZ]}
                        midB={[-20 - k, 1, endZ]}
                        end={[0, 1, endZ]}
                        lineWidth={0.5}
                        color={outgoing ? 0x5E81AC : 0xBF616A}
                    >
                    </CubicBezierLine>
                    <LineHighlight z={startZ} color={colors.nord3}/>
                    <LineHighlight z={endZ} color={colors.frost3}/>
                    </>
                )
            })}
            </>
        ))}
        <Box args={[90, 10, size]} position={[30, -10, size / 2 - 10]}>
            <meshStandardMaterial color={colors.nord0} metalness={0.5}/>
        </Box>
        </group>
    )
}

const LineHighlight = ({ z, color }) => (
    <Plane args={[70, lineHeight]} position={[30, 0.1, z + lineHeight / 3]} rotation={[-Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color={color}/>
    </Plane>
)


const FlatText = forwardRef(({text, color, fontSize = 1, x = 0, y = 0.5,  z = 0}, ref) => (
    <Text 
        anchorX={'left'}
        anchorY={'top'}
        fontSize={fontSize}
        font={'./RobotoMono-Regular.ttf'}
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

const Code = ({ token, position, size,  }) => {

    const { selected, select } = useSelected()
    const { hover, unHover } = useHovered()

    const textRef = useRef()
    const lineNumberRef = useRef()
    const titleRef = useRef()
    const meshRef = useRef()

    const active = selected === token

    useFrame((state) => {
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
    })

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

export default SourceFile
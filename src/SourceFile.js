import React, { forwardRef, useEffect, useRef, useState } from 'react'
import *  as THREE from 'three'
import { Text, Box, CubicBezierLine  } from '@react-three/drei'
import './styles.css'
import getParsedCode from './scriptLoader'
import { useFrame } from '@react-three/fiber'

const SourceFile = ({...props}) => {
    const [selected, setSelected] = useState(null)
    const [tokens, setTokens] = useState(null)
    useEffect(() => {
        getParsedCode(props.url).then(tokens => setTokens(tokens))
    }, [props.url])

    const tokenPosition = (line, index) => line * 1.2 + index * 5

    const dimensions = tokens?.map((t, index) => {
        const size = (t.end - t.start + 2) * 1.2 + 2
        const position = tokenPosition(t.start, index)
        return [size, position]
    })


    return (
        <>
        {tokens?.map(t => (
            <>
            <Code key={t.index} 
                token={t}
                position={[props.pos * 100, 20, dimensions[t.index][1]]}
                size={dimensions[t.index][0]}
                onClick={it => setSelected(it === selected ? null : it)}
                active={t === selected}
            />
            {t.references.filter(r => (t === selected || r.token === selected)).map(r => {
                const outgoing = t !== selected
                const k = Math.abs(r.token.index - t.index) * 3
                const startZ = tokenPosition(r.line, t.index) + 1
                const endZ = dimensions[r.token.index][1] + 1
                

                return (
                    <CubicBezierLine 
                        start={[props.pos * 100, 21, startZ]}
                        midA={[props.pos * 100 - 30 - k, 21, startZ]}
                        midB={[props.pos * 100 - 30 - k, 21, endZ]}
                        end={[props.pos * 100, 20, endZ]}
                        lineWidth={1}
                        color={outgoing ? 0x5E81AC : 0xBF616A}
                    >
                    </CubicBezierLine>
                )
            })}
            </>
        ))}
        </>
    )
}

const FlatText = forwardRef(({text, color, fontSize = 1, x = 0, z = 0}, ref) => (
    <Text 
        anchorX={'left'}
        anchorY={'top'}
        fontSize={fontSize}
        lineHeight={1.2}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[x, 0.5, z]}   
    >
        <meshPhongMaterial 
            attach="material" 
            color={new THREE.Color(color)}
            shininess={90}
            specular={new THREE.Color(color).multiplyScalar(0.2)}
            ref={ref}
            
        />
        {text}
    </Text>
))

const Code = ({ token, position, size, active, onClick }) => {

    const [hover, setHover] = useState(false)

    const textRef = useRef()
    const titleRef = useRef()

    useFrame((state) => {
        //if (!(textRef.current && titleRef.current)) return
        const distance = new THREE.Vector3(...position).distanceTo(state.camera.position)
        textRef.current.opacity = Math.min(Math.max((200 - distance) * 0.01 + 1, 0), 1)
        titleRef.current.opacity = Math.min(Math.max((distance - 200) * 0.01, 0), 1)
    })

    return (
        <mesh position={position} onClick={() => onClick(token)} onPointerOver={() => setHover(true)} onPointerOut={() => setHover(false)}>
            <Box rotation={[0, 0, 0]} args={[70, 10, size]} position={[30, -5, size / 2 - 1]}>
                <meshStandardMaterial 
                    color={hover ? new THREE.Color('#4C566A') : (active ? new THREE.Color('#434C5E') : new THREE.Color("#2D3040"))}
                />
            </Box>
            <FlatText text={token.name} color={'#A3BE8C'} fontSize={4} z={size / 2} ref={titleRef}/>
            <FlatText text={token.src} color={'#8FBCBB'} z={0.6} ref={textRef}/>
        </mesh>
    )
}

export default SourceFile
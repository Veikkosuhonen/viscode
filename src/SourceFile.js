import React, { useEffect, useState } from 'react'
import *  as THREE from 'three'
import { Text, Box, CubicBezierLine  } from '@react-three/drei'
import './styles.css'
import getParsedCode from './scriptLoader'

const SourceFile = ({...props}) => {
    const [selected, setSelected] = useState(null)
    const [tokens, setTokens] = useState(null)
    useEffect(() => {
        getParsedCode(props.url).then(tokens => setTokens(tokens))
    }, [])

    const tokenPosition = (line, index) => line * 1.2 + index * 10

    const dimensions = tokens?.map((t, index) => {
        const size = (t.end - t.start + 5) * 1.2 + 2
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
                onClick={it => setSelected(it)}
            />
            {t.references.filter(r => (t === selected || r.token === selected)).map(r => {
                const k = Math.abs(r.token.index - t.index) * 3
                const startZ = tokenPosition(r.line, t.index)
                const endZ = dimensions[r.token.index][1]

                return (
                    <CubicBezierLine 
                        start={[props.pos * 100, 20, startZ]}
                        midA={[props.pos * 100 - 30 - k, 20 + k, startZ]}
                        midB={[props.pos * 100 - 30 - k, 20 + k, endZ]}
                        end={[props.pos * 100, 20, endZ]}
                        lineWidth={1}
                        color={t === selected ? 0x5E81AC : 0xBF616A}
                    >
                    </CubicBezierLine>
                )
            })}
            </>
        ))}
        </>
    )
}

const FlatText = ({text, color, fontSize = 1, x = 0, z = 0}) => (
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
        />
        {text}
    </Text>
)

const Code = ({ token, position, size, active, onClick }) => {

    const [hover, setHover] = useState(false)

    return (
        <mesh position={position} onClick={() => onClick(token)} onPointerOver={() => setHover(true)} onPointerOut={() => setHover(false)}>
            <Box rotation={[0, 0, 0]} args={[70, 10, size]} position={[30, -5, size / 2 - 1]}>
                <meshStandardMaterial 
                    color={hover ? new THREE.Color('#4C566A') : (active ? new THREE.Color('#434C5E') : new THREE.Color("#2D3040"))}
                />
            </Box>
            {/*<FlatText text={name} color={'#A3BE8C'} fontSize={3}/>*/}
            <FlatText text={token.src} color={'#8FBCBB'} z={-0.6}/ >
        </mesh>
    )
}

export default SourceFile
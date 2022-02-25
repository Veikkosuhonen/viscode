import React, { useEffect, useState } from 'react'
import *  as THREE from 'three'
import { Text, Plane, MeshReflectorMaterial, Box, useTexture  } from '@react-three/drei'
import './styles.css'
import getParsedCode from './scriptLoader'
import { MeshNormalMaterial } from 'three'

const SourceFile = ({...props}) => {
    const [tokens, setTokens] = useState(null)
    useEffect(() => {
        getParsedCode(props.url).then(tokens => setTokens(tokens))
    }, [])


    return (
        <>
        {tokens?.map((t, index) => {
            const size = (t.end - t.start + 1)
            return (
            <Code key={index} 
                text={t.src} 
                position={[props.pos * 100, 20, t.start * 1.3 + index * 3]}
                size={size * 1.2 + 2}
            />
            )
        })}
        </>
    )
}

const Code = ({ text, position, size }) => {
    
    return (
        <mesh position={position}>
            <Box rotation={[0, 0, 0]} args={[70, 10, size]} position={[30, -5, size / 2 - 1]}>
                <meshStandardMaterial 
                    color={new THREE.Color("#2D3040")} 
                    envMapIntensity={0.05}
                />
            </Box>
            <Text 
                anchorX={'left'}
                anchorY={'top'}
                fontSize={1}
                lineHeight={1.2}
                rotation={[-Math.PI / 2, 0, 0]}
                position={[0, 0.5, 0]}
            >
                <meshStandardMaterial color={new THREE.Color("#8FBCBB")}/>
                {text}
            </Text>
        </mesh>
    )
}

export default SourceFile
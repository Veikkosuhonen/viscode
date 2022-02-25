import ReactDOM from 'react-dom'
import React, { Suspense, useEffect, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, OrbitControls, useTexture,  MeshReflectorMaterial, Sky, Text, Html  } from '@react-three/drei'
import './styles.css'
import axios from 'axios'
import getParsedCode from './scriptLoader'

function Box(props) {
  // This reference gives us direct access to the THREE.Mesh object
  const ref = useRef()
  // Hold state for hovered and clicked events
  const [hovered, hover] = useState(false)
  const [clicked, click] = useState(false)
  // Subscribe this component to the render-loop, rotate the mesh every frame
  useFrame((state, delta) => (ref.current.rotation.x += 0.01))
  // Return the view, these are regular Threejs elements expressed in JSX
  return (
    <mesh
      {...props}
      ref={ref}
      scale={clicked ? 1.5 : 1}
      onClick={(event) => click(!clicked)}
      onPointerOver={(event) => hover(true)}
      onPointerOut={(event) => hover(false)}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} emissive={1.0} />
    </mesh>
  )
}

const Ground = () => (
  <mesh rotation={[-Math.PI / 2, 0, Math.PI / 2]}>
  <planeGeometry args={[1000, 1000]}/>
  <MeshReflectorMaterial
    resolution={512} 
    mirror={0.4} mixBlur={6} mixStrength={1.5} 
    normalMap={useTexture('./surface_normal.jpg')}
    roughnessMap={useTexture('./surface_var.jpg')}
    color="#a0a0a0" metalness={0.5}
    normalScale={[2, 2]}
    reflectorOffset={0.2}
  />
  </mesh>
)

const Code = ({ ...props }) => {
  
  const [text, setText] = useState(null)
  useEffect(() => {
    getParsedCode().then(code => setText(code))
  })

  return (
    <Html transform>
      <div>
        <p>{text}</p>
      </div>
    </Html>
  )
}

const Scene = () => (
  <Canvas concurrent gl={{ alpha: false }} pixelRatio={[1, 1.5]} camera={{ position: [0, 100, 100], fov: 45 }} shadows>

    <Suspense fallback={null}>
      <Code position={[0, 1, 0]} rotation={[-Math.PI / 2, 0, Math.PI / 2]}/>
      <Ground />
      <Sky distance={450000} inclination={50} azimuth={0.25} elevation={0} />

    </Suspense>

    <ambientLight intensity={0.0} />
    <directionalLight position={[-20, 0, -10]} intensity={0.2} />
    
    <OrbitControls makeDefault />
  </Canvas>
)

ReactDOM.render(
  <Scene />,
  document.getElementById('root'),
)
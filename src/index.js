import ReactDOM from 'react-dom'
import React, { Suspense } from 'react'
import *  as THREE from 'three'
import { Canvas } from '@react-three/fiber'
import { Sky, MapControls, Environment, Plane, MeshReflectorMaterial, useTexture  } from '@react-three/drei'
import './styles.css'
import SourceFile from './SourceFile'

const urls = [
  'https://raw.githubusercontent.com/UniversityOfHelsinkiCS/palaute/master/src/server/controllers/courseSummaryController.js',
  'https://raw.githubusercontent.com/UniversityOfHelsinkiCS/palaute/master/src/server/util/courseSummary/getOrganisationSummaries.js',
  'https://raw.githubusercontent.com/UniversityOfHelsinkiCS/palaute/master/src/server/util/courseSummary/getCourseRealisationSummaries.js'
]

const GroundPlane = () => (
  <Plane args={[1000, 2000]} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 500]}>
    <MeshReflectorMaterial 
      color={new THREE.Color("#1a1a1a")} 
      roughness={0.7}
      mirror={1}
      normalMap={useTexture('./surface_normal.jpg')}
      normalScale={0.5}
      reflectorOffset={1}
    />
  </Plane>
)

const Scene = () => {

  return (
    
    <Canvas 
      pixelRatio={[1, 1.5]} 
      camera={{ position: [0, 100, 100], fov: 45, far: 4000 }} 
    >
      <color attach="background" args={["lightpink"]} />

      <Suspense fallback={null}>
        {urls.map((url, index) => <SourceFile key={index} pos={index-1} url={url}/> )}
        {/*<Ground />*/}
        <Sky distance={450000} inclination={50} azimuth={0.25} elevation={0} />
        <Environment preset='city' />
        <GroundPlane />
      </Suspense>
      <ambientLight intensity={0.1}/>
      <MapControls makeDefault />
    </Canvas>
  )
}
ReactDOM.render(
  <Scene />,
  document.getElementById('root'),
)
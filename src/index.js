import ReactDOM from 'react-dom'
import React, { Suspense } from 'react'
import *  as THREE from 'three'
import { Canvas } from '@react-three/fiber'
import { Sky, MapControls, Plane, useTexture  } from '@react-three/drei'
import './styles.css'
import SourceFile from './SourceFile'
import { EffectComposer, Outline } from '@react-three/postprocessing'
import { colors, init } from './colors'
import useHovered from './useHovered'

const urls = [
  'https://raw.githubusercontent.com/UniversityOfHelsinkiCS/palaute/master/src/server/controllers/courseSummaryController.js',
  'https://raw.githubusercontent.com/UniversityOfHelsinkiCS/palaute/master/src/server/util/courseSummary/getOrganisationSummaries.js',
  'https://raw.githubusercontent.com/UniversityOfHelsinkiCS/palaute/master/src/server/util/courseSummary/getCourseRealisationSummaries.js'
]

const GroundPlane = () => (
  <Plane args={[10000, 10000]} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 500]}>
    <meshStandardMaterial 
      color={new THREE.Color("#101010")} 
      roughness={0.7}
      normalMap={useTexture('./surface_normal.jpg')}
      normalScale={0.5}
    />
  </Plane>
)

const Scene = () => {

  const { hovered } = useHovered()

  return (
    
    <Canvas 
      pixelRatio={[1, 1.5]} 
      camera={{ position: [0, 100, 100], fov: 70, far: 4000 }} 
    >

      <Suspense fallback={null}>
        {urls.map((url, index) => <SourceFile key={index} pos={index-1} url={url}/> )}
        <Sky distance={450000} inclination={50} azimuth={0.25} elevation={0} />
        <GroundPlane />
      </Suspense>

      <ambientLight intensity={0.1}/>
      <directionalLight position={[50, 200, -200]} intensity={0.2}/>

      

      <MapControls makeDefault maxPolarAngle={Math.PI / 3}/>

      <EffectComposer multisampling={8} autoClear={false}>
        <Outline blur selection={hovered} visibleEdgeColor={colors.success} edgeStrength={1}/>
      </EffectComposer>
    </Canvas>
  )
}

init()

ReactDOM.render(
  <Scene />,
  document.getElementById('root'),
)
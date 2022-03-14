import { MapControls, Sky } from "@react-three/drei"
import { Canvas } from "@react-three/fiber"
import { EffectComposer, Outline } from "@react-three/postprocessing"
import { Suspense } from "react"
import { colors } from "../utils/colors"
import { GroundPlane } from "./GroundPlate"
import SourceFile from "./SourceFile"
import useHovered from "../hooks/useHovered"
import { FlatText } from "./FlatText"

export const Scene = ({
  files
}) => {

    const { hovered } = useHovered()
  
    return (
      
      <Canvas 
        pixelRatio={[1, 1.5]} 
        dpr={[1, 2]}
        className="canvas"
        camera={{ position: [0, 100, 100], fov: 70, far: 4000 }} 
      >
  
        <Suspense fallback={null}>
          {files 
          ? files.map((file, index) => <SourceFile key={index} pos={index-1} file={file}/> )
          : <FlatText text={"Loading repository"} fontSize={10} color={colors.snow1} />}
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
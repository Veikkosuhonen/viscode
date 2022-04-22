import { MapControls, Sky } from "@react-three/drei"
import { Canvas } from "@react-three/fiber"
import { EffectComposer, Outline } from "@react-three/postprocessing"
import { Suspense } from "react"
import { colors } from "../utils/colors"
import SourceFile from "./SourceFile"
import useHovered from "../hooks/useHovered"
import { FlatText } from "./FlatText"
import useFiles from "../hooks/useFiles"

const toList = (parent) => parent.isDirectory ? [parent, ...parent.children.flatMap(toList)] : [parent]

export const Scene = () => {
    const { files } = useFiles()
    // const { hovered } = useHovered()
    console.log(`Rendering ${files?.length} files`)
    const acualFiles = toList(files).filter(f => !f.isDirectory)
    console.log(acualFiles)

    return (
      
      <Canvas 
        pixelRatio={[1, 1.5]} 
        dpr={[1, 2]}
        className="canvas"
        camera={{ position: [0, 100, 100], fov: 70, far: 4000 }} 
      >
  
        <Suspense fallback={null}>
          {acualFiles?.length !== 0
          && acualFiles.map((file, index) => <SourceFile key={file.id} pos={index-1} file={file}/> )
          }
          <Sky distance={450000} inclination={50} azimuth={0.25} elevation={0} />
        </Suspense>
  
        <ambientLight intensity={0.2}/>
        <directionalLight position={[50, 200, -200]} intensity={0.2}/>
  
        <MapControls makeDefault maxPolarAngle={Math.PI / 3}/>
  
        {/*<EffectComposer multisampling={8} autoClear={false}>
          <Outline blur selection={hovered?.mesh} visibleEdgeColor={colors.success} edgeStrength={1}/>
          </EffectComposer>*/}
      </Canvas>
    )
  }
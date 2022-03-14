import { CubicBezierLine, Plane } from "@react-three/drei"
import { colors } from "../utils/colors"
import { lineHeight } from "../utils/formatting"

const LineHighlight = ({ z, color }) => (
    <Plane args={[70, lineHeight]} position={[30, 0.1, z + lineHeight / 3]} rotation={[-Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color={color}/>
    </Plane>
)

export const TokenLink = ({
    outgoing,
    k,
    startZ,
    endZ
}) => {
    

    return (
        <group>
            <CubicBezierLine 
                start={[0, 1, startZ]}
                midA={[-20 - k, 1, startZ]}
                midB={[-20 - k, 1, endZ]}
                end={[0, 1, endZ]}
                lineWidth={0.2}
                color={outgoing ? 0x5E81AC : 0xBF616A}
            >
            </CubicBezierLine>
            <LineHighlight z={startZ} color={colors.nord3}/>
            <LineHighlight z={endZ} color={colors.frost3}/>
        </group>
    )
}


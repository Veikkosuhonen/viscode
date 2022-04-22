import { useEffect, useState } from 'react'
import { Box } from '@react-three/drei'
import getParsedCode from '../utils/scriptLoader'
import useSelected from '../hooks/useSelected'
import { colors } from '../utils/colors'
import { TokenLink } from './TokenLink'
import { lineHeight, tokenPosition } from '../utils/formatting'
import { FlatText } from './FlatText'
import { Code } from './Code'

const SourceFile = ({ pos, file }) => {

    const { selected } = useSelected()
    const [tokens, setTokens] = useState(null)

    useEffect(() => {
        getParsedCode(file).then(tokens => setTokens(tokens))
    }, [file])

    const dimensions = tokens?.map((t, index) => {
        const size = (t.end - t.start + 2) * lineHeight + 2
        const position = tokenPosition(t.start, index)
        return [size, position]
    })

    const size = tokens ? tokenPosition(tokens[tokens.length - 1].end, tokens.length) + 20 : 0
    
    const name = file?.url ? file.url.substr(file.url.lastIndexOf('/') + 1) : "Loading"

    return (
        <group position={[pos * 200, 20, 0]}>
            <FlatText text={name} x={-30} z={-30} fontSize={14} color={colors.nord3} />
            {tokens?.map(t => (
                <group key={file.id + t.index}>
                    <Code 
                        token={t}
                        position={[0, 0, dimensions[t.index][1]]}
                        size={dimensions[t.index][0]}
                    />
                    {selected && t.references.filter(r => (t === selected || r.token === selected)).map(r => {
 
                        return <TokenLink 
                            key={r.line + t.start}
                            outgoing={t !== selected}
                            k={Math.abs(r.token.index - t.index) * 5}
                            startZ={tokenPosition(r.line, t.index) + 1}
                            endZ={dimensions[r.token.index][1] + 1}
                        />
                    })}
                </group>
            ))}
            <Box args={[90, 10, size]} position={[30, -10, size / 2 - 10]}>
                <meshStandardMaterial color={colors.nord0} metalness={0.5}/>
            </Box>
        </group>
    )
}

export default SourceFile
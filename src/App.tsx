import { useState } from "react"
import { Scene } from "./scene/Scene"
import { getRepository } from "./utils/getRepository"

export const App = () => {
    const [files, setFiles] = useState([])

    const getRepo = async () => {
        const dashit = await getRepository()
        setFiles(dashit)
    }

    return (
        <main>
            <Scene files={files}/>
            <div className="overlay">
                <h1>Hallou</h1>
                <button onClick={getRepo}>Big bada boom</button>
            </div>
        </main>
    )
}
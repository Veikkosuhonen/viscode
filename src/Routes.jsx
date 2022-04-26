import { BrowserRouter, Route, Routes as AppRoutes } from "react-router-dom"
import { Graph } from "./Graph/Graph"
import Home from "./Home"
import Scene3d from "./Scene3d"

const Routes = () => {
    return (
        <BrowserRouter>
            <AppRoutes>
                <Route path="/" element={<Home />} />
                <Route path="/scene3d" element={<Scene3d />} />
                <Route path="/graph" element={<Graph />} />
            </AppRoutes>
        </BrowserRouter>
    )
}

export default Routes
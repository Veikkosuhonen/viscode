import { BrowserRouter, Route, Routes as AppRoutes } from "react-router-dom"
import Home from "./Home"
import Scene3d from "./Scene3d"

const Routes = () => {
    return (
        <BrowserRouter>
            <AppRoutes>
                <Route path="/" element={<Home />} />
                <Route path="/scene3d" element={<Scene3d />} />
            </AppRoutes>
        </BrowserRouter>
    )
}

export default Routes
import { Box } from "@mui/material"
import { Link } from "react-router-dom"

const Overlay = () => {
  return (
    <Box display="flex" position="absolute" zIndex={10}>
      <Link to="/">
        Home
      </Link>
    </Box>
  )
}

export default Overlay
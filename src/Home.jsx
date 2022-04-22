import { Box, Button, CircularProgress, Container, Paper, TextField, Typography } from "@mui/material"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import useFiles from "./hooks/useFiles"
import { Scene } from "./scene3d/Scene"
import { getRepository } from "./utils/getRepository"

const Home = () => {
  const { files, setFiles } = useFiles()
  const navigate = useNavigate()
  const [repo, setRepo] = useState("")
  const [err, setErr] = useState("")
  const [loading, setLoading] = useState(false)

  const getRepo = async () => {
    setLoading(true)
    try {
      const dashit = await getRepository(repo)
      setFiles(dashit)
      navigate("/scene3d")
    } catch(error) {
      setErr("That repository does not exist, or is private!")
    }
    setLoading(false)
  }

  return (
    <Box width="full" height="100%" display="flex" justifyContent="center">
      <Box display="flex" flexDirection="column">
        <Typography variant="h1">
          Stuff here!
        </Typography>
        <Box display="flex">
          <Box flexGrow={1}>
            <TextField label="Github repo" placeholder="<username>/<repository>" 
              value={repo}
              onChange={(event) => { setRepo(event.target.value); setErr(""); }}
              error={err?.length > 0}
              helperText={err}
            />
          </Box>
          {loading ? <CircularProgress /> : <Button onClick={getRepo}>
            Clone
          </Button>}
          {files?.length > 0 &&
          <>a</>
          }
        </Box>
      </Box>
    </Box>
  )
}
export default Home
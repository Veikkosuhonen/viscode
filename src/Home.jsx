import { Box, Button, CircularProgress, Container, Paper, TextField, Typography } from "@mui/material"
import { useState } from "react"
import { Link } from "react-router-dom"
import useFiles from "./hooks/useFiles"
import { getRepository } from "./utils/getRepository"

const RepoOverview = ({ root }) => {

  return (
    <Box>
      <Button component={Link} to="/graph" >View graph</Button>
      <Button component={Link} to="/scene3d">View in 3d</Button>
    </Box>
  )
}

const Home = () => {
  const { files, setFiles } = useFiles()
  const [repoName, setRepoName] = useState("")
  const [err, setErr] = useState("")
  const [loading, setLoading] = useState(false)

  const getRepo = async () => {
    setLoading(true)
    try {
      const root = await getRepository(repoName)
      setFiles(root)
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
              value={repoName}
              onChange={(event) => { setRepoName(event.target.value); setErr(""); }}
              error={err?.length > 0}
              helperText={err}
            />
          </Box>
          {loading ? <CircularProgress /> : <Button onClick={getRepo}>
            Clone
          </Button>}
        </Box>
        {files &&
          <RepoOverview root={files} />
        }
      </Box>
    </Box>
  )
}
export default Home
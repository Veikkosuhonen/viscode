import git from "isomorphic-git"
import http from "isomorphic-git/http/web"
import { FileSystem, File } from "./fileSystem"

const dir = "repo"

export const getRepository = async (): Promise<File[]> => {
   
    const fs = new FileSystem()
    await fs.init()

    console.log("cloning...")
    await git.clone({
        fs: fs.fs,
        http,
        dir,
        corsProxy: 'https://cors.isomorphic-git.org',
        url: 'https://github.com/UniversityOfHelsinkiCS/palaute',
        ref: 'master',
        singleBranch: true,
        depth: 1
    })
    console.log("done")
    
    return await fs.walkFiles(dir)
}



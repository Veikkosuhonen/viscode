import git from "isomorphic-git"
import http from "isomorphic-git/http/web"
import { FileSystem, File } from "./fileSystem"

const dir = "UniversityOfHelsinkiCS/palaute"

export const getRepository = async (gitUrl: string): Promise<File> => {
   
    const fs = new FileSystem()
    await fs.init()

    console.log("cloning...")
    await git.clone({
        fs: fs.fs,
        http,
        dir: gitUrl,
        corsProxy: 'http://localhost:9999',
        url: 'https://github.com/' + gitUrl,
        ref: 'master',
        singleBranch: true,
        depth: 2,
        noCheckout: false,
        // exclude: ['.git']
    })
    console.log("done")
    
    return await fs.walkFiles(gitUrl)
}



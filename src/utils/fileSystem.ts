import * as BrowserFS from "browserfs"


export type File = {
    url: string,
    content: string,
    isDirectory: boolean
}

export class FileSystem {

    public fs: any;

    private me = "FileSystem"

    constructor() {
        this.fs = null
    }

    public async init() {
        this.fs = await this.initFileSystem()
    }

    public async walkFiles(path: string, extension: string = "js"): Promise<File[]> {
        this.fs.stat(path, (_, stats) => console.log(stats))
        this.fs.stat(path + "/src", (_, stats) => console.log(stats))
        const children: string[] = await this.readDir(path)
        const files: File[] = []
        await Promise.all(children.map(p => `${path}/${p}`).map(async child => {
            console.log("path:" + child)
            if (await this.isDirectory(child)) {
                files.push(...await this.walkFiles(child)) 
            } else if (child.endsWith(extension)) {
                files.push({
                    url: child,
                    content: await this.readFile(child),
                    isDirectory: false
                })
            }
        }, this))
        return files
    }

    public readDir = async (path: string): Promise<string[]> => {
        return new Promise((resolve, _) => {
            this.fs.readdir(path, (_, res: string[]) => resolve(res))
        })
    }

    public isDirectory = async (path: string): Promise<boolean> => {
        return new Promise((resolve, _) => {
            this.fs.stat(path, (_, stats) => resolve(stats && stats.isDirectory()))
        })
    }

    public readFile = async (path: string): Promise<string> => {
        return new Promise((resolve, _) => {
            this.fs.readFile(path, { encoding: "utf8" }, (_, res: string) => resolve(res))
        })
    }

    private initFileSystem = async () => {
        return new Promise((resolve, reject) => {
            console.log(`initializing fs`);
            BrowserFS.install(window);
            BrowserFS.FileSystem.IndexedDB.Create({ storeName: "my-store", },
                (e, idbfs) => {
                    const inMemory = new BrowserFS.FileSystem.InMemory();
                    BrowserFS.FileSystem.AsyncMirror.Create(
                        {
                            sync: inMemory,
                            async: idbfs,
                        },
                        (e, mirrored) => {
                            BrowserFS.initialize(mirrored);
                            console.log(`fs initialized`);
                            resolve(BrowserFS.BFSRequire('fs'));
                        },
                    );
                },
            );
        })
    }
}
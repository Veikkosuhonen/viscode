import * as BrowserFS from "browserfs"


export type File = {
    id: string,
    url: string,
    content: string,
    isDirectory: boolean,
    selectedToView: boolean,
    children: File[],
    parent: File,
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

    public async walkFiles(path: string, extension: string = "js"): Promise<File> {
        const root: File = {
            id: "#",
            url: path,
            content: null,
            isDirectory: true,
            selectedToView: false,
            children: [],
            parent: null,
        }
        return this._walkFiles(root)
    }

    private async _walkFiles(parent: File, extension: string = "js"): Promise<File> {

        const childrenUrls: string[] = await this.readDir(parent.url)
        const children: File[] = []

        await Promise.all(childrenUrls.map(p => `${parent.url}/${p}`)
            .filter(Boolean)
            .filter(childUrl => !childUrl.includes('.git'))
            .map(async (childUrl, i) => {
            if (await this.isDirectory(childUrl)) {
                const child: File = {
                    id: parent.id + String.fromCharCode(i + 65),
                    url: childUrl,
                    content: null,
                    isDirectory: true,
                    selectedToView: false,
                    children: [],
                    parent
                }
                children.push(await this._walkFiles(child))
            } else if (childUrl.endsWith(extension)) {
                children.push({
                    id: parent.id + String.fromCharCode(i + 65),
                    url: childUrl,
                    content: await this.readFile(childUrl),
                    isDirectory: false,
                    selectedToView: false,
                    children: [],
                    parent
                })
            }
        }, this))

        parent.children = children

        return parent
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
            BrowserFS.FileSystem.InMemory.Create({ storeName: "my-store", },
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
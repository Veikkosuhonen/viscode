const { default: axios } = require('axios')
const babel = require('@babel/parser')

const load = async (url) => {
    return axios.get(url).then(res => res.data)
}

const getTree = (src) => {
    return babel.parse(
        src,
        {

        }
    )
}

const getTopTokens = (ast, src) => 
    ast.map(token => ({
        name: token.declarations ? token.declarations[0].id.name : 'anon',
        start: token.loc.start.line,
        end: token.loc.end.line,
        src: src.substring(token.loc.start.index, token.loc.end.index)
    }))


const getParsedCode = async (url) => {
    const src = await load(url)
    const ast = getTree(src).program.body
    const tokens = getTopTokens(ast, src)
    /*console.log(Object.keys(ast.program))
    console.log(Object.keys(ast.program.body))
    console.log(Object.keys(ast.program.body))*/
    return tokens
}

export default getParsedCode
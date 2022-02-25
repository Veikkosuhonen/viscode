const { default: axios } = require('axios')
const babel = require('@babel/parser')

const url = 'https://raw.githubusercontent.com/UniversityOfHelsinkiCS/palaute/master/src/server/util/courseSummary/getOrganisationSummaries.js'

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

const getParsedCode = async () => {
    const ast = getTree(await load(url))
    console.log(Object.keys(ast))
    console.log(Object.keys(ast.program))
    console.log(Object.keys(ast.program.body))
    console.log(Object.keys(ast.program.body))
    return JSON.stringify(ast.program.body[0], null, 2)
}

export default getParsedCode
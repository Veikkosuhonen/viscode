import { File } from "./fileSystem"

const babel = require('@babel/parser')

const getTree = (src: string, jsx: boolean = false) => {
    return babel.parse(
        src,
        {
            sourceType: "module",
            plugins: ["jsx"]
        }
    )
}

interface Token {
    name: string,
    start: number,
    end: number,
    src: string,
    references: string[] | Token[],
    index: number
}

const getTopTokens = (ast, src) => 
    ast.map((token, index) => ({
        name: token.declarations ? token.declarations[0].id.name : undefined,
        start: token.loc.start.line,
        end: token.loc.end.line,
        src: src.substring(token.loc.start.index, token.loc.end.index),
        references: findBlockReferences(token),
        index
    }))

const findExpressionReferences = (expression) => {

    const references = []
    if (!expression) return []

    if (expression.type === 'BinaryExpression' || expression.type === 'LogicalExpression') {
        references.push(...findExpressionReferences(expression.left))
        references.push(...findExpressionReferences(expression.right))

    } else if (expression.type === 'CallExpression') {
        references.push(...findExpressionReferences(expression.callee))
        expression.arguments.forEach(arg => {
            references.push(...findExpressionReferences(arg))
        })

    } else if (expression.type === 'Identifier') {
        references.push({ name: expression.name, line: expression.loc.start.line })

    } else if (expression.type === 'ArrowFunctionExpression') {
        references.push(...findExpressionReferences(expression.body))

    } else if (expression.type === 'BlockStatement') {
        expression.body.forEach(token => {
            references.push(...findBlockReferences(token))
        })

    } else if (expression.type === 'ReturnStatement') {
        references.push(...findExpressionReferences(expression.argument))

    } else if (expression.type === 'IfStatement') {
        references.push(...findExpressionReferences(expression.consequent))
        references.push(...findExpressionReferences(expression.alternate))

    } else if (expression.type === 'MemberExpression') {
        references.push(...findExpressionReferences(expression.object))

    } else if (expression.type === 'ConditionalExpression') {
        references.push(...findExpressionReferences(expression.test))
        references.push(...findExpressionReferences(expression.consequent))
        references.push(...findExpressionReferences(expression.alternate))

    } else if (expression.type === 'AwaitExpression') {
        references.push(...findExpressionReferences(expression.argument))

    } else if (expression.type === 'ArrayExpression') {
        expression.elements.forEach(e => {
            references.push(...findExpressionReferences(e))
        })

    } else if (expression.type === 'AssignmentExpression') {
        references.push(...findExpressionReferences(expression.left))
        references.push(...findExpressionReferences(expression.right))

    } else if (expression.type === 'ObjectExpression') {
        expression.properties.forEach(p => {
            references.push(...findExpressionReferences(p.value))
        })
    }

    return references
}

const findBlockReferences = (ast) => {
    const references = []

    if (ast.type === 'VariableDeclaration') {
        ast.declarations.forEach(d => {
            references.push(...findExpressionReferences(d.init))
        })

    } else if (ast.type === 'ExpressionStatement') {
        references.push(...findExpressionReferences(ast.expression))
    }

    // console.log(ast.name, references)

    return references
}

const processReferences = (tokens: Token[]) => {
    tokens.forEach(token => {
        token.references = token.references
            .map(reference => ({ token: tokens.find(token2 => token2.name === reference.name), ...reference }))
            .filter(r => r.token !== undefined)
    })
}


const getParsedCode = async (file: File): Promise<Token[]> => {
    const src = file.content
    const ast = getTree(src).program.body
    const tokens = getTopTokens(ast, src)
    // tokens.forEach(t => console.log(t.name, "references", t.references.map(r => r.name)))
    processReferences(tokens)
    //tokens.forEach(t => console.log(t.name, "references", t.references.map(r => r.name)))

    return tokens
}

export default getParsedCode
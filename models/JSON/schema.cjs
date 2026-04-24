const fs = require('fs')
const path = require('path')

const inputFile = process.argv[2]
const modelsDir = __dirname

const toSingular = (name) => {
    if (name.endsWith('ies')) return `${name.slice(0, -3)}y`
    if (name.endsWith('s')) return name.slice(0, -1)
    return name
}

const toPascalCase = (name) =>
    name
        .split(/[^a-zA-Z0-9]/)
        .filter(Boolean)
        .map((part) => `${part[0].toUpperCase()}${part.slice(1)}`)
        .join('')

const getMongooseType = (value) => {
    if (typeof value === 'number') return 'Number'
    if (typeof value === 'boolean') return 'Boolean'
    if (Array.isArray(value)) return '[Schema.Types.Mixed]'
    if (value && typeof value === 'object') return 'Schema.Types.Mixed'
    return 'String'
}

const buildModelCode = (rawName, object) => {
    const name = toSingular(rawName)
    const Name = toPascalCase(name)

    const schemaLines = Object.entries(object).map(
        ([key, value]) => `\t${key}: ${getMongooseType(value)}`
    )

    return `import mongoose, { Schema, model } from 'mongoose'
import type { InferSchemaType } from 'mongoose'

export const ${name}Schema = new Schema({
${schemaLines.join(',\n')}
})


export const ${Name} = mongoose.models.${Name} || model<InferSchemaType<typeof ${name}Schema>>('${Name}', ${name}Schema)
`
}

const getJsonFiles = () => {
    if (inputFile) return [inputFile]

    return fs
        .readdirSync(modelsDir)
        .filter((file) => file.endsWith('.json'))
}

const jsonFiles = getJsonFiles()

jsonFiles.forEach((file) => {
    const filePath = path.join(modelsDir, file)
    const content = fs.readFileSync(filePath, 'utf8')
    const data = JSON.parse(content)
    const object = Array.isArray(data) ? data[0] : data

    if (!object || typeof object !== 'object') {
        console.warn(`Skipping ${file}: no object sample found`)
        return
    }

    const rawName = path.basename(file, '.json')
    const Name = toPascalCase(toSingular(rawName))
    const tsFilePath = path.join(modelsDir, `${Name}.ts`)
    const code = buildModelCode(rawName, object)

    fs.writeFileSync(tsFilePath, code, 'utf8')
    console.log(`Generated ${path.basename(tsFilePath)} from ${file}`)
})

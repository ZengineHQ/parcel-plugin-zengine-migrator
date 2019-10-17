const path = require('path')
const fs = require('fs')

const promisify = function (fn) {
  return function (...args) {
    return new Promise(function (resolve, reject) {
      fn(...args, function (err, ...res) {
        if (err) return reject(err)

        if (res.length === 1) return resolve(res[0])

        resolve(res)
      })
    })
  }
}

const relCwd = (...segments) => path.resolve(process.cwd(), ...segments)

const kebabToCamelCase = string => string.replace(/-(.)/g, (match, first) => first.toUpperCase())

const wgnTransformer = (contents, namespace) => contents
  .replace(/wgn([A-Za-z])/g, (match, first) => `${kebabToCamelCase(namespace)}${first.toUpperCase()}`)
  .replace(/wgn/g, () => namespace)

const mayaJSON = fs.existsSync(relCwd('..', '..', 'maya.json')) && require(relCwd('..', '..', 'maya.json'))

const pluginName = path.basename(process.cwd())

if (mayaJSON) {
  try {
    mayaJSON.environments[process.env.ZENGINE_ENV].plugins[pluginName].namespace.toUpperCase()
  } catch (e) {
    console.error(`malformed maya.json:`, e)
  }
}

const getNamespace = () => {
  return mayaJSON ? mayaJSON.environments[process.env.ZENGINE_ENV].plugins[pluginName].namespace : 'default'
}

module.exports = {
  promisify,
  relCwd,
  kebabToCamelCase,
  wgnTransformer,
  getNamespace
}

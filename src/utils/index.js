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

const readFile = promisify(fs.readFile)

const relCwd = (...segments) => path.resolve(process.cwd(), ...segments)

const kebabToCamelCase = string => string.replace(/-(.)/g, (match, first) => first.toUpperCase())

/**
 * Transforms camelCase strings to dash-separated ones.
 *
 * @param {string} str
 * @return {string}
 *
 * Based on https://gist.github.com/youssman/745578062609e8acac9f
 */
const camelCaseToKebab = str => {
  return str.toString().trim()
    .replace(/[A-Z]/g, m => `-${m.toLowerCase()}`)
    .toLowerCase()
}

const mayaJSONPath = relCwd('..', '..', 'maya.json')

let mayaJSON = fs.existsSync(mayaJSONPath) &&
  JSON.parse(fs.readFileSync(mayaJSONPath, { encoding: 'utf8' }))

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

const getRoute = () => {
  return (mayaJSON && mayaJSON.environments[process.env.ZENGINE_ENV].plugins[pluginName].route) || getNamespace()
}

const wgnTransformer = (contents, namespace) => contents
  .replace(/wgn([A-Za-z])/g, (match, first) => `${kebabToCamelCase(namespace)}${first.toUpperCase()}`)
  .replace(/wgn-/g, () => `${camelCaseToKebab(namespace)}-`)
  .replace(/wgn/g, () => namespace)

const replaceRouteTransformer = (contents, route) => contents
  .replace(new RegExp('{replace-route}', 'g'), route)

const updateMayaJSON = async () => {
  mayaJSON = await readFile(mayaJSONPath, { encoding: 'utf8' })
    .then(str => JSON.parse(str))
    .catch(err => {
      console.error('malformed maya.json:', err)

      return mayaJSON
    })
}

module.exports = {
  promisify,
  relCwd,
  kebabToCamelCase,
  wgnTransformer,
  getNamespace,
  camelCaseToKebab,
  getRoute,
  replaceRouteTransformer,
  updateMayaJSON
}

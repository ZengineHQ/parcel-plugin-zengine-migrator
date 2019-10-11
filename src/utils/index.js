const path = require('path')

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

const getNamespace = () => {
  return 'letter-generator'
}

module.exports = {
  promisify,
  relCwd,
  kebabToCamelCase,
  wgnTransformer,
  getNamespace
}

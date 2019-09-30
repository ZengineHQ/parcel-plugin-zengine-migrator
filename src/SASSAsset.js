const fs = require('fs')
const { relCwd, promisify } = require('./utils')
const readFile = promisify(fs.readFile)

const SASSAsset = parseInt(process.versions.node, 10) < 8
  ? require('parcel-bundler/lib/assets/SASSAsset.js')
  : require('parcel-bundler/src/assets/SASSAsset.js')

class ZengineMigratorSASSAsset extends SASSAsset {
  async pretransform() {
    this.contents = await this.interpolate(this.contents)
    return super.pretransform()
  }

  async interpolate(code) {
    const css = await findAndReadFile(relCwd('.legacy-output', 'plugin.css'))
    const scss = await findAndReadFile(relCwd('.legacy-output', 'plugin.scss'))

    const replacement = scss.trim().length ? scss : css

    return code.replace(/\/\*\s*PLUGIN_CSS\s*\*\//, () => replacement)
  }
}

function findAndReadFile (path) {
  return readFile(path, { encoding: 'utf8' }).catch(err => '')
}

module.exports = ZengineMigratorSASSAsset

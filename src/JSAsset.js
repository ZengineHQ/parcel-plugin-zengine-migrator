const { readFileSync } = require('fs')
const { relCwd } = require('./utils')

const JSAsset = parseInt(process.versions.node, 10) < 8
  ? require('parcel-bundler/lib/assets/JSAsset.js')
  : require('parcel-bundler/src/assets/JSAsset.js')

class ZengineMigratorJSAsset extends JSAsset {
  async pretransform () {
    this.contents = this.interpolate(this.contents)
    return super.pretransform()
  }

  interpolate (code) {
    const replacement = readFileSync(relCwd('.legacy-output', 'plugin.js'), { encoding: 'utf8' })

    return code.replace(/\/\*\s*PLUGIN_JS\s*\*\//, () => replacement)
  }
}

module.exports = ZengineMigratorJSAsset

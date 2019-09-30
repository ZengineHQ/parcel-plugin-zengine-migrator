const { readFileSync } = require('fs')
const { relCwd } = require('./utils')

const SASSAsset = parseInt(process.versions.node, 10) < 8
  ? require('parcel-bundler/lib/assets/SASSAsset.js')
  : require('parcel-bundler/src/assets/SASSAsset.js')

class ZengineMigratorSASSAsset extends SASSAsset {
  async pretransform() {
    this.contents = this.interpolate(this.contents)
    return super.pretransform()
  }

  interpolate(code) {
    const css = readFileSync(relCwd('.legacy-output', 'plugin.css'), { encoding: 'utf8' })
    const scss = readFileSync(relCwd('.legacy-output', 'plugin.scss'), { encoding: 'utf8' })

    const replacement = scss.trim().length ? scss : css

    return code.replace(/\/\*\s*PLUGIN_CSS\s*\*\//, () => replacement)
  }
}

module.exports = ZengineMigratorSASSAsset

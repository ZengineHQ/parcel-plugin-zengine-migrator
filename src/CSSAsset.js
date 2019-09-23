const { readFileSync } = require('fs')
const { resolve } = require('path')

const CSSAsset = parseInt(process.versions.node, 10) < 8
  ? require('parcel-bundler/lib/assets/CSSAsset.js')
  : require('parcel-bundler/src/assets/CSSAsset.js')

class ZengineMigratorCSSAsset extends CSSAsset {
  async pretransform() {
    this.contents = this.interpolate(this.contents)
    return super.pretransform()
  }

  interpolate(code) {
    const replacement = readFileSync(resolve(process.cwd(), '.legacy-output', 'plugin.css'), { encoding: 'utf8' })

    return code.replace(/\/\*\s*PLUGIN_CSS\s*\*\//, () => replacement)
  }
}

module.exports = ZengineMigratorCSSAsset

const { readFileSync } = require('fs')
const { relCwd } = require('./utils')

const HTMLAsset = parseInt(process.versions.node, 10) < 8
  ? require('parcel-bundler/lib/assets/HTMLAsset.js')
  : require('parcel-bundler/src/assets/HTMLAsset.js')

class ZengineMigratorHTMLAsset extends HTMLAsset {
  async pretransform () {
    this.contents = this.interpolate(this.contents)
    return super.pretransform()
  }

  interpolate (code) {
    const replacement = readFileSync(relCwd('.legacy-output', 'plugin.html'), { encoding: 'utf8' })
    console.log('hereeeee')
    return code.replace(`%PLUGIN_HTML%`, replacement)
  }
}

module.exports = ZengineMigratorHTMLAsset

const JSAsset = parseInt(process.versions.node, 10) < 8
  ? require('parcel-bundler/lib/assets/JSAsset.js')
  : require('parcel-bundler/src/assets/JSAsset.js');

const CSSAsset = parseInt(process.versions.node, 10) < 8
  ? require('parcel-bundler/lib/assets/CSSAsset.js')
  : require('parcel-bundler/src/assets/CSSAsset.js');

const HTMLAsset = parseInt(process.versions.node, 10) < 8
  ? require('parcel-bundler/lib/assets/HTMLAsset.js')
  : require('parcel-bundler/src/assets/HTMLAsset.js');

class ZengineMigratorJSAsset extends JSAsset {
  async pretransform () {
    this.contents = this.interpolate(this.contents)
    return super.pretransform()
  }

  interpolate (code) {
    const replacement = require('fs').readFileSync(require('path').resolve(process.cwd(), 'v1-output', 'plugin.js'))
    return code.replace(/\/\*\s*PLUGIN_JS\s*\*\//, replacement)
  }
}
  
class ZengineMigratorCSSAsset extends CSSAsset {
  async pretransform() {
    this.contents = this.interpolate(this.contents)
    return super.pretransform()
  }

  interpolate(code) {
    const replacement = fs.readFileSync(path.resolve(process.cwd(), 'v1-output', 'plugin.css'))
    return code.replace(/\/\*\s*PLUGIN_CSS\s*\*\//, replacement)
  }
}

class ZengineMigratorHtmlAsset extends HTMLAsset {
  async pretransform () {
    this.contents = this.interpolate(this.contents)
    return super.pretransform()
  }

  interpolate (code) {
    const replacement = require('fs').readFileSync(require('path').resolve(process.cwd(), 'v1-output', 'plugin.html'))

    return code.replace(`%PLUGIN_HTML%`, replacement)
  }
}

module.exports = {
  ZengineMigratorJSAsset,
  ZengineMigratorCSSAsset,
  ZengineMigratorHTMLAsset
}
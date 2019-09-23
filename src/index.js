const path = require('path')
const fs = require('fs')
const { relCwd } = require('./utils')
const registerExtractor = require('./register-extractor')

module.exports = (bundler) => {
  // Add special asset types for interpolating the plugin assets into the wrapper files
  bundler.addAssetType('.js', require.resolve('./JSAsset.js'))
  bundler.addAssetType('.css', require.resolve('./CSSAsset.js'))
  bundler.addAssetType('.html', require.resolve('./HTMLAsset.js'))

  // Setup watcher for the source files
  bundler.on('bundled', bundle => {
    const bundleDir = path.dirname(bundle.name || bundler.mainBundle.childBundles.values().next().value.name)

    const pluginHTML = relCwd('.legacy-output', 'plugin.html')
    const pluginCSS = relCwd('.legacy-output', 'plugin.css')
    const pluginJS = relCwd('.legacy-output', 'plugin.js')

    for (const childBundle of bundle.childBundles) {
      if (childBundle.type === 'css' && fs.existsSync(pluginCSS)) {
        bundler.watch(pluginCSS, childBundle.entryAsset)
      }

      if (childBundle.type === 'js' && fs.existsSync(pluginJS)) {
        bundler.watch(pluginJS, childBundle.entryAsset)

        if (childBundle.entryAsset.basename === 'plugin.js') {
          const pluginJSON = registerExtractor(fs.readFileSync(pluginJS))

          fs.writeFile(path.resolve(bundleDir, 'plugin.json'), pluginJSON, err => err && console.error(err))
        }
      }
    }

    if (fs.existsSync(pluginHTML)) {
      bundler.watch(pluginHTML, bundler.mainBundle.entryAsset)
    }
  })
}
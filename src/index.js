const path = require('path')
const fs = require('fs')
const { relCwd, promisify } = require('./utils')
const registerExtractor = require('./register-extractor')
const { start } = require('./legacy-builder')
const { ncp } = require('ncp')
const recursiveCopy = promisify(ncp)
const copyAceFiles = require('./copyAceFiles')

module.exports = async bundler => {
  // Start legacy builder
  await start(bundler)

  // Add special asset types for interpolating the plugin assets into the wrapper files
  bundler.addAssetType('.js', require.resolve('./JSAsset.js'))
  bundler.addAssetType('.scss', require.resolve('./SASSAsset.js'))
  bundler.addAssetType('.html', require.resolve('./HTMLAsset.js'))

  // event listener for each bundle process completion
  bundler.on('bundled', async bundle => {
    const bundleDir = path.dirname(bundle.name || bundler.mainBundle.childBundles.values().next().value.name)

    const pluginHTML = relCwd('.legacy-output', 'plugin.html')
    const pluginCSS = relCwd('.legacy-output', 'plugin.css')
    const pluginSCSS = relCwd('.legacy-output', 'plugin.scss')
    const pluginJS = relCwd('.legacy-output', 'plugin.js')

    let hasTinyMCE = fs.existsSync(path.resolve(bundleDir, 'skins'))
    const needsTinyMCE = fs.existsSync(relCwd('node_modules', 'tinymce', 'skins'))

    let hasAceWorkers = fs.existsSync(path.resolve(bundleDir, 'worker-css.js'))
    const needsAceWorkers = fs.existsSync(relCwd('node_modules', 'ace-builds', 'src-min-noconflict'))

    for (const childBundle of bundle.childBundles) {
      if (childBundle.type === 'css') {
        if (fs.existsSync(pluginCSS)) {
          bundler.watch(pluginCSS, childBundle.entryAsset)
        }

        if (fs.existsSync(pluginSCSS)) {
          bundler.watch(pluginSCSS, childBundle.entryAsset)
        }
      }

      if (childBundle.type === 'js' && fs.existsSync(pluginJS)) {
        bundler.watch(pluginJS, childBundle.entryAsset)

        if (childBundle.entryAsset && childBundle.entryAsset.basename === 'plugin.js') {
          const pluginJSON = registerExtractor(fs.readFileSync(pluginJS))

          fs.writeFile(path.resolve(bundleDir, 'plugin.json'), pluginJSON, err => err && console.error(err))
        }

        if (!hasTinyMCE && needsTinyMCE) {
          await recursiveCopy(relCwd('node_modules', 'tinymce', 'skins'), path.resolve(bundleDir, 'skins'))
            .catch(err => console.error('unable to copy tinymce skins'))

          hasTinyMCE = fs.existsSync(path.resolve(bundleDir, 'skins'))
        }

        if (!hasAceWorkers && needsAceWorkers) {
          await copyAceFiles(bundleDir)
        }
      }
    }

    if (fs.existsSync(pluginHTML)) {
      bundler.watch(pluginHTML, bundler.mainBundle.entryAsset)
    }
  })
}
const { ZengineMigratorJSAsset, ZengineMigratorCSSAsset, ZengineMigratorHTMLAsset } = require('./assets')

module.exports = (bundler) => {
  // Add special asset types for interpolating the plugin assets into the wrapper files
  bundler.addAssetType('.js', require.resolve('./JSAsset.js'))
  bundler.addAssetType('.css', require.resolve('./CSSAsset.js'))
  bundler.addAssetType('.html', require.resolve('./HTMLAsset.js'))

}
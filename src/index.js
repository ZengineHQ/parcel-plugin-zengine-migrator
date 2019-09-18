const { ZengineMigratorJSAsset, ZengineMigratorCSSAsset, ZengineMigratorHTMLAsset } = require('./assets')

module.exports = (bundler) => {
  bundler.addAssetType('.js', ZengineMigratorJSAsset);
  bundler.addAssetType('.css', ZengineMigratorCSSAsset);
  bundler.addAssetType('.html', ZengineMigratorHTMLAsset);
}
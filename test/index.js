const assert = require('assert')
const { deepEqual } = assert
const { wgnTransformer, kebabToCamelCase, camelCaseToKebab, replaceRouteTransformer } = require('../src/utils')
const extractPluginJSON = require('../src/register-extractor')
const {
  fullPageWithTopNavTrue,
  fullPageWithTopNavTrueRouteReplaced,
  fullPageWithTopNavTrueResult,
  fullPageWithTopNavFalse,
  fullPageWithTopNavFalseResult,
  fullPageWithTopNavUndefined,
  fullPageWithTopNavUndefinedResult,
  fullPageSettingsAndInline,
  fullPageSettingsAndInlineResult,
  fullPageSettingsAndInlineWithSpecifiedSrc,
  fullPageSettingsAndInlineWithSpecifiedSrcResult,
  fullPageAndRecordOverlyWithHiddenIcon,
  fullPageAndRecordOverlyWithHiddenIconResult,
  singleInterfaceFullPage,
  singleInterfaceFullPageResult,
  singleInterfaceFullPageHideIcon,
  singleInterfaceFullPageHideIconResult,
  singleInterfaceInline,
  singleInterfaceInlineResult,
  singleInterfaceInlineNoIcon,
  singleInterfaceInlineNoIconResult,
  fullPageSettingsAndInlineWithDefaultDimensions,
  fullPageSettingsAndInlineWithDefaultDimensionsResult,
  fullPageSettingsAndInlineWithDefaultDimensionsChained
} = require('./plugin-register-examples')

assert(
  kebabToCamelCase('name-space') === 'nameSpace',
  'kebabToCamelCase unable to convert simple word'
)

assert(
  kebabToCamelCase('name-5pace') === 'name5pace',
  'kebabToCamelCase unable to convert weird word'
)

assert(
  kebabToCamelCase('multi-word-name-space') === 'multiWordNameSpace',
  'kebabToCamelCase unable to convert multi word namespace'
)

assert(
  camelCaseToKebab('nameSpace') === 'name-space',
  'camelCaseToKebab unable to convert simple word'
)

assert(
  camelCaseToKebab('name5pace') === 'name5pace',
  'camelCaseToKebab unable to convert weird word'
)

assert(
  camelCaseToKebab('multiWordNameSpace') === 'multi-word-name-space',
  'camelCaseToKebab unable to convert multi word namespace'
)

assert(
  wgnTransformer(`'wgn'`, 'name-space') === `'name-space'`,
  'wgnTransformer unable to convert simple kebab-case namespace replacement'
)

assert(
  wgnTransformer(`'wgn'`, 'nameSpace') === `'nameSpace'`,
  'wgnTransformer unable to convert simple camelCase namespace replacement'
)

assert(
  wgnTransformer(`znPluginData('wgn').get({ formId: 1 })`, 'name-space') === `znPluginData('name-space').get({ formId: 1 })`,
  'wgnTransformer unable to convert complex kebab-case namespace replacement'
)

assert(
  wgnTransformer(`znPluginData('wgn').get({ formId: 1 })`, 'nameSpace') === `znPluginData('nameSpace').get({ formId: 1 })`,
  'wgnTransformer unable to convert complex camelCase namespace replacement'
)

assert(
  wgnTransformer(`'wgnCntl'`, 'name-space') === `'nameSpaceCntl'`,
  'wgnTransformer unable to convert kebab-case namespace to camelCase'
)

assert(
  wgnTransformer(`'wgnCntl'`, 'nameSpace') === `'nameSpaceCntl'`,
  'wgnTransformer unable to convert camelCase namespace to camelCase'
)

assert(
  wgnTransformer(`$scope.templates = wgnFirebase.fetch();`, 'name-space') === `$scope.templates = nameSpaceFirebase.fetch();`,
  'wgnTransformer unable to convert kebab-case variable namespace to camelCase'
)

assert(
  wgnTransformer(`$scope.templates = wgnFirebase.fetch();`, 'nameSpace') === `$scope.templates = nameSpaceFirebase.fetch();`,
  'wgnTransformer unable to convert camelCase variable namespace to camelCase'
)

assert(
  wgnTransformer(`$scope.templates = wgnFirebase.fetch();\nznPluginData('wgn').get({ formId: 1 })`, 'name-space') === `$scope.templates = nameSpaceFirebase.fetch();\nznPluginData('name-space').get({ formId: 1 })`,
  'wgnTransformer unable to convert file example to camelcase'
)

assert(
  wgnTransformer(`$scope.templates = wgnFirebase.fetch();\nznPluginData('wgn').get({ formId: 1 })`, 'nameSpace') === `$scope.templates = nameSpaceFirebase.fetch();\nznPluginData('nameSpace').get({ formId: 1 })`,
  'wgnTransformer unable to convert file example to camelcase'
)

assert(
  wgnTransformer(`<script type="text/ng-template" id="wgn-main">\n<div wgn-dropdown></div>\n</script>`, 'name-space') === `<script type="text/ng-template" id="name-space-main">\n<div name-space-dropdown></div>\n</script>`,
  'wgnTransformer unable to convert html example'
)

assert(
  wgnTransformer(`<script type="text/ng-template" id="wgn-main">\n<div wgn-dropdown></div>\n</script>`, 'nameSpace') === `<script type="text/ng-template" id="name-space-main">\n<div name-space-dropdown></div>\n</script>`,
  'wgnTransformer unable to convert html example'
)

assert(
wgnTransformer(`
const settings = wgnFirebase.getSettings()

const template = '<div id="wgn-settings">' +
  '  <a href="">Click me</a>' +
  '</div>'

const pluginData = await znPluginData('wgn').post('my-route', { id: 4, data: settings })
`, 'name-space') === `
const settings = nameSpaceFirebase.getSettings()

const template = '<div id="name-space-settings">' +
  '  <a href="">Click me</a>' +
  '</div>'

const pluginData = await znPluginData('name-space').post('my-route', { id: 4, data: settings })
`,
'wgnTransformer unable to convert full example with kebab-case namespace'
)

assert(
wgnTransformer(`
const settings = wgnFirebase.getSettings()

const template = '<div id="wgn-settings">' +
  '  <a href="">Click me</a>' +
  '</div>'

const pluginData = await znPluginData('wgn').post('my-route', { id: 4, data: settings })
`, 'nameSpace') === `
const settings = nameSpaceFirebase.getSettings()

const template = '<div id="name-space-settings">' +
  '  <a href="">Click me</a>' +
  '</div>'

const pluginData = await znPluginData('nameSpace').post('my-route', { id: 4, data: settings })
`,
'wgnTransformer unable to convert full example with camelCase namespace'
)

deepEqual(
  JSON.parse(extractPluginJSON(fullPageWithTopNavTrue)),
  fullPageWithTopNavTrueResult,
  'Unable to extract accurate plugin JSON from fullPage with topNav: true'
)

deepEqual(
  JSON.parse(extractPluginJSON(fullPageWithTopNavFalse)),
  fullPageWithTopNavFalseResult,
  'Unable to extract accurate plugin JSON from fullPage with topNav: false'
)

deepEqual(
  JSON.parse(extractPluginJSON(fullPageWithTopNavUndefined)),
  fullPageWithTopNavUndefinedResult,
  'Unable to extract accurate plugin JSON from fullPage with topNav undefined'
)

deepEqual(
  JSON.parse(extractPluginJSON(fullPageSettingsAndInline)),
  fullPageSettingsAndInlineResult,
  'Unable to extract accurate plugin JSON from fullPage, settings, and inline with topNav: true'
)

deepEqual(
  JSON.parse(extractPluginJSON(fullPageSettingsAndInlineWithSpecifiedSrc)),
  fullPageSettingsAndInlineWithSpecifiedSrcResult,
  'Unable to extract accurate plugin JSON from fullPage, settings, and inline with specified src property'
)

deepEqual(
  JSON.parse(extractPluginJSON(fullPageAndRecordOverlyWithHiddenIcon)),
  fullPageAndRecordOverlyWithHiddenIconResult,
  'Unable to extract accurate plugin JSON from fullPage and recordOverlay with hideIcon: true'
)

deepEqual(
  JSON.parse(extractPluginJSON(singleInterfaceFullPage)),
  singleInterfaceFullPageResult,
  'Unable to extract accurate plugin JSON from single fullPage interface'
)

deepEqual(
  JSON.parse(extractPluginJSON(singleInterfaceFullPageHideIcon)),
  singleInterfaceFullPageHideIconResult,
  'Unable to extract accurate plugin JSON from single fullPage interface with hidden icon'
)

deepEqual(
  JSON.parse(extractPluginJSON(singleInterfaceInline)),
  singleInterfaceInlineResult,
  'Unable to extract accurate plugin JSON from single inline interface with no icon and topNav: false'
)

deepEqual(
  JSON.parse(extractPluginJSON(singleInterfaceInlineNoIcon)),
  singleInterfaceInlineNoIconResult,
  'Unable to extract accurate plugin JSON from single inline interface with no icon and topNav: false'
)

deepEqual(
  JSON.parse(extractPluginJSON(fullPageSettingsAndInlineWithDefaultDimensions)),
  fullPageSettingsAndInlineWithDefaultDimensionsResult,
  'Unable to extract accurate plugin JSON from fullPage and inline interfaces with default dimensions'
)

deepEqual(
  JSON.parse(extractPluginJSON(fullPageSettingsAndInlineWithDefaultDimensionsChained)),
  fullPageSettingsAndInlineWithDefaultDimensionsResult,
  'Unable to extract accurate plugin JSON chained register call (plugin.controller().service().register())'
)

assert(
  replaceRouteTransformer(fullPageWithTopNavTrue, 'route') === fullPageWithTopNavTrueRouteReplaced('route'),
  'Unable to accurately replace occurences of {replace-route}'
)

console.log('All tests pass!')

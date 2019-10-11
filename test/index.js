const assert = require('assert')
const { wgnTransformer, kebabToCamelCase } = require('../src/utils')

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
  wgnTransformer(`'wgn'`, 'name-space') === `'name-space'`,
  'wgnTransformer unable to convert simple namespace replacement'
)

assert(
  wgnTransformer(`znPluginData('wgn').get({ formId: 1 })`, 'name-space') === `znPluginData('name-space').get({ formId: 1 })`,
  'wgnTransformer unable to convert complex namespace replacement'
)

assert(
  wgnTransformer(`'wgnCntl'`, 'name-space') === `'nameSpaceCntl'`,
  'wgnTransformer unable to convert namespace to camelcase'
)

assert(
  wgnTransformer(`$scope.templates = wgnFirebase.fetch();`, 'name-space') === `$scope.templates = nameSpaceFirebase.fetch();`,
  'wgnTransformer unable to convert variable namespace to camelcase'
)

assert(
  wgnTransformer(`$scope.templates = wgnFirebase.fetch();\nznPluginData('wgn').get({ formId: 1 })`, 'name-space') === `$scope.templates = nameSpaceFirebase.fetch();\nznPluginData('name-space').get({ formId: 1 })`,
  'wgnTransformer unable to convert file example to camelcase'
)

assert(
  wgnTransformer(`<script type="text/ng-template" id="wgn-main">\n<div wgn-dropdown></div>\n</script>`, 'name-space') === `<script type="text/ng-template" id="name-space-main">\n<div name-space-dropdown></div>\n</script>`,
  'wgnTransformer unable to convert html example'
)

console.log('All tests pass!')

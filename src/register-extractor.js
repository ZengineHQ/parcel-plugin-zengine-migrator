const acorn = require('acorn')
const fs = require('fs')
const path = require('path')

module.exports = contents => {
  const tree = acorn.parse(contents)

  const pluginJSONObject = findObjectProperties(tree.body)

  if (!pluginJSONObject) {
    throw new Error('Unable to extract plugin.json information from plugin.register function. Please verify you have a valid plugin.register function in your source code.')
  }

  return JSON.stringify(pluginJSONObject, null, 2)
}

function findObjectProperties (body) {
  return body.map(getRegisterArguments).filter(Boolean)[0]
}

function getRegisterArguments (expressionStatement) {
  if (!isPluginRegistrationCall(expressionStatement)) {
    return false
  }

  return expressionStatement.expression.arguments
    .reduce((settings, arg) => {
      if (arg.type === 'ObjectExpression') {
        let hasInterfaces = false

        arg.properties.forEach(property => {
          if ((property.key.name === 'icon' || property.key.value === 'icon')) {
            settings.icon = property.value.value
          }

          if ((property.key.name === 'interfaces' || property.key.value === 'interfaces')) {
            hasInterfaces = true

            property.value.elements.forEach(element => {
              if (element.type === 'ObjectExpression') {
                const view = { src: '/index.html' }

                element.properties.forEach(prop => {
                  if (
                    (prop.key.name === 'type' || prop.key.value === 'type') ||
                    (prop.key.name === 'location' || prop.key.value === 'location') ||
                    (prop.key.name === 'src' || prop.key.value === 'src') ||
                    (prop.key.name === 'hideIcon' || prop.key.value === 'hideIcon')
                  ) {
                    view[prop.key.name] = prop.value.value

                    if ((prop.key.name === 'type' || prop.key.value === 'type') && prop.value.value === 'fullPage') {
                      if (!view.hasOwnProperty('hideIcon')) {
                        view.hideIcon = true
                      }
                    }
                  }

                  if ((prop.key.name === 'topNav' || prop.key.value === 'topNav') && prop.value.value === true) {
                    view.hideIcon = false
                  }

                  if ((prop.key.name === 'defaultDimensions' || prop.key.value === 'defaultDimensions') && prop.value.type === 'ObjectExpression') {
                    view.defaultDimensions = prop.value.properties.reduce((map, p) => ({
                      ...map,
                      [p.key.name || p.key.value]: p.value.value
                    }), {})
                  }
                })

                settings.views.push(view)
              }
            })
          }
        })

        if (!hasInterfaces) {
          const view = { src: '/index.html' }

          arg.properties.forEach(prop => {
            if (prop.key.name === 'type' || prop.key.name === 'location' || prop.key.name === 'src') {
              view[prop.key.name] = prop.value.value
            }

            if (prop.key.name === 'fullPage' && prop.value.value === true) {
              view.type = 'fullPage'

              if (!view.hasOwnProperty('hideIcon')) {
                view.hideIcon = true
              }
            }

            if (prop.key.name === 'topNav') {
              view.hideIcon = !prop.value.value
            }

            if (prop.key.name === 'defaultDimensions' && prop.value.type === 'ObjectExpression') {
              view.defaultDimensions = prop.value.properties.reduce((map, p) => ({
                ...map,
                [p.key.name]: p.value.value
              }), {})
            }
          })

          settings.views.push(view)
        }
      }

      return settings
    }, { views: [] })
}

function isPluginRegistrationCall (node) {
  if (
    node.type !== 'ExpressionStatement' ||
    node.expression.type !== 'CallExpression' ||
    node.expression.callee.type !== 'MemberExpression' ||
    node.expression.callee.property.name !== 'register' ||
    !recursiveSearchForPlugin(node.expression.callee) ||
    node.expression.arguments.some(arg => arg.type !== 'Literal' && arg.type !== 'ObjectExpression')
  ) {
    return false
  }

  return true
}

function recursiveSearchForPlugin (node) {
  if (node.object.name === 'plugin') {
    return true
  }

  if (
    node.object &&
    node.object.type === 'CallExpression' &&
    node.object.callee &&
    node.object.callee.type === 'MemberExpression'
  ) {
    return recursiveSearchForPlugin(node.object.callee)
  }

  return false
}

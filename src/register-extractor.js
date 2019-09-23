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
          if (property.key.name === 'icon') {
            settings.icon = property.value.value
          }

          if (property.key.name === 'interfaces') {
            hasInterfaces = true

            property.value.elements.forEach(element => {
              if (element.type === 'ObjectExpression') {
                const view = { src: '/index.html' }

                element.properties.forEach(prop => {
                  if (prop.key.name === 'type' || prop.key.name === 'location') {
                    view[prop.key.name] = prop.value.value
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
            })
          }
        })

        if (!hasInterfaces) {
          const view = { src: '/index.html' }

          arg.properties.forEach(prop => {
            if (prop.key.name === 'type' || prop.key.name === 'location') {
              view[prop.key.name] = prop.value.value
            }

            if (prop.key.name === 'fullPage' && prop.value.value === true) {
              view.type = 'fullPage'
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
    node.expression.callee.object.name !== 'plugin' ||
    node.expression.callee.property.name !== 'register' ||
    node.expression.arguments.some(arg => arg.type !== 'Literal' && arg.type !== 'ObjectExpression')
  ) {
    return false
  }

  return true
}
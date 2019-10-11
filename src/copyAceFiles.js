const fs = require('fs')
const path = require('path')
const { relCwd, promisify } = require('./utils')
const writeFile = promisify(fs.writeFile)
const readFile = promisify(fs.readFile)
const readdir = promisify(fs.readdir)

module.exports = async bundleDir => {
  /**
   * @type {fs.Dirent[]} entities
   */
  const entities = await readdir(relCwd('node_modules', 'ace-builds', 'src-min-noconflict'), { withFileTypes: true })
    .catch(err => err instanceof Error ? err : new Error(JSON.stringify(err)))
    
  if (entities instanceof Error) {
    return console.error('unable to copy ace workers')
  }

  for (const entity of entities) {
    if (entity.isFile() && entity.name.startsWith('worker-') && entity.name.endsWith('.js')) {
      const contents = await readFile(relCwd('node_modules', 'ace-builds', 'src-min-noconflict', entity.name))
        .catch(err => console.error(`unable to read ${entity.name}:`, err))

      contents && await writeFile(path.resolve(bundleDir, entity.name), contents)
        .catch(err => console.error(`unable to copy ${entity.name}:`, err))
    }
  }
}
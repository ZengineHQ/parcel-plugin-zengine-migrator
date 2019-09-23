const fs = require('fs')
const path = require('path')
const Mkdirp = require('mkdirp')
const { watch } = require('chokidar')
const { promisify, relCwd } = require('./utils')

const readdir = promisify(fs.readdir)
const readFile = promisify(fs.readFile)
const writeFile = promisify(fs.writeFile)
const mkdirp = promisify(Mkdirp)

const cache = {
  files: {
    css: {},
    js: {},
    html: {},
    scss: {}
  },
  content: {
    css: [],
    js: [],
    html: [],
    scss: []
  }
}

exports.start = async bundler => {
  // Set up main directory
  await setupDirectory(relCwd('./src'))

  // Set up any common dependencies
  const common = await readFile(relCwd('dependencies'), { encoding: 'utf8' })
    .catch(err => console.warn('Error reading dependencies file. Moving on.', err))

  if (common && typeof common === 'string') {
    for (const dep of common.split('\n')) {
      const commonDepPath = relCwd('..', 'common', dep, 'src')

      if (fs.existsSync(commonDepPath)) {
        await setupDirectory(commonDepPath)
      }
    }
  }

  // Set up any npm dependencies
  const { legacyDependencies } = require(relCwd('package.json'))

  if (legacyDependencies) {
    for (const dep of Object.keys(legacyDependencies)) {
      const depPath = relCwd('node_modules', dep, 'src')

      if (fs.existsSync(depPath)) {
        await setupDirectory(depPath)
      }
    }
  }

  // Cache the plugin.register.js last, so it is injected into the bundle last.
  const registerPath = relCwd('plugin-register.js')

  if (fs.existsSync(registerPath)) {
    await cacheContents(registerPath, 'js')
  }

  await mkdirp(relCwd('.legacy-output'))

  await writeFile(relCwd('.legacy-output', 'plugin.js'), cache.content.js.join('\n\n'))
  await writeFile(relCwd('.legacy-output', 'plugin.css'), cache.content.css.join('\n\n'))
  await writeFile(relCwd('.legacy-output', 'plugin.html'), cache.content.html.join('\n\n'))

  initializeWatcher(bundler)
}

async function initializeWatcher (bundler) {
  const allFiles = Object.keys(cache.files).reduce((list, key) => [...list, ...Object.keys(cache.files[key])], [])

  const fileWatcher = watch(allFiles, { followSymlinks: true })

  fileWatcher.on('change', async changedPath => {
    const filePath = path.resolve(changedPath)
    const type = getFileTypeKey(changedPath)

    const changedContents = await readFile(filePath, { encoding: 'utf8' })

    cache.content[type][cache.files[type][filePath]] = changedContents

    const newOutput = cache.content[type].filter(Boolean).join('\n\n')

    writeFile(relCwd('.legacy-output', `plugin.${type}`), newOutput)
  })

  fileWatcher.on('unlink', changedPath => {
    const filePath = path.resolve(changedPath)
    const type = getFileTypeKey(changedPath)

    cache.content[type][cache.files[type][filePath]] = ''

    const newOutput = cache.content[type].filter(Boolean).join('\n\n')

    writeFile(relCwd('.legacy-output', `plugin.${type}`), newOutput)
  })
}

async function setupDirectory (dirPath) {
  const entities = await readdir(dirPath, { withFileTypes: true })
    .catch(err => {
      console.error(`Error reading from the ${dirPath} directory:`)
      throw err
    })

  const dirs = []

  for (const entity of entities) {
    if (entity.isDirectory()) {
      dirs.push(path.resolve(dirPath, entity.name))
    }

    if (entity.isFile()) {
      const type = getFileTypeKey(entity.name)

      if (type) {
        await cacheContents(path.resolve(dirPath, entity.name), type)
      }
    }

    if (entity.isSymbolicLink()) {
      const type = getFileTypeKey(entity.name)

      if (type) {
        await cacheLinkedContents(path.resolve(dirPath, entity.name), type)
      }
    }
  }

  dirs.forEach(dir => setupDirectory(dir))
}

function cacheLinkedContents (fullPath, type) {
  const realPath = fs.readlinkSync(fullPath)

  return cacheContents(realPath, type)
}

async function cacheContents (fullPath, type) {
  if (!fullPath || !type) {
    return
  }

  const contents = await readFile(fullPath, { encoding: 'utf8' })
    .catch(err => {
      console.error(`Error reading ${fullPath}:`)
      throw err
    })

  const index = cache.content[type].push(contents) - 1

  cache.files[type][fullPath] = index
}

function getFileTypeKey (name) {
  switch (path.extname(name)) {
    case '.js':
      return 'js'
    case '.css':
      return 'css'
    case '.html':
      return 'html'
    case '.scss':
    case '.sass':
      return 'scss'
    default:
      return false
  }
}

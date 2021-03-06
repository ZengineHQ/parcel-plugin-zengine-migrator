const fs = require('fs')
const path = require('path')
const Mkdirp = require('mkdirp')
const { watch } = require('chokidar')
const {
  promisify,
  relCwd,
  wgnTransformer,
  getNamespace,
  replaceRouteTransformer,
  getRoute,
  updateMayaJSON
} = require('./utils')

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
  // Set up any common dependencies
  const common = await readFile(relCwd('dependencies'), { encoding: 'utf8' })
    .catch(err => console.warn('Unable to read `dependencies` file. Moving on.'))

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

  if (fs.existsSync(relCwd('src'))) {
    // Set up main directory
    await setupDirectory(relCwd('src'))

    // Cache the plugin.register.js last, so it is injected into the bundle last.
    const registerPath = relCwd('plugin-register.js')

    if (fs.existsSync(registerPath)) {
      await cacheContents(registerPath, 'js')
    }

    await mkdirp(relCwd('.legacy-output'))

    await writeAllLegacyFiles()

    if (process.env.NODE_ENV !== 'production') initializeWatcher(bundler)
  }
}

async function writeAllLegacyFiles () {
  return Promise.all([
    writeFile(
      relCwd('.legacy-output', 'plugin.js'),
      wgnTransformer(
        replaceRouteTransformer(cache.content.js.join('\n\n'), getRoute()),
        getNamespace()
      )
    ),
    writeFile(
      relCwd('.legacy-output', 'plugin.css'),
      wgnTransformer(cache.content.css.join('\n\n'), getNamespace())
    ),
    writeFile(
      relCwd('.legacy-output', 'plugin.scss'),
      wgnTransformer(cache.content.scss.join('\n\n'), getNamespace())
    ),
    writeFile(
      relCwd('.legacy-output', 'plugin.html'),
      wgnTransformer(cache.content.html.join('\n\n'), getNamespace())
    )
  ])
}

async function initializeWatcher (bundler) {
  const allFiles = Object.keys(cache.files).reduce((list, key) => [...list, ...Object.keys(cache.files[key])], [])

  const fileWatcher = watch(allFiles, { followSymlinks: true })

  fileWatcher.on('change', async changedPath => {
    const filePath = path.resolve(changedPath)
    const type = getFileTypeKey(changedPath)

    const changedContents = await readFile(filePath, { encoding: 'utf8' })

    cache.content[type][cache.files[type][filePath]] = changedContents

    let newOutput = cache.content[type].filter(Boolean).join('\n\n')

    if (type === 'js') {
      newOutput = replaceRouteTransformer(newOutput, getRoute())
    }

    writeFile(relCwd('.legacy-output', `plugin.${type}`), wgnTransformer(newOutput, getNamespace()))
  })

  fileWatcher.on('unlink', changedPath => {
    const filePath = path.resolve(changedPath)
    const type = getFileTypeKey(changedPath)

    cache.content[type][cache.files[type][filePath]] = ''

    let newOutput = cache.content[type].filter(Boolean).join('\n\n')

    if (type === 'js') {
      newOutput = replaceRouteTransformer(newOutput, getRoute())
    }

    writeFile(relCwd('.legacy-output', `plugin.${type}`), wgnTransformer(newOutput, getNamespace()))
  })

  const mayaWatcher = watch(relCwd('..', '..', 'maya.json'))

  mayaWatcher.on('change', async path => {
    await updateMayaJSON()
    await writeAllLegacyFiles()
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

  await Promise.all(dirs.map(dir => setupDirectory(dir)))
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

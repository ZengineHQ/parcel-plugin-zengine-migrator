# Parcel Plugin Zengine Migrator

Parcel (v1) Plugin for all the heavy lifting behind the scenes of the Zengine Plugin Migrator

## Current Capabilities

- dynamically generates plugin.json from `plugin.register` function arguments
- legacy source code is compiled (sort of a mayan port) for integration into parcel-bundler
- legacy source code is watched for changes or deletions and causes app refresh
    - This includes common dependencies, npm packages, and symlinks!
    - Caveat: file creation in `./src` or `../common` is not captured, and will require `npm start` again
- interpolates all plugin code into modern wrapper files based on character patterns
    - HTML: `%PLUGIN_HTML%`
    - JS: `/* PLUGIN_JS */`
    - CSS: `/* PLUGIN_CSS */`
- plugin app is served over `https`
- plugin.json is accessible from the dev server

## To Do

- build command should zip up contents (might not belong here?)
- reload on file creation (nice to have?)

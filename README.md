## Egg-nuxt-merge
Plugin for merging nuxt into Egg.js

### Features
Make nuxt and Egg.js listen in one server but they are in separated preojects. Nuxt renders pages in the middleware of Egg.js, so cookies can be correctly set by Egg.js(especially CSRF plugin is enable)
* `app.nuxt` | `ctx.nuxt` returns nuxt object  
  use `await ctx.nuxt.render(ctx.req, ctx.res)` to render page explicitly; by default it always render page unless `config.nuxtMerge.ignore` or `config.nuxtMerge.match` were set

### Install
Use `npm link` or `yarn link` to link nuxt app into egg app(optional)
```bash
$ cd /path/to/nuxtApp
$ yarn link
$ cd /path/to/EggApp
$ yarn link {Your Nuxt App Name}
```
Notice template of nuxt app requires to be chosen as `pure`  
Nuxt app should return a function which generates nuxt object from entry file in `package.json`
```javascript
// index.js in nuxt app root path
// depends on configs in package.json

const cwd = process.cwd()
const { Nuxt, Builder } = require('nuxt')

// Import and Set Nuxt.js options
const config = require('./nuxt.config.js')

module.exports = async function(cfg) {
  process.chdir(__dirname)
  // Instantiate nuxt.js
  config.dev = cfg.dev
  config._start = !cfg.dev
  const nuxt = new Nuxt(config)

  const {
    host = process.env.HOST || '127.0.0.1',
    port = process.env.PORT || 3000
  } = nuxt.options.server

  // Build in development
  if (cfg.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  } else {
    await nuxt.ready()
  }

  process.chdir(cwd)
  return nuxt
}
```
Because we changed `process.cwd`, no need to install any nuxt dependencies in Egg app. `process.cwd` will be reset after compiling nuxt app

Settings in Egg app
```javascript
// in config/plugin.js
exports.nuxtMerge = {
  enable: true,
  path: path.join(__dirname, '../app/plugin/egg-nuxt-merge')
  // or via package
}
```
Then add your nuxt app package name or path to config
```javascript
// in config/config.***.js
config.nuxtMerge = {
  appPkg: '{Your nuxt app package name}',
  ignore: '/api/v1'
}
```
If your apis have a route prefix, you can add an ignore prefix to the config of this plugin

### Configure
* nuxt app path `exports.appPath`  
  Path to nuxt app root, absoluted or relative(to egg app base dir) are both OK
* nuxt app package `exports.appPkg`  
  Your nuxt app package name; if you link nuxt app via `yarn link`, the package name is the nuxt app base dir name
* ignore `exports.ignore`  
  Ignore some queries. See [here](https://eggjs.org/en/basics/middleware.html#general-configuration) for general config of middleware
* match `exports.match`  
  Only enable as query path is matched. Click the link above for more details

### Notice
In `prod` environment, you need to build nuxt app at least once manually via `npm build` in nuxt app before running `npm start` in egg app
const _ = require('lodash')

module.exports = app => {
  const config = app.config.nuxtMerge

  app.config.coreMiddleware.unshift('nuxt')

  app.beforeStart(async () => {
    const nuxtApp = _.isEmpty(config.appPkg) ? config.appPath : config.appPkg
    if (_.isEmpty(nuxtApp)) {
      throw new Error('No appPkg nor appPath were set')
    }
    const nuxt = require(nuxtApp)
    app.nuxt = await nuxt({
      dev: app.config.env !== 'prod'
    })
  })
}

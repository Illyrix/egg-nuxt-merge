module.exports = () => async (ctx, next) => {
  await next()
  ctx.status = 200
  ctx.respond = false
  ctx.req.ctx = ctx

  // reset content-type to return static files
  ctx.response.type = undefined
  await ctx.nuxt.render(ctx.req, ctx.res)
}

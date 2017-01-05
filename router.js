const wayfarer = require('wayfarer')
const match = require('pathname-match')
const history = require('./history')

let router

function render (route) {
  router(match(route), route)
}

function loadRoutes (route) {
  const [, appPath] = match(route).split(',')
  const bundle = `/${appPath}/bundle.js`
  const script = document.createElement('script')
  script.src = bundle
  script.id = `${appPath}-bundle`
  script.onload = () => {
    render(route)
  }
  document.body.appendChild(script)
}

function init (defaultRoute) {
  router = wayfarer(defaultRoute)
  router.on(defaultRoute, loadRoutes)
  history.listen(render)
  return router
}

function start () {
  if (!router) {
    throw new Error('Router must be initialized first!')
  }
  render(history.getCurrentLocation())
}

module.exports = {init, start}

/* global self */
var wayfarer = require('wayfarer')
var match = require('pathname-match')
var loadScript = require('load-script')
var createBrowserHistory = require('history').createBrowserHistory

var router
var root
var cache = {}
if (typeof window === 'undefined') {
  root = self
} else {
  root = window
}
router = root.__router

function render (routeObj) {
  router(match(routeObj.pathname), routeObj)
}

function loadRoute (defaultParams, routeObj) {
  var appPath = match(routeObj.pathname)
  var bundle = appPath + '/bundle.js'
  if (!cache[bundle]) {
    loadScript(bundle, function (err) {
      if (!err) render(routeObj)
    })
  }
}

function lazyRouter (defaultRoute) {
  if (!router) {
    if (typeof defaultRoute !== 'string') {
      throw new Error('You must supply a default route')
    }
    var history = createBrowserHistory()
    history.listen(render)

    router = wayfarer(defaultRoute)
    router.on(defaultRoute, loadRoute)
    router.push = function (route, opts) {
      history.push(route, opts)
    }
    router.replace = function (route, opts) {
      history.replace(route, opts)
    }

    root.__router = router
  }
  return router
}

module.exports = lazyRouter

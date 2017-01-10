var wayfarer = require('wayfarer')
var match = require('pathname-match')
var loadScript = require('load-script')
var root = require('global')

var router
var cache = {}

function render (routeObj, opts) {
  router(match(routeObj.pathname), routeObj, opts)
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

    root.onpopstate = function (evt) {
      render(document.location, evt.state || {})
    }

    router = wayfarer(defaultRoute)
    router.on(defaultRoute, loadRoute)

    router.push = function (route, opts) {
      opts = opts || {}
      var routeObj = document.createElement('a')
      routeObj.href = route
      root.history.pushState(opts, '', route)
      render(routeObj, opts)
    }

    router.replace = function (route, opts) {
      opts = opts || {}
      var routeObj = document.createElement('a')
      routeObj.href = route
      root.history.replaceState(opts, '', route)
      render(routeObj, opts)
    }

    root.__router = router
  }
  return router
}

module.exports = lazyRouter

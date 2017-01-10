var wayfarer = require('wayfarer')
var match = require('pathname-match')
var loadScript = require('load-script')
var root = require('global')

var router
var cache = {}

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

    root.onpopstate = function (evt) {
      render(document.location)
    }

    router = wayfarer(defaultRoute)
    router.on(defaultRoute, loadRoute)

    router.push = function (route, opts) {
      opts = opts || {}
      var routeObj = document.createElement('a')
      routeObj.href = route
      root.history.pushState(opts, '', route)
      render(routeObj)
    }

    router.replace = function (route, opts) {
      opts = opts || {}
      var routeObj = document.createElement('a')
      routeObj.href = route
      root.history.replaceState(opts, '', route)
      render(routeObj)
    }

    root.__router = router
  }
  return router
}

module.exports = lazyRouter

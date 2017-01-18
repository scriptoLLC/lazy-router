var wayfarer = require('wayfarer')
var match = require('pathname-match')
var loadScript = require('load-script')
var root = require('global')

var router
var cache = {}
var dft = function () {}

var bundleResolve = function (routeObj) {
  var appPath = match(routeObj.pathname)
  var bundle = appPath + '/bundle.js'
  return bundle
}

function render (routeObj, opts) {
  router(match(routeObj.pathname), routeObj, opts)
}

function loadRoute (defaultParams, routeObj) {
  var bundle = bundleResolve(routeObj)
  if (!cache[bundle]) {
    cache[bundle] = true
    loadScript(bundle, function (err) {
      if (err) {
        return dft()
      }
      render(routeObj)
    })
  } else {
    dft()
  }
}

function lazyRouter (defaultRoute, opts) {
  if (!router) {
    opts = opts || {}
    if (typeof defaultRoute !== 'string') {
      throw new Error('You must supply a default route')
    }

    if (typeof opts.defaultAction === 'function') {
      dft = opts.defaultAction
    }

    if (typeof opts.resolver === 'function') {
      bundleResolve = opts.resolver
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

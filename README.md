# lazy-router
[![Build Status](https://travis-ci.org/scriptoLLC/lazy-router.svg?branch=master)](https://travis-ci.org/scriptoLLC/lazy-router)

A client-side router based on [wayfarer](https://github.com/yoshuawyuts/wayfarer) that allows for lazy-loading of client bundles for routes that might not yet be available.

_n.b._ despite the use of ES6 syntax in the examples and tests, the router itself is implemented in ES3 (as a CommonJS module).

## Usage
main.js:
```js
const lr = require('lazy-router')
const defaultAction = (path, routeObj, state) => render404()
const resolver = (routeObj) => routeObj.pathname + '/bundle.js'
lr('/404', {defaultAction, resolver})
lr.on('/my-route', (pathname, routeObj) => console.log(pathname, routeObj))
lr.push('/not-loaded-yet')
```

not-loaded-yet.js:
```js
const lr = require('lazy-router')
lr('/404') // arguments in subsequent calls are ignored after the first call
lr.on('/not-loaded-yet', (pathname, routeObj) => console.log('i got lazy loaded'))
```

So long as `not-loaded-yet.js` is served from `/not-loaded-yet/not-loaded-yet.bundle.js`, when
`main.js` receieves a request for `/not-loaded-yet`, it'll load the bundle and then
trigger the route when the bundle is loaded.


## API
#### `const lr = lazyRouter(defaultRoute?: string, opts?: {defaultAction?: (pathname: string, Location: object, state: object) -> void, resolver: (Location: object) -> string}) -> router`
Create or get the current router instance.

The first time this method is called you must supply the `defaultRoute` argument.

You can supply a default renderer (if you know that the function will always be
available) via the options hash property `defaultAction`. The arguments are the same
as for a normal route.

You can also override the default bundle resolver by supplying your own.  By default
`lazy-router` will attempt to find the bundle at: `route.pathname + '/bundle.js'`.
Your function should be supplied via the `resolver` property and receives the `Location` object
as it's argument. It should return a string.

All arguments are ignored on subsequent calls, which will return the instantiated
router.

#### `lr.on(pathname: string, (pathname: string, Location: object, state: object) -> void) -> void`
Attach a route to the router, and provide a function for calling that route. The
router uses [pathname-match](https://github.com/yoshuawyuts/pathname-match) to handle
matching, so any query string, hash, etc on the route will be ignored.

The callback receives three parameters:
* the pathname that was used for the match,
* a [Location](https://developer.mozilla.org/en-US/docs/Web/API/Location) object and
* the `state` provided (if any) to the `push` or `replace` method

#### `lr.push(path: string, state: object)`
Push a new URL into the browser history and invoke the handler for this route.
If the route is not available in the current router, this will attempt to
load a new bundle that contains a handler for the route.  If this fails, the
client will attempt to load the route defined in `defaultRoute` from the server.

#### `lr.replace(path: string, state: object)`
Replace the current URL with the new URL provided and invoke the handler for that
route. The same loading rules apply as for `push`

## Singleton
This module attempts to make itself a singleton by attaching its instance to the
`window` object, and then returning that if it exists.  This means no matter
what you're using for bundling, splitting, etc, you should always get a single
instance of this router (so long as the code is all running in the same window)

## TODO
* Figure out coverage for the iframe

## License
Copyright © 2017 Scripto, LLC.  Apache-2.0 licensed.

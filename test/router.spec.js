const test = require('tape')
const lazyRouter = require('../')

test('router', (t) => {
  t.ok(typeof window.__router === 'undefined', 'no router')
  t.throws(() => {
    lazyRouter()
  }, 'no default route -> throws')
  const router = lazyRouter('/404')
  t.ok(typeof window.__router !== 'undefined', 'router available')
  t.ok(router === window.__router, 'router is attached to the window')
  const router2 = lazyRouter()
  t.ok(router === router2, 'is singleton')
  t.end()
})

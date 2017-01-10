const lr = require('router')
const router = lr()
router.on('/lazy-load', () => {
  document.body.appendChild(document.createTextNode('I have loaded'))
  window.parent.postMessage('loaded', '*')
})

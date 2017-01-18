const lr = require('router')
const defaultAction = () => window.parent.postMessage('loaded2', '*')
const router = lr('/404', {defaultAction})
router.push('/lazy-load')

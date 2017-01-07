const getRouter = require('./router')
const router = getRouter('/404')
router.push('/lazy-load-app')

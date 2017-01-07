const getRouter = require('./router')
const router = getRouter()

router.on('/lazy-load-app', (matched, route) => {
  console.log('matched', matched, 'route', route)
  console.log('i have loaded')
})

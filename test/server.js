const http = require('http')
const fs = require('fs')

const server = http.createServer((req, res) => {
  console.log(`Serving ${req.url}`)
  if (req.url === '/' || req.url === '/index.html' || req.url === '/lazy-load-app') {
    return fs.createReadStream('index.html').pipe(res)
  } else if (req.url === '/router.bundle.js') {
    return fs.createReadStream('router.bundle.js').pipe(res)
  } else if (req.url === '/main-app.bundle.js') {
    return fs.createReadStream('main-app.bundle.js').pipe(res)
  } else if (req.url === '/lazy-load-app/bundle.js') {
    return fs.createReadStream('lazy-load-app/bundle.js').pipe(res)
  } else {
    res.end(`nothing for ${req.url}`)
  }
})

server.listen(8000, () => console.log('listening on http://localhost:8000'))

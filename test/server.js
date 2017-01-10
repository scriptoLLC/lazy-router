const http = require('http')
const fs = require('fs')
const path = require('path')

const browserify = require('browserify')

const server = http.createServer((req, res) => {
  console.log(`Serving ${req.url}`)
  if (req.url === '/' || req.url === '/index.html' || req.url === '/lazy-load') {
    return fs.createReadStream(path.join(process.cwd(), 'test', 'index.html')).pipe(res)
  } else if (req.url === '/router.bundle.js') {
    const b = browserify()
    b.require(path.join(process.cwd(), 'router'), {expose: 'router'})
      .bundle()
      .pipe(res)
  } else if (req.url === '/main-app.bundle.js') {
    const b = browserify()
    b.add(path.join(process.cwd(), 'test', 'main-app'))
      .external('router')
      .bundle()
      .pipe(res)
  } else if (req.url === '/lazy-load/bundle.js') {
    const b = browserify()
    b.add(path.join(process.cwd(), 'test', 'lazy-app'))
      .external('router')
      .bundle()
      .pipe(res)
  } else {
    res.end(`error: no handle for ${req.url}`)
  }
})

server.listen(8000, () => {
  process.send && process.send('start')
  console.log('listening on http://localhost:8000')
})

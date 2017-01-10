#!/usr/bin/env node
const fork = require('child_process').fork
const path = require('path')

const browserify = require('browserify')
const run = require('tape-run')
const cover = require('tape-istanbul')

const server = fork(path.join(process.cwd(), 'test', 'server'))

server.on('message', runTests)

function killServer () {
  server.kill()
  server.disconnect()
}

function runTests () {
  const b = browserify(path.join(process.cwd(), 'test', 'router.spec.js'))
  let out = process.stdout
  if (process.argv[2] === 'cover') {
    b.plugin('tape-istanbul/plugin')
    out = cover()
  }
  b.bundle()
    .pipe(run())
    .on('error', (err) => {
      console.log(err)
      killServer()
      process.exit(1)
    })
    .on('end', killServer)
    .pipe(out)
}

browserify = require 'browserify'
child = require 'child_process'
fs = require 'fs'

task 'build', 'Build client-side CM1.js using browserify', ->
  console.log "Browserifying..."
  b = browserify {
    require: { http: 'dkastner-http-browserify' },
    entry: './browser.js'
  }
  fs.writeFileSync 'CM1.js', b.bundle()
  console.log 'CM1 is now browserified in CM1.js'

task 'test', 'Run all tests', ->
  console.log "Testing"
  child.exec './node_modules/.bin/vows test/*-test.js'

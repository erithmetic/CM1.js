browserify = require 'browserify'
child = require 'child_process'
fs = require 'fs'
async = require 'async'

run = (cmd) ->
  return (callback) ->
    console.log cmd
    child.exec cmd, (err, stdout, stderr) ->
      if err
        callback(err)
      else
        console.log(stdout)
        console.log(stderr)
        callback(null)


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

task 'pages', 'Update gh-pages', ->
  async.series([
    run('./node_modules/.bin/docco lib/CM1.js'),
    run('git checkout gh-pages'),
    run('cp docs/cm1.html index.html')
    run('git add index.html'),
    run('git commit -m "update gh-pages"'),
    run('git push origin gh-pages'),
    run('git checkout master')
  ],
  (err) ->
    console.log('Error:',err) if err
  )

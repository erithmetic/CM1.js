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

task 'pages', 'Update gh-pages', ->
  child.exec './node_modules/.bin/docco lib/cm1.js'
  cm1 = fs.readFileSync('docs/cm1.html');
  css = fs.readFileSync('docs/docco.css');
  child.exec 'git checkout gh-pages'
  fs.writeFileSync 'index.html', cm1
  fs.writeFileSync 'docco.css', css
  child.exec 'git add index.html docco.css'
  child.exec 'git commit -m "update gh-pages"'
  child.exec 'git push origin gh-pages'
  child.exec 'git checkout master'

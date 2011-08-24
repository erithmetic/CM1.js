task :build do
  puts `./node_modules/.bin/browserify -o build/CM1.js -e lib/CM1.js`
end

task :test => :build do
  puts `./node_modules/.bin/vows test/*`
end

task :default => :test

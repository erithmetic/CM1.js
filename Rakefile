require 'jasmine'
load 'jasmine/tasks/jasmine.rake'

task :default => :jasmine

task :build do
  `echo '' > public/javascripts/application.js` # N.B. this doesn't work on windows, you have to manually remove the first line of application.js afterwards
  jss = Dir.glob('src/**/*.js')
  jss = %w{
    src/String.js
    src/EmissionEstimate.js
    src/EmissionEstimator.js
    src/Carbon.js
  }
  jss.each do |js|
    puts "Adding #{js}"
    `cat #{js} >> build/Carbon.js`
  end
end

require 'jasmine'
load 'jasmine/tasks/jasmine.rake'

task :default => :jasmine

task :build do
  FileUtils.mkdir_p('build')
  FileUtils.rm_f('build/Carbon.js')
  jss = Dir.glob('src/**/*.js')
  jss = %w{
    src/jquery.iecors.js
    src/String.js
    src/EmissionEstimate.js
    src/EmissionEstimator.js
    src/JSONEmissionEstimator.js
    src/JSONPEmissionEstimator.js
    src/Carbon.js
  }
  jss.each do |js|
    puts "Adding #{js}"
    `cat #{js} >> build/Carbon.js`
  end
end

task :test do
  require 'launchy'

  file = File.expand_path('SpecRunner.html')
  Launchy::Browser.run(file)
end

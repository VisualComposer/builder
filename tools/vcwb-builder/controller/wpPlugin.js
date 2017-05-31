// const BundleBuilder = require('../lib/bundleBuilder')
const fs = require('fs-extra')
const path = require('path')
const exec = require('child_process').exec
var Spinner = require('cli-spinner').Spinner
/**
 * Build template from json file
 */
exports.build = (dir, repo) => {
  dir = path.resolve(dir || process.cwd())
  if (!fs.lstatSync(dir).isDirectory()) {
    console.log("Can't create bundle. Wrong working directory.")
  }
  process.chdir(dir)
  // Clone repo
  console.log('\nCloning repo...')
  var spinner = new Spinner('processing.. %s')
  spinner.setSpinnerString('|/-\\');
  spinner.start()
  exec('git clone ' + repo, (error, x, stderr) => {
    if (stderr) {
      console.log(stderr)
    }
    const bundlePath = path.join(dir, 'visualcomposer')
    const repoPath = path.join(dir, 'builder')
    process.chdir(repoPath)
    console.log('\nBuild project...')
    exec('php ci/composer.phar install --no-dev --optimize-autoloader && npm install && npm run build-production', (error, x, stderr) => {
      if (stderr) {
        console.log(stderr)
      }
      console.log('\nCoping files...')
      fs.ensureDirSync(path.join(bundlePath, 'public/dist'))
      fs.ensureDirSync(path.join(bundlePath, 'public/sources'))
      process.chdir(bundlePath)
      exec('cp -fr ' + repoPath + '/index.php ./ &' +
        'cp -fr ' + repoPath + '/visualcomposer ./ &' +
        'cp -fr ' + repoPath + '/plugin-wordpress.php  ./ &' +
        'cp -fr ' + repoPath + '/vendor  ./ &' +
        'cp -fr ' + repoPath + '/bootstrap  ./ &' +
        'cp -fr ' + repoPath + '/cache  ./ &' +
        'cp -fr ' + repoPath + '/public/dist/wp.* ./public/dist/ &' +
        'cp -fr ' + repoPath + '/public/dist/pe.* ./public/dist/ &' +
        'cp -fr ' + repoPath + '/public/dist/front.* ./public/dist/ &' +
        'cp -fr ' + repoPath + '/public/dist/fonts ./public/dist/ &' +
        'cp -fr ' + repoPath + '/public/sources/assetsLibrary ./public/sources/ &' +
        'cp -fr ' + repoPath + '/public/sources/images ./public/sources/', (error, x, stderr) => {
        if (stderr) {
          console.log(stderr)
        }
        process.chdir(dir)
        console.log('\n' + 'Building zip bundle...')
        exec('zip -r ./visualcomposer.zip ./visualcomposer', () => {
          spinner.stop(true)
          // exec('rm -rf ' + repoPath)
          // exec('rm -rf ' + bundlePath)
          console.log("\nBuild complete")
        })

      })
    })

  })
  // Create bundle directory
  // Copy required files
  // Create zip file.
  /*
   cp -fr index.php ../vcwb-dev/ &
   cp -fr visualcomposer ../vcwb-dev/ &
   cp -fr plugin-wordpress.php  ../vcwb-dev/ &
   cp -fr vendor  ../vcwb-dev/ &
   cp -fr bootstrap  ../vcwb-dev/ &
   cp -fr cache  ../vcwb-dev/ &
   mkdir ../vcwb-dev/public &
   mkdir ../vcwb-dev/public/dist &
   mkdir ../vcwb-dev/public/sources &
   cp -fr public/dist/wp.* ../vcwb-dev/public/dist/ &
   cp -fr public/dist/pe.* ../vcwb-dev/public/dist/ &
   cp -fr public/dist/front.* ../vcwb-dev/public/dist/ &
   rm -rf ../vcwb-dev/public/dist/*.map &&
   cp -fr public/dist/fonts ../vcwb-dev/public/dist/ &
   cp -fr public/sources/categories ../vcwb-dev/public/sources/ &
   cp -fr public/sources/assetsLibrary ../vcwb-dev/public/sources/ &
   cp -fr public/sources/elements ../vcwb-dev/public/sources/ &
   cp -fr public/sources/images ../vcwb-dev/public/sources/ &
   mkdir -p ../vcwb-dev/public/sources/attributes/iconpicker/css &
   cp -fr public/sources/attributes/iconpicker/css/ ../vcwb-dev/public/sources/attributes/iconpicker/css
   find ../vcwb-dev/public/sources/elements -type f | grep -v /public/ | xargs rm -f
   */
}

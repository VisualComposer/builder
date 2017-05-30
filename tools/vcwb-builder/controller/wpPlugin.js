// const BundleBuilder = require('../lib/bundleBuilder')
const fs = require('fs-extra')
const path = require('path')
const exec = require('child_process').exec
/**
 * Build template from json file
 */
exports.build = (dir, repo) => {
  dir = path.resolve(dir || process.cwd())
  if(!fs.lstatSync(dir).isDirectory()) {
    console.log("Can't create bundle. Wrong working directory.")
  }
  exec('cd ' + dir)
  // Clone repo
  console.log('Cloning repo')
  exec('git clone '  + repo)
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
  console.log('build complete')
}


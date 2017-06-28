// const BundleBuilder = require('../lib/bundleBuilder')
const fs = require('fs-extra')
const path = require('path')
const exec = require('child_process').exec
const spawn = require('child_process').spawn
var Spinner = require('cli-spinner').Spinner
/**
 * Build template from json file
 */
exports.build = (dir, repo, commit) => {
  dir = path.resolve(dir || process.cwd())
  if (!fs.lstatSync(dir).isDirectory()) {
    console.log("Can't create bundle. Wrong working directory.")
  }
  process.chdir(dir)
  // Clone repo
  console.log('\nCloning repo...')
  var spinner = new Spinner('processing.. %s')
  spinner.setSpinnerString('|/-\\')
  spinner.start()
  let cloneCMD = `git clone --depth 1 ${repo}`
  const repoPath = path.join(dir, 'builder')
  if(commit) {
    cloneCMD = `git clone ${repo} && cd ${repoPath} && git reset --hard ${commit}`
  }
  exec(cloneCMD, (error, x, stderr) => {
    if (stderr) {
      console.log(stderr)
    }
    const bundlePath = path.join(dir, 'visualcomposer')
    process.chdir(repoPath)
    console.log('\nBuild project...')
    exec('rm -rf ./visualcomposer/Modules/Development && ' +
      'php ci/composer.phar install --no-dev --optimize-autoloader && ' +
      'php tools/php-composer/cli.php &&' +
      'npm install && npm run build-production',
      (error, x, stderr) => {
        if (error && stderr) {
          console.log(stderr)
        }
        console.log('\nCoping files...')
        fs.ensureDirSync(path.join(bundlePath, 'public/dist'))
        fs.ensureDirSync(path.join(bundlePath, 'public/sources'))
        process.chdir(bundlePath)
        exec('cp -fr ' + repoPath + '/index.php ./ &' +
          'cp -fr ' + repoPath + '/env.php ./ &' +
          'cp -fr ' + repoPath + '/license.txt ./ &' +
          'cp -fr ' + repoPath + '/visualcomposer ./ &' +
          'cp -fr ' + repoPath + '/plugin-wordpress.php  ./ &' +
          'cp -fr ' + repoPath + '/vendor  ./ &' +
          'cp -fr ' + repoPath + '/bootstrap  ./ &' +
          'cp -fr ' + repoPath + '/cache  ./ &' +
          'cp -fr ' + repoPath + '/public/dist/wpsettings* ./public/dist/ &' +
          'cp -fr ' + repoPath + '/public/dist/wpupdate.bundle.* ./public/dist/ &' +
          // 'cp -fr ' + repoPath + '/public/dist/pe.* ./public/dist/ &' +
          'cp -fr ' + repoPath + '/public/dist/vendor.bundle.js ./public/dist/ &' +
          // 'cp -fr ' + repoPath + '/public/dist/front.* ./public/dist/ &' +
          // 'cp -fr ' + repoPath + '/public/dist/fonts ./public/dist/ &' +
          'cp -fr ' + repoPath + '/public/dist/images ./public/dist/ &' +
          'rsync -av --progress ' + repoPath + '/public/sources/images ./public/sources/ ' +
          '--exclude predefinedTemplates', (error, x, stderr) => {
          if (error && stderr) {
            console.log(stderr)
          }
          process.chdir(dir)
          console.log('\n' + 'Building zip bundle...')
          exec('zip -r ./visualcomposer.zip ./visualcomposer', () => {
            spinner.stop(true)
            exec('rm -rf ' + repoPath)
            exec('rm -rf ' + bundlePath)
            console.log('\nBuild complete')
          })
        })
      })
  })
}

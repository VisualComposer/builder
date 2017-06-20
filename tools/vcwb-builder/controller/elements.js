/* global process */
// const BundleBuilder = require('../lib/bundleBuilder')
const fs = require('fs-extra')
const path = require('path')
const exec = require('child_process').exec
const spawn = require('child_process').spawn
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
  spinner.setSpinnerString('|/-\\')
  spinner.start()
  exec('git clone --depth 1 ' + repo, (error, x, stderr) => {
    if (stderr) {
      console.log(stderr)
    }
    const bundlePath = path.join(dir, 'visualcomposer-elements-bundle')
    const repoPath = path.join(dir, 'builder')
    process.chdir(repoPath)
    console.log('\nBuild project js files...')
    exec('npm install && npm run build-production',
      (error, x, stderr) => {
        if (error && stderr) {
          console.log(stderr)
        }
        console.log('\nClone elements repos...')
        exec('echo 1', (error, x, stderr) => {
          if (error && stderr) {
            console.log(stderr)
          }
          console.log('\nBuild elements...')
          exec('echo 2', (error, x, stderr) => {
            if (error && stderr) {
              console.log(stderr)
            }
            console.log('\nCoping files...')
            fs.ensureDirSync(path.join(bundlePath, 'editor'))
            process.chdir(bundlePath)
            exec('cp -fr ' + repoPath + '/public/dist/wp.bundle* ./editor/ &' +
              'cp -fr ' + repoPath + '/public/dist/wpbackend.bundle* ./editor/ &' +
              'cp -fr ' + repoPath + '/public/dist/wpbackendswitch.bundle* ./editor/ &' +
              'cp -fr ' + repoPath + '/public/dist/pe.bundle.* ./public/dist/ &' +
              'cp -fr ' + repoPath + '/public/dist/front.bundle* ./editor/ &' +
              'cp -fr ' + repoPath + '/public/dist/fonts* ./editor/ &' +
              'cp -fr ' + repoPath + '/public/dist/images* ./editor/ &', (error, x, stderr) => {
              if (error && stderr) {
                console.log(stderr)
              }
              process.chdir(path.join(dir, 'visualcomposer-elements-bundle'))
              console.log('\n' + 'Building zip archive...')
              exec('zip -r bundle.zip ./* && mv ./bundle.zip ../', () => {
                spinner.stop(true)
                exec('rm -rf ' + repoPath)
                exec('rm -rf ' + bundlePath)
                console.log('\nBuild complete')
              })
            })
          })
        })
      })
  })
}

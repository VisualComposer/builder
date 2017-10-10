const fs = require('fs')
const init = require('./cli-init')
const watch = require('node-watch')
const shell = require('shelljs')

let initData = init.get()

function check (str, val) {
  return str.includes(val)
}

let skip = ''

module.exports = function () {
  watch(
    initData.rootDir,
    {
      recursive: true,
      filter: name => {
        return !/(node_modules|.idea|.git|vc-cli|dist)/.test(name)
      }
    },
    function (event, name) {
      if (event === 'update') {
        name = name.replace(initData.rootDir, '')
        switch (true) {
          case (check(name, 'assetsLibrary')):
            name = name.replace('/public/sources/assetsLibrary/', '').split('/')[0]
            shell.cd(`${initData.rootDir}/public/sources/assetsLibrary/${name}`)
            shell.exec('webpack --config=webpack.config.js -p')
            shell.cd(initData.rootDir)
            break
          case (check(name, 'devElements')):
            if (name === skip) { // skip styles.css after compiling styles.less to prevent infinite loop
              skip = ''
              return
            }
            name = name.replace('/devElements/', '').split('/')[0]
            shell.cd(`${initData.rootDir}/devElements/${name}`)
            if (fs.existsSync(`${initData.rootDir}/devElements/${name}/${name}/public/src/init.less`)) {
              shell.exec(`lessc ${name}/public/src/init.less ${name}/styles.css --autoprefix="last 2 versions"`)
              skip = `/devElements/${name}/${name}/styles.css`
            }
            shell.exec('npm run build && sed -i "" "s:../../node_modules/:./node_modules/:g" public/dist/element.bundle.js')
            break
        }
      }
    }
  )
}

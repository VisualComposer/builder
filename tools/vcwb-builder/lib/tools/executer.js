const execFile = require('child-process-promise').exec
module.exports = {
  clone (repo, path, commit) {
    let cloneCMD = `git clone --depth 1 ${repo} ${path}`
    if (commit) {
      cloneCMD = `git clone ${repo} ${path} && cd ${path} && git reset --hard ${commit}`
    }
    return this.exec(cloneCMD)
  },
  exec (cmd, options = {}) {
    if (!options.maxBuffer) {
      options.maxBuffer = 500 * 1024
    }
    return execFile(cmd, options).catch((result) => {
      console.log(result.toString())
      process.exit()
    })
  }
}
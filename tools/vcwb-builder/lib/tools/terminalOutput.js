const Spinner = require('cli-spinner').Spinner
var colors = require('colors')
module.exports = {
  consoleSeparator (text) {
    process.stdout.write("\r\x1b[K")
    this.logWhite('--------------------------------')
    text && this.log(text)
  },
  startSpinner () {
    this.spinner = new Spinner({
      text: '%s ',
      stream: process.stderr
    })
    this.spinner.start()
  },
  stopSpinner () {
    this.spinner && this.spinner.stop()
  },
  addEventsToProcess (processCallback) {
    process.on('SIGINT', function () {
      process.exit()
    })
    process.on('exit', processCallback)
  },
  logWhite (text) {
    this.log(text.white)
  },
  logGreen (text) {
    this.log(text.green)
  },
  logRed (text) {
    this.log(text.red)
  },
  log (text) {
    console.log(text)
  }
}
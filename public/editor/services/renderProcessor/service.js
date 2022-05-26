import { addService } from 'vc-cake'

let processes = []
const Service = {
  add (promise) {
    processes.push(promise)
  },
  appAllDone () {
    this.clearTimeout()
    const renderPromise = new window.Promise((resolve) => {
      this.timeout = window.setTimeout(() => {
        console.warn && console.warn('RenderProcess timed-out')
        this.purge()
        resolve()
      }, 60 * 1000)

      Promise.all(processes).then(() => {
        this.purge()
        resolve()
      }).catch((e) => {
        console.warn && console.warn('renderProcessor failed', e)
        this.purge()
        resolve()
      })
    })
    return renderPromise
  },
  clearTimeout () {
    this.timeout && window.clearTimeout(this.timeout)
    this.timeout = null
  },
  purge () {
    this.clearTimeout()
    processes = []
  }
}
addService('renderProcessor', Service)

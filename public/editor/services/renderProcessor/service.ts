import { addService } from 'vc-cake'

interface RenderProcessor {
  timeout: null | number,
  clearTimeout: () => void,
  purge: () => void,
  add: (promise:boolean)=> void,
  appAllDone: () => Promise<boolean>
}

let processes:boolean[] = []
const Service:RenderProcessor = {
  timeout: null,
  add (promise:boolean) {
    processes.push(promise)
  },
  appAllDone (): Promise<boolean> {
    this.clearTimeout()
    return new window.Promise<boolean>((resolve) => {
      this.timeout = window.setTimeout(() => {
        console.warn && console.warn('RenderProcess timed-out')
        this.purge()
        resolve(true)
      }, 60 * 1000)

      Promise.all(processes).then(() => {
        this.purge()
        resolve(true)
      }).catch((e) => {
        console.warn && console.warn('renderProcessor failed', e)
        this.purge()
        resolve(true)
      })
    })
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

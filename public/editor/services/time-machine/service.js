import vcCake from 'vc-cake'

let timeMachine = {
  stack: [],
  stackPosition: 0,
  stackHash: '',
  zeroState: {},
  locked: false,
  add: function (data) {
    // Do not store same data again
    if (this.stackHash === JSON.stringify(data)) {
      return
    }
    if (this.can('redo')) {
      this.stack = this.stack.slice(0, this.stackPosition)
    }
    this.stack.push(data)
    this.stackPosition = this.stack.length
    this.stackHash = JSON.stringify(this.get())
  },
  can: function (what) {
    let result = false
    if (what === 'undo') {
      result = this.stack.length > 0 && this.stackPosition > 0
    } else if (what === 'redo') {
      result = this.stack.length > 0 && this.stackPosition < this.stack.length
    }

    return result
  },
  undo: function () {
    if (this.can('undo')) {
      this.stackPosition -= 1
      this.stackHash = JSON.stringify(this.get())
    }
  },
  redo: function () {
    if (this.can('redo')) {
      this.stackPosition += 1
      this.stackHash = JSON.stringify(this.get())
    }
  },
  set: function (index) {
    if (this.stackPosition < index) {
      this.stack = this.stack.slice(index - this.stackPosition)
      this.stackHash = JSON.stringify(this.get())
      return true
    }
    return false
  },
  get: function () {
    if (this.stackPosition < 1) {
      return this.zeroState
    } else {
      return this.stack[ this.stackPosition - 1 ]
    }
  },
  setZeroState: function (data) {
    this.zeroState = data
    this.stackHash = JSON.stringify(this.get())
  }
}

const API = {
  add (document) {
    timeMachine.lock !== true && timeMachine.add(document)
  },
  getCurrentPosition () {
    return timeMachine.stackPosition
  },
  undo () {
    timeMachine.undo()
    return API.get()
  },
  redo () {
    timeMachine.redo()
    return API.get()
  },
  get () {
    return timeMachine.get()
  },
  canUndo () {
    return timeMachine.can('undo')
  },
  canRedo () {
    return timeMachine.can('redo')
  },
  setZeroState (data) {
    timeMachine.setZeroState(data)
  },
  lock () {
    timeMachine.lock = true
  },
  unlock () {
    timeMachine.lock = false
  },
  isLocked () {
    return timeMachine.lock === true
  }
}

vcCake.addService('time-machine', API)

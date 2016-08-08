import vcCake from 'vc-cake'

let TimeMachine = {
  stack: [],
  stackPosition: 0,
  stackHash: '',
  zeroState: {},
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
  add: (document) => {
    TimeMachine.add(document)
  },
  getCurrentPosition: () => {
    return TimeMachine.stackPosition
  },
  undo: () => {
    TimeMachine.undo()
    return API.get()
  },
  redo: () => {
    TimeMachine.redo()
    return API.get()
  },
  get: () => {
    return TimeMachine.get()
  },
  canUndo: () => {
    return TimeMachine.can('undo')
  },
  canRedo: () => {
    return TimeMachine.can('redo')
  },
  setZeroState: (data) => {
    TimeMachine.setZeroState(data)
  }
}

vcCake.addService('time-machine', API)

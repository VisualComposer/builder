export default class TimeMachine {
  constructor (name, limit = 0) {
    Object.defineProperties(this, {
      /**
       * @memberOf! TimeMachine
       */
      name: {
        enumerable: false,
        configurable: false,
        writable: false,
        value: name
      },
      /**
       * @memberOf! TimeMachine
       */
      stack: {
        enumerable: false,
        configurable: false,
        writable: false,
        value: []
      },
      /**
       * @memberOf! TimeMachine
       */
      stackPosition: {
        enumerable: false,
        configurable: false,
        writable: true,
        value: 0
      },
      /**
       * @memberOf! TimeMachine
       */
      stackHash: {
        enumerable: false,
        configurable: false,
        writable: true,
        value: ''
      },
      zeroState: {
        enumerable: false,
        configurable: false,
        writable: true,
        value: {}
      },
      locked: {
        enumerable: false,
        configurable: false,
        writable: true,
        value: false
      },
      /**
       * @memberOf! TimeMachine
       */
      limit: {
        enumerable: false,
        configurable: false,
        writable: true,
        value: limit
      }
    })
  }
  add (data) {
    if (this.locked) {
      return true
    }
    // Do not store same data again
    if (this.stackHash === JSON.stringify(data)) {
      return
    }
    if (this.can('redo')) {
      this.stack = this.stack.slice(0, this.stackPosition)
    }
    this.stack.push(data)
    if (this.limit > 0) {
      this.stack = this.stack.slice(0, this.limit)
    }
    this.stackPosition = this.stack.length
    this.stackHash = JSON.stringify(this.get())
  }
  can (what) {
    let result = false
    if (what === 'undo') {
      result = this.stack.length > 0 && this.stackPosition > 0
    } else if (what === 'redo') {
      result = this.stack.length > 0 && this.stackPosition < this.stack.length
    }

    return result
  }
  canUndo () {
    return this.can('undo')
  }
  canRedo () {
    return this.can('redo')
  }
  undo () {
    if (this.can('undo')) {
      this.stackPosition -= 1
      this.stackHash = JSON.stringify(this.get())
    }
  }
  redo () {
    if (this.can('redo')) {
      this.stackPosition += 1
      this.stackHash = JSON.stringify(this.get())
    }
  }
  set (index) {
    if (this.stackPosition < index) {
      this.stack = this.stack.slice(index - this.stackPosition)
      this.stackHash = JSON.stringify(this.get())
      return true
    }
    return false
  }
  get () {
    if (this.stackPosition < 1) {
      return this.zeroState
    } else {
      return this.stack[ this.stackPosition - 1 ]
    }
  }
  setZeroState (data) {
    this.zeroState = data
    this.stackHash = JSON.stringify(this.get())
  }
}

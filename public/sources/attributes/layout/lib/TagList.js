import React from 'react'
// import classNames from 'classnames'
import './styles.less'

class TagList extends React.Component {

  constructor () {
    super()
    this.state = {
      inputValue: '',
      inputValueArray: [],
      doGrouping: false
    }
  }

  componentDidMount () {
    this.addShortcuts()
  }

  updateInputValue (inputValue) {
    this.setState({inputValue})
  }

  handleGrouping = () => {
    if (!this.state.doGrouping) {
      let input = document.querySelector('.vcv-ui-tag-list')
      this.updateInputValue(input.textContent)

      setTimeout(() => {
        input.innerHTML = ''
        this.createValueArray()
        this.changeGroupingState()

        // add event listener
        input.addEventListener('click', this.contentEditableClick)
      }, 100)
    }
  }

  placeCaretAtEnd (el) {
    el.focus()
    if (typeof window.getSelection !== 'undefined' && typeof document.createRange !== 'undefined') {
      var range = document.createRange()
      range.selectNodeContents(el)
      range.collapse(false)
      var sel = window.getSelection()
      sel.removeAllRanges()
      sel.addRange(range)
    } else if (typeof document.body.createTextRange !== 'undefined') {
      var textRange = document.body.createTextRange()
      textRange.moveToElementText(el)
      textRange.collapse(false)
      textRange.select()
    }
  }

  contentEditableClick = (e) => {
    let input = document.querySelector('.vcv-ui-tag-list')
    let d = e.target
    let className = 'vcv-ui-tag-list-item-remove'

    // check if close button was clicked
    while (d != null && d.className && !d.classList.contains(className)) {
      d = d.parentNode
    }
    let insideClose = (d != null && d.classList.contains(className))

    if (insideClose) {
      this.removeToken(e, input)
    } else {
      this.changeGroupingState()
      input.innerHTML = this.state.inputValueArray.join(' + ')
      this.placeCaretAtEnd(input)

      // remove event listener
      input.removeEventListener('click', this.contentEditableClick)
    }
  }

  changeGroupingState () {
    this.setState({doGrouping: !this.state.doGrouping})
  }

  // remove clicked elements string from array
  removeToken (e, input) {
    let el = e.target
    let className = 'vcv-ui-tag-list-item'

    while (el != null && el.className && !el.classList.contains(className)) {
      el = el.parentNode
    }

    let clickedText = el.textContent
    let index = this.state.inputValueArray.indexOf(clickedText)

    if (index > -1) {
      this.state.inputValueArray.splice(index, 1)
    }

    if (this.state.inputValueArray.length === 0) {
      this.state.inputValue = ''
      this.state.doGrouping = false
      input.removeEventListener('click', this.contentEditableClick)

      setTimeout(() => {
        input.focus()
      }, 100)
    }

    this.forceUpdate()
  }

  // remove shortcut plugin
  shortcut = {
    all_shortcuts: {}, // All the shortcuts are stored in this array
    add: function (shortcutCombination, callback, opt) {
      let code

      // Provide a set of default options
      var defaultOptions = {
        'type': 'keydown',
        'propagate': false,
        'disable_in_input': false,
        'target': document,
        'keycode': false
      }
      if (!opt) opt = defaultOptions
      else {
        for (let dfo in defaultOptions) {
          if (typeof opt[dfo] === 'undefined') opt[dfo] = defaultOptions[dfo]
        }
      }

      var ele = opt.target
      if (typeof opt.target === 'string') ele = document.getElementById(opt.target)

      shortcutCombination = shortcutCombination.toLowerCase()

      // The function to be called at keyPress
      var func = function (e) {
        e = e || window.event

        if (opt['disable_in_input']) { // Don't enable shortcut keys in Input, Textarea fields
          var element
          if (e.target) element = e.target
          else if (e.srcElement) element = e.srcElement
          if (element.nodeType === 3) element = element.parentNode

          if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') return
        }

        // Find Which key is pressed
        if (e.keyCode) code = e.keyCode
        else if (e.which) code = e.which
        var character = String.fromCharCode(code).toLowerCase()

        if (code === 188) character = ',' // If the user presses , when the type is onkeydown
        if (code === 190) character = '.' // If the user presses , when the type is onkeydown

        var keys = shortcutCombination.split('+')
        // Key Pressed - counts the number of valid keypresses - if it is same as the number of keys, the shortcut function is invoked
        var kp = 0

        // Work around for stupid Shift key bug created by using lowercase - as a result the shift+num combination was broken
        var shiftNums = {
          '`': '~',
          '1': '!',
          '2': '@',
          '3': '#',
          '4': '$',
          '5': '%',
          '6': '^',
          '7': '&',
          '8': '*',
          '9': '(',
          '0': ')',
          '-': '_',
          '=': '+',
          ';': ':',
          '\'': '"',
          ',': '<',
          '.': '>',
          '/': '?',
          '\\': '|'
        }
        // Special Keys - and their codes
        var specialKeys = {
          'esc': 27,
          'escape': 27,
          'tab': 9,
          'space': 32,
          'return': 13,
          'enter': 13,
          'backspace': 8,

          'scrolllock': 145,
          'scroll_lock': 145,
          'scroll': 145,
          'capslock': 20,
          'caps_lock': 20,
          'caps': 20,
          'numlock': 144,
          'num_lock': 144,
          'num': 144,

          'pause': 19,
          'break': 19,

          'insert': 45,
          'home': 36,
          'delete': 46,
          'end': 35,

          'pageup': 33,
          'page_up': 33,
          'pu': 33,

          'pagedown': 34,
          'page_down': 34,
          'pd': 34,

          'left': 37,
          'up': 38,
          'right': 39,
          'down': 40,

          'f1': 112,
          'f2': 113,
          'f3': 114,
          'f4': 115,
          'f5': 116,
          'f6': 117,
          'f7': 118,
          'f8': 119,
          'f9': 120,
          'f10': 121,
          'f11': 122,
          'f12': 123
        }

        var modifiers = {
          shift: {wanted: false, pressed: false},
          ctrl: {wanted: false, pressed: false},
          alt: {wanted: false, pressed: false},
          meta: {wanted: false, pressed: false} // Meta is Mac specific
        }

        if (e.ctrlKey) modifiers.ctrl.pressed = true
        if (e.shiftKey) modifiers.shift.pressed = true
        if (e.altKey) modifiers.alt.pressed = true
        if (e.metaKey) modifiers.meta.pressed = true

        for (let i = 0; i < keys.length; i++) {
          let k = keys[i]

          // Modifiers
          if (k === 'ctrl' || k === 'control') {
            kp++
            modifiers.ctrl.wanted = true
          } else if (k === 'shift') {
            kp++
            modifiers.shift.wanted = true
          } else if (k === 'alt') {
            kp++
            modifiers.alt.wanted = true
          } else if (k === 'meta') {
            kp++
            modifiers.meta.wanted = true
          } else if (k.length > 1) { // If it is a special key
            if (specialKeys[k] === code) kp++
          } else if (opt['keycode']) {
            if (opt['keycode'] === code) kp++
          } else { // The special keys did not match
            if (character === k) kp++
            else {
              if (shiftNums[character] && e.shiftKey) { // Stupid Shift key bug created by using lowercase
                character = shiftNums[character]
                if (character === k) kp++
              }
            }
          }
        }

        if (kp === keys.length &&
          modifiers.ctrl.pressed === modifiers.ctrl.wanted &&
          modifiers.shift.pressed === modifiers.shift.wanted &&
          modifiers.alt.pressed === modifiers.alt.wanted &&
          modifiers.meta.pressed === modifiers.meta.wanted) {
          callback(e)

          if (!opt['propagate']) { // Stop the event
            // e.cancelBubble is supported by IE - this will kill the bubbling process.
            e.cancelBubble = true
            e.returnValue = false

            // e.stopPropagation works in Firefox.
            if (e.stopPropagation) {
              e.stopPropagation()
              e.preventDefault()
            }
            return false
          }
        }
      }
      this.all_shortcuts[shortcutCombination] = {
        'callback': func,
        'target': ele,
        'event': opt['type']
      }
      // Attach the function with the event
      if (ele.addEventListener) ele.addEventListener(opt['type'], func, false)
      else if (ele.attachEvent) ele.attachEvent('on' + opt['type'], func)
      else ele['on' + opt['type']] = func
    }
  }

  addShortcuts () {
    let input = document.querySelector('.vcv-ui-tag-list')

    const shortcutCombinations = ['Ctrl+B', 'Ctrl+U', 'Ctrl+I', 'Meta+B', 'Meta+U', 'Meta+I', 'Enter']

    // removing all shortcuts from contentEditable element
    // adding event on enter
    for (let i = 0; i < shortcutCombinations.length; i++) {
      this.shortcut.add(shortcutCombinations[i], () => {
        if (shortcutCombinations[i] === 'Enter') {
          this.handleGrouping()
        }
        return false
      }, {'target': input})
    }
  }

  createValueArray () {
    this.state.inputValueArray = []
    let regex = /[ ,+;]/

    let splitString = this.state.inputValue.split(regex)

    for (let i = 0; i < splitString.length; i++) {
      let singleItem = splitString[i].trim()
      if (singleItem) {
        this.state.inputValueArray.push(singleItem)
      }
    }
  }

  render () {
    let tokenized = []

    if (this.state.doGrouping) {
      for (let i = 0; i < this.state.inputValueArray.length; i++) {
        tokenized.push(
          <span key={'groupSet-' + i} className='vcv-ui-tag-list-item'>
            {this.state.inputValueArray[i]}
            <button className='vcv-ui-tag-list-item-remove' type='button' title='Remove'>
              <i className='vcv-ui-icon vcv-ui-icon-close-thin' />
            </button>
          </span>
        )
      }
    }
    return (
      <div className='vcv-ui-tag-list vcv-ui-form-input' contentEditable={!this.state.doGrouping} onBlur={this.handleGrouping}>
        {tokenized}
      </div>
    )
  }
}

export default TagList

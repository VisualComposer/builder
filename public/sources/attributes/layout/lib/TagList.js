import React from 'react'
import classNames from 'classnames'
import './styles.less'

export default class TagList extends React.Component {

  constructor () {
    super()
    this.state = {
      inputValue: '',
      tagList: [
        // {tagText: '1/2', valid: true},
        // {tagText: '1/2', valid: true}
      ],
      grouped: false,
      suggestDefault: [
        '1/1', '1/2 + 1/2', '1/3 + 1/3 + 1/3',
        '1/4 + 1/4 + 1/4 + 1/4',
        '1/5 + 1/5 + 1/5 + 1/5 + 1/5',
        '1/6 + 1/6 + 1/6 + 1/6 + 1/6 + 1/6',
        '2/3 + 1/3', '1/4 + 3/4',
        '1/4 + 1/2 + 1/4', '1/6 + 2/3 + 1/6',
        'Javascript', 'Java', 'Php'
      ],
      suggestVisible: false,
      suggested: []
    }
  }

  componentDidMount () {
    this.addShortcuts()

    if (this.state.tagList.length) {
      this.handleGrouping()
    }
  }

  updateInputValue = (e) => {
    let inputValue = e.target.textContent
    this.setState({ inputValue })

    this.suggestBox(inputValue)
  }

  // when user clicks outside of input or presses enter
  handleGrouping = () => {
    let input = document.querySelector('.vcv-ui-tag-list')
    let inputVal = input.textContent

    this.setState({
      suggestVisible: false,
      inputValue: inputVal
    })

    if (!this.state.grouped) {
      // TODO - need to change this, not gonna work if there will be more inputs

      setTimeout(() => {
        input.innerHTML = ''
        this.createTagList()
        this.setState({ grouped: true })
        input.addEventListener('click', this.contentEditableClick)
      }, 100)
    }
  }

  handleSuggest = (e) => {
    let input = document.querySelector('.vcv-ui-tag-list')
    let el = e.target
    input.innerHTML = el.textContent
    this.placeCaretAtEnd(input)

    this.removeSuggestSelected(el)
    this.addClass(el, 'selected')
  }

  removeSuggestSelected () {
    let suggestItems = document.querySelectorAll('.vcv-ui-suggest-box-item')

    suggestItems.forEach((item) => {
      this.removeClass(item, 'selected')
    })
  }

  returnPrevVal = () => {
    let input = document.querySelector('.vcv-ui-tag-list')
    input.innerHTML = this.state.inputValue
    this.placeCaretAtEnd(input)
    this.removeSuggestSelected()
  }

  placeCaretAtEnd (el) {
    el.focus()
    if (typeof window.getSelection !== 'undefined' && typeof document.createRange !== 'undefined') {
      let range = document.createRange()
      range.selectNodeContents(el)
      range.collapse(false)
      let sel = window.getSelection()
      sel.removeAllRanges()
      sel.addRange(range)
    } else if (typeof document.body.createTextRange !== 'undefined') {
      let textRange = document.body.createTextRange()
      textRange.moveToElementText(el)
      textRange.collapse(false)
      textRange.select()
    }
  }

  // when user clicks to input, rounded tags converts to string as an input value
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
      this.removeTag(e, input)
    } else {
      this.setState({ grouped: false })

      let tagArray = []

      this.state.tagList.forEach((item) => {
        tagArray.push(item.tagText)
      })

      let inputValue = tagArray.join(' + ')
      input.innerHTML = inputValue

      this.setState({
        inputValue: inputValue
      })

      this.placeCaretAtEnd(input)

      // remove event listener
      input.removeEventListener('click', this.contentEditableClick)
    }
  }

  // remove clicked element from tagList array
  removeTag (e, input) {
    let el = e.target
    let tagClass = 'vcv-ui-tag-list-item'

    while (el != null && el.className && !el.classList.contains(tagClass)) {
      el = el.parentNode
    }

    let index = el.dataset.index

    if (index > -1) {
      let tagList = this.state.tagList

      tagList.splice(index, 1)

      this.setState({
        tagList: tagList
      })
    }

    if (this.state.tagList.length === 0) {
      this.setState({
        inputValue: '',
        grouped: false
      })

      input.removeEventListener('click', this.contentEditableClick)

      setTimeout(() => {
        input.focus()
      }, 100)
    }
  }

  // tag validation takes array with string and outputs an array with objects, with keys- text and valid
  tagValidation (tagArray) {
    let tagList = []

    tagArray.forEach((item, index) => {
      tagList[ index ] = {
        tagText: item,
        valid: this.validation(item)
      }
    })

    return tagList
  }

  validation = (tagText) => {
    let fractionRegex = /^(\d+)\/(\d+)$/

    if (fractionRegex.test(tagText)) {
      // test if fraction is less than 1
      let results = fractionRegex.exec(tagText)
      return parseInt(results[ 1 ]) <= parseInt(results[ 2 ])
    }
    return false
  }

  // remove shortcut plugin
  shortcut = {
    all_shortcuts: {}, // All the shortcuts are stored in this array
    add: function (shortcutCombination, callback, opt) {
      let code

      // Provide a set of default options
      let defaultOptions = {
        'type': 'keydown',
        'propagate': false,
        'disable_in_input': false,
        'target': document,
        'keycode': false
      }
      if (!opt) {
        opt = defaultOptions
      } else {
        for (let dfo in defaultOptions) {
          if (typeof opt[ dfo ] === 'undefined') {
            opt[ dfo ] = defaultOptions[ dfo ]
          }
        }
      }

      let ele = opt.target
      if (typeof opt.target === 'string') {
        ele = document.getElementById(opt.target)
      }

      shortcutCombination = shortcutCombination.toLowerCase()

      // The function to be called at keyPress
      let func = function (e) {
        e = e || window.event

        if (opt[ 'disable_in_input' ]) { // Don't enable shortcut keys in Input, Textarea fields
          let element
          if (e.target) {
            element = e.target
          } else if (e.srcElement) {
            element = e.srcElement
          }
          if (element.nodeType === 3) {
            element = element.parentNode
          }

          if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
            return
          }
        }

        // Find Which key is pressed
        if (e.keyCode) {
          code = e.keyCode
        } else if (e.which) {
          code = e.which
        }
        let character = String.fromCharCode(code).toLowerCase()

        if (code === 188) {
          character = ','
        } // If the user presses , when the type is onkeydown
        if (code === 190) {
          character = '.'
        } // If the user presses , when the type is onkeydown

        let keys = shortcutCombination.split('+')
        // Key Pressed - counts the number of valid keypresses - if it is same as the number of keys, the shortcut function is invoked
        let kp = 0

        // Work around for stupid Shift key bug created by using lowercase - as a result the shift+num combination was broken
        let shiftNums = {
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
        let specialKeys = {
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

        let modifiers = {
          shift: { wanted: false, pressed: false },
          ctrl: { wanted: false, pressed: false },
          alt: { wanted: false, pressed: false },
          meta: { wanted: false, pressed: false } // Meta is Mac specific
        }

        if (e.ctrlKey) {
          modifiers.ctrl.pressed = true
        }
        if (e.shiftKey) {
          modifiers.shift.pressed = true
        }
        if (e.altKey) {
          modifiers.alt.pressed = true
        }
        if (e.metaKey) {
          modifiers.meta.pressed = true
        }

        keys.forEach((item) => {
          let k = item

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
            if (specialKeys[ k ] === code) {
              kp++
            }
          } else if (opt[ 'keycode' ]) {
            if (opt[ 'keycode' ] === code) {
              kp++
            }
          } else { // The special keys did not match
            if (character === k) {
              kp++
            } else {
              if (shiftNums[ character ] && e.shiftKey) { // Stupid Shift key bug created by using lowercase
                character = shiftNums[ character ]
                if (character === k) {
                  kp++
                }
              }
            }
          }
        })

        if (kp === keys.length &&
          modifiers.ctrl.pressed === modifiers.ctrl.wanted &&
          modifiers.shift.pressed === modifiers.shift.wanted &&
          modifiers.alt.pressed === modifiers.alt.wanted &&
          modifiers.meta.pressed === modifiers.meta.wanted) {
          callback(e)

          if (!opt[ 'propagate' ]) { // Stop the event
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
      this.all_shortcuts[ shortcutCombination ] = {
        'callback': func,
        'target': ele,
        'event': opt[ 'type' ]
      }
      // Attach the function with the event
      if (ele.addEventListener) {
        ele.addEventListener(opt[ 'type' ], func, false)
      } else if (ele.attachEvent) {
        ele.attachEvent(`on${opt[ 'type' ]}`, func)
      } else {
        ele[ `on${opt[ 'type' ]}` ] = func
      }
    }
  }

  addShortcuts () {
    let input = document.querySelector('.vcv-ui-tag-list')

    const shortcutCombinations = [ 'Ctrl+B', 'Ctrl+U', 'Ctrl+I', 'Meta+B', 'Meta+U', 'Meta+I', 'Enter' ]

    // removing all shortcuts from contentEditable element
    // adding event on enter
    shortcutCombinations.forEach((item) => {
      this.shortcut.add(item, () => {
        if (item === 'Enter') {
          this.handleGrouping()
        }
        return false
      }, { 'target': input })
    })
  }

  // creates a tag list from an input value
  createTagList (inputVal = this.state.inputValue) {
    let regex = /[ ,+;]/
    let tagArray = inputVal.split(regex)
    let tagArrayTrimmed = []

    tagArray.forEach((item) => {
      let singleItem = item.trim()
      if (singleItem) {
        tagArrayTrimmed.push(singleItem)
      }
    })

    this.setState({
      tagList: this.tagValidation(tagArrayTrimmed)
    })
  }

  // suggestBox
  suggestBox (inputValue) {
    let myArr = []
    let sanitizedValue = this.sanitizeInput(inputValue)
    let valueRegex = new RegExp(sanitizedValue)

    this.state.suggestDefault.forEach((item) => {
      if (valueRegex.test(item)) {
        myArr.push(item)
      }
    })

    this.setState({
      suggested: myArr
    })

    this.setState({ suggestVisible: myArr.length })
  }

  hasClass (el, className) {
    if (el.classList) {
      return el.classList.contains(className)
    } else {
      return !!el.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'))
    }
  }

  addClass (el, className) {
    if (el.classList) {
      el.classList.add(className)
    } else if (!this.hasClass(el, className)) {
      el.className += ' ' + className
    }
  }

  removeClass (el, className) {
    if (el.classList) {
      el.classList.remove(className)
    } else if (this.hasClass(el, className)) {
      var reg = new RegExp('(\\s|^)' + className + '(\\s|$)')
      el.className = el.className.replace(reg, ' ')
    }
  }

  handleArrowSuggest = (e) => {
    if (this.state.suggestVisible) {
      let suggestItems = document.querySelectorAll('.vcv-ui-suggest-box-item')

      let key = e.keyCode
      let selected = ''
      let current

      if (key !== 40 && key !== 38) return

      suggestItems.forEach((item) => {
        if (this.hasClass(item, 'selected')) {
          selected = item
          this.removeClass(item, 'selected')
        }
      })

      // Down key
      if (key === 40) {
        if (!selected || !selected.nextSibling) {
          current = suggestItems[0]
        } else {
          current = selected.nextSibling
        }
      } else if (key === 38) {
        if (!selected || !selected.previousSibling) {
          current = suggestItems[suggestItems.length - 1]
        } else {
          current = selected.previousSibling
        }
      }

      let input = document.querySelector('.vcv-ui-tag-list')
      input.innerHTML = current.textContent

      this.addClass(current, 'selected')
    }
  }

  sanitizeInput (inputValue) {
    let sanitizedValue = inputValue
    sanitizedValue = sanitizedValue.replace(/\s+/g, '')
    sanitizedValue = sanitizedValue.replace(/\++/g, '\\s?\\+?\\s?')

    return sanitizedValue
  }

  render () {
    let tags = []

    if (this.state.grouped) {
      this.state.tagList.forEach((item, index) => {
        let tagClasses = classNames({
          'vcv-ui-tag-list-item': true,
          'vcv-ui-tag-list-item-error': !item.valid
        })
        tags.push(
          <span key={'tagItem' + index} data-index={index} className={tagClasses}>
            {item.tagText}
            <button className='vcv-ui-tag-list-item-remove' type='button' title='Remove'>
              <i className='vcv-ui-icon vcv-ui-icon-close-thin' />
            </button>
          </span>
        )
      })
    }

    let suggestBox = ''
    let suggestItems = []

    if (this.state.suggestVisible) {
      this.state.suggested.forEach((item, index) => {
        suggestItems.push(
          <span key={'suggest' + index}
            className='vcv-ui-suggest-box-item'
            onMouseEnter={this.handleSuggest}
            onMouseLeave={this.returnPrevVal}

          >
            {item}
          </span>
        )
      })

      suggestBox = (
        <div className='vcv-ui-suggest-box'>
          {suggestItems}
        </div>
      )
    }
    return (
      <div className='vcv-ui-tag-list-container'>

        <div suppressContentEditableWarning
          className='vcv-ui-tag-list vcv-ui-form-input'
          contentEditable={!this.state.grouped}
          onBlur={this.handleGrouping}
          onInput={this.updateInputValue}
          onKeyDown={this.handleArrowSuggest}
        >
          {tags}
        </div>
        {suggestBox}

      </div>
    )
  }
}

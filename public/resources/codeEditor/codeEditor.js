import CodeMirror from 'codemirror'

import jshint from 'jshint'
import htmlhint from 'htmlhint'
import csslint from 'csslint'

import 'codemirror/lib/codemirror.css'

import 'codemirror/mode/javascript/javascript'
import 'codemirror/mode/htmlmixed/htmlmixed'
import 'codemirror/mode/css/css'

import 'codemirror/addon/fold/foldgutter.css'
import 'codemirror/addon/fold/foldgutter'
import 'codemirror/addon/fold/brace-fold'
import 'codemirror/addon/fold/markdown-fold'
import 'codemirror/addon/fold/xml-fold'
import 'codemirror/addon/fold/comment-fold'

import 'codemirror/addon/comment/comment'
import 'codemirror/addon/comment/continuecomment'

import 'codemirror/addon/hint/show-hint.css'
import 'codemirror/addon/hint/show-hint'
import 'codemirror/addon/hint/css-hint'
import 'codemirror/addon/hint/javascript-hint'
import 'codemirror/addon/hint/html-hint'

import 'codemirror/addon/selection/active-line'

import 'codemirror/addon/edit/closebrackets'
import 'codemirror/addon/edit/matchbrackets'

import 'codemirror/addon/lint/lint.css'
import 'codemirror/addon/lint/lint'
import 'codemirror/addon/lint/javascript-lint'
import 'codemirror/addon/lint/html-lint'
import 'codemirror/addon/lint/css-lint'

import 'codemirror/addon/scroll/simplescrollbars.css'
import 'codemirror/addon/scroll/simplescrollbars'

const privateAPI = {
  cssValidator (text, options) {
    let found = []
    if (!csslint.CSSLint) {
      if (window.console) {
        window.console.error('Error: window.CSSLint not defined, CodeMirror CSS linting cannot run.')
      }
      return found
    }
    let messages = csslint.CSSLint.verify(text, options).messages
    messages.forEach((message) => {
      let startLine = message.line - 1
      let endLine = message.line - 1
      let startCol = message.col - 1
      let endCol = message.col
      found.push({
        from: CodeMirror.Pos(startLine, startCol),
        to: CodeMirror.Pos(endLine, endCol),
        message: message.message,
        severity: message.type
      })
    })
    return found
  },
  htmlValidator (text, options) {
    const defaultRules = {
      'tagname-lowercase': true,
      'attr-lowercase': true,
      'attr-value-double-quotes': true,
      'doctype-first': false,
      'tag-pair': true,
      'spec-char-escape': true,
      'id-unique': true,
      'src-not-empty': true,
      'attr-no-duplication': true
    }
    let found = []
    if (!htmlhint.HTMLHint) {
      if (window.console) {
        window.console.error('Error: HTMLHint not found, not defined on window, or not available through define/require, CodeMirror HTML linting cannot run.')
      }
      return found
    }
    let messages = htmlhint.HTMLHint.verify(text, options && options.rules || defaultRules)
    messages.forEach((message) => {
      let startLine = message.line - 1
      let endLine = message.line - 1
      let startCol = message.col - 1
      let endCol = message.col
      found.push({
        from: CodeMirror.Pos(startLine, startCol),
        to: CodeMirror.Pos(endLine, endCol),
        message: message.message,
        severity: message.type
      })
    })
    return found
  },
  jsValidator (text, options) {
    if (!options.indent) { // JSHint error.character actually is a column index, this fixes underlining on lines using tabs for indentation
      options.indent = 1 // JSHint default value is 4
    }
    jshint.JSHINT(text, options, options.globals)
    let errors = jshint.JSHINT.data().errors
    let result = []
    if (errors) { privateAPI.parseErrors(errors, result) }
    return result
  },
  parseErrors (errors, result) {
    let start, end
    errors.forEach((error) => {
      if (error) {
        if (error.line <= 0 && window.console) {
          window.console.warn(`Cannot display JSHint error (invalid line ${error.line})`, error)
        }

        start = error.character - 1
        end = start + 1
        if (error.evidence) {
          let index = error.evidence.substring(start).search(/.\b/)
          if (index > -1) {
            end = index
          }
        }

        // Convert to format expected by validation service
        let hint = {
          message: error.reason,
          severity: error.code.startsWith('W') ? 'warning' : 'error',
          from: CodeMirror.Pos(error.line - 1, start),
          to: CodeMirror.Pos(error.line - 1, end)
        }

        result.push(hint)
      }
    })
  }
}

export default {
  getEditor (element, mode, value) {
    switch (mode) {
      case 'javascript':
        CodeMirror.registerHelper('lint', 'javascript', privateAPI.jsValidator)
        break
      case 'htmlmixed':
        CodeMirror.registerHelper('lint', 'html', privateAPI.htmlValidator)
        break
      case 'css':
        CodeMirror.registerHelper('lint', 'css', privateAPI.cssValidator)
        break
    }
    return CodeMirror(element, {
      value: value,
      mode: mode,
      tabSize: 2,
      lineNumbers: true,
      /* eslint-disable */
      extraKeys: {
        'Ctrl-Space': 'autocomplete',
        'Ctrl-\/': 'toggleComment',
        'Cmd-\/': 'toggleComment'
      },
      /* eslint-enable */
      foldGutter: true,
      gutters: [
        'CodeMirror-linenumbers',
        'CodeMirror-foldgutter',
        'CodeMirror-lint-markers'
      ],
      nonEmpty: true,
      scrollbarStyle: 'overlay',
      styleActiveLine: true,
      continueComments: true,
      autoCloseBrackets: true,
      matchBrackets: true,
      lint: true,
      lintOnChange: true
    })
  }
}

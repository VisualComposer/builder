import {Component, PropTypes} from 'react'
import ReactDOM from 'react-dom'
export default class ElementComponent extends Component {
  static propTypes = {
    id: PropTypes.string,
    atts: PropTypes.object,
    editor: PropTypes.object
  }
  updateInlineHtml (tagString = '') {
    const component = ReactDOM.findDOMNode(this)
    let range = document.createRange()
    let documentFragment = range.createContextualFragment(tagString)
    component.innerHTML = ''
    console.log(documentFragment.querySelector('a'))
    component.appendChild(documentFragment)
  }
  render () {
    return null
  }
}

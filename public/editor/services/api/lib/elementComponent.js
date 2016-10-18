import {Component, PropTypes} from 'react'

export default class ElementComponent extends Component {
  static propTypes = {
    id: PropTypes.string,
    atts: PropTypes.object,
    editor: PropTypes.object
  }
  render () {
    return null
  }
}

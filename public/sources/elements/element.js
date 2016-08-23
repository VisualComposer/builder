import React from 'react'

export default class Element extends React.Component {
  static propTypes = {
    id: React.PropTypes.string.isRequired,
    editor: React.PropTypes.object.isRequired,
    atts: React.PropTypes.object.isRequired,
    children: React.PropTypes.oneOfType([
      React.PropTypes.arrayOf(React.PropTypes.node),
      React.PropTypes.node
    ])
  }
  constructor (props) {
    super(props)
    if (new.target === Element) {
      throw new TypeError('Cannot create Element instances directly.')
    }
  }
  render () {
    throw new TypeError('Cannot find render method for Element.')
  }
}

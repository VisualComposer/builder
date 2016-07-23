/*eslint no-extra-bind: "off"*/

import React from 'react'
import HtmlLayout from './html-layout'

class Editor extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      data: []
    }
  }

  componentDidMount () {
    this.props.api.reply(
      'data:changed',
      ((data) => {
        this.setState({ data: data })
      }).bind(this)
    )
  }

  render () {
    return (
      <div className='vcv-editor-here'>
        <HtmlLayout data={this.state.data} api={this.props.api} />
      </div>
    )
  }
}
Editor.propTypes = {
  api: React.PropTypes.object.isRequired
}

module.exports = Editor

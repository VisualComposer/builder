import React from 'react'
import HtmlLayout from './htmlLayout'

class LayoutEditor extends React.Component {
  state = {
    data: []
  }

  componentDidMount () {
    this.props.api.reply(
      'data:changed',
      (data) => {
        this.setState({ data: data })
      }
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
LayoutEditor.propTypes = {
  api: React.PropTypes.object.isRequired
}

export default LayoutEditor

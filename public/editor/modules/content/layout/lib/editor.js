import React from 'react'
import HtmlLayout from './htmlLayout'
// import BlankPage from './helpers/blankPage/component'

class LayoutEditor extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      data: []
    }
  }

  componentDidMount () {
    this.props.api.reply(
      'data:changed',
      (data) => {
        this.setState({ data: data })
      }
    )
  }

  getContent () {
    // TODO return condition after Blank Page is finished
    return <HtmlLayout data={this.state.data} api={this.props.api} />
    // return <BlankPage />
    // return this.state.data.length === 0 ? <BlankPage /> : <HtmlLayout data={this.state.data} api={this.props.api} />
  }
  render () {
    return (
      <div className='vcv-editor-here'>
        {this.getContent()}
      </div>
    )
  }
}
LayoutEditor.propTypes = {
  api: React.PropTypes.object.isRequired
}

export default LayoutEditor

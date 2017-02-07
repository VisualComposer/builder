import React from 'react'
import { getData } from 'vc-cake'
import HtmlLayout from './htmlLayout'
import BlankPageManagerFront from './helpers/BlankPageManagerFront/component'

export default class LayoutEditor extends React.Component {
  static propTypes = {
    api: React.PropTypes.object.isRequired
  }

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
        this.setState({ data: data }, () => {
          this.props.api.request('data:editor:render')
        })
      }
    )
  }

  getContent () {
    return this.state.data.length === 0 && getData('app:dataLoaded') === true ?
      <BlankPageManagerFront api={this.props.api} /> : <HtmlLayout data={this.state.data} api={this.props.api} />
  }

  render () {
    return (
      <div className='vcv-editor-here'>
        {this.getContent()}
      </div>
    )
  }
}

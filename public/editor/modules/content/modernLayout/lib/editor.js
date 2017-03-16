import React from 'react'
import vcCake from 'vc-cake'
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
    if (vcCake.env('FEATURE_WORKSPACE_WITH_STORAGE')) {
      const content = vcCake.getStorage('elements')
      content.state('document').onChange((data) => {
        this.setState({ data: data }, () => {
          // content.trigger('data:editor:render')
        })
      })
    }
  }

  getContent () {
    if (this.state.data.length === 0 && vcCake.getData('app:dataLoaded') === true) {
      return (<BlankPageManagerFront api={this.props.api} />)
    }
    return (<HtmlLayout data={this.state.data} api={this.props.api} />)
  }

  render () {
    return (
      <div className='vcv-editor-here'>
        {this.getContent()}
      </div>
    )
  }
}

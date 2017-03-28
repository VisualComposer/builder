import React from 'react'
import HtmlLayout from './htmlLayout'
// import BlankPageManagerFront from './helpers/BlankPageManagerFront/component'
// import BlankRowPlaceholder from '../../../../../resources/components/layoutHelpers/blankRowPlaceholder/component'

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
    // if (this.state.data.length === 0 && getData('app:dataLoaded') === true) {
    // return env('FEATURE_BLANK_PAGE_PLACEHOLDER') ? <BlankRowPlaceholder api={this.props.api} /> : <BlankPageManagerFront api={this.props.api} />
    // }
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

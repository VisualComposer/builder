import React from 'react'
import vcCake from 'vc-cake'
import HtmlLayout from './htmlLayout'
import BlankPageManagerFront from './helpers/BlankPageManagerFront/component'
const elementsStorage = vcCake.getStorage('elements')

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
    elementsStorage.state('document').onChange((data) => {
      this.setState({ data: data }, () => {
        // content.trigger('data:editor:render')
      })
    })
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

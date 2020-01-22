import React from 'react'
import vcCake from 'vc-cake'
import HtmlLayout from './htmlLayout'
import PropTypes from 'prop-types'
const elementsStorage = vcCake.getStorage('elements')
const wordpressBackendWorkspace = vcCake.getStorage('wordpressBackendWorkspace')
export default class LayoutEditor extends React.Component {
  static propTypes = {
    api: PropTypes.object.isRequired
  }

  constructor (props) {
    super(props)
    this.state = {
      data: []
    }
    this.updateData = this.updateData.bind(this)
  }

  updateData (data) {
    this.setState({ data: data }, () => {
      wordpressBackendWorkspace.state('lastAction').set('contentBuilt')
    })
  }

  componentDidMount () {
    elementsStorage.state('document').onChange(this.updateData)
  }

  componentWillUnmount () {
    elementsStorage.state('document').ignoreChange(this.updateData)
  }

  getContent () {
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

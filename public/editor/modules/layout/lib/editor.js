import React from 'react'
import vcCake from 'vc-cake'
import HtmlLayout from './htmlLayout'
import { bindEditorKeys } from 'public/tools/comboKeys'
import PropTypes from 'prop-types'

const elementsStorage = vcCake.getStorage('elements')
const wordpressDataStorage = vcCake.getStorage('wordpressData')
const workspaceStorage = vcCake.getStorage('workspace')

export default class LayoutEditor extends React.Component {
  static propTypes = {
    api: PropTypes.object.isRequired
  }

  constructor (props) {
    super(props)
    const data = elementsStorage.state('document').get() || []
    this.state = {
      data,
      isNavbarDisabled: true
    }
    this.updateState = this.updateState.bind(this)
    this.handleNavbarStateChange = this.handleNavbarStateChange.bind(this)
  }

  updateState (data) {
    this.setState({ data }, () => {
      wordpressDataStorage.state('lastAction').set('contentBuilt')
    })
  }

  componentDidMount () {
    elementsStorage.state('document').onChange(this.updateState)
    workspaceStorage.state('navbarDisabled').onChange(this.handleNavbarStateChange)
    this.props.api.notify('editor:mount')
  }

  componentWillUnmount () {
    elementsStorage.state('document').ignoreChange(this.updateState)
    workspaceStorage.state('navbarDisabled').ignoreChange(this.handleNavbarStateChange)
  }

  handleNavbarStateChange (isDisabled) {
    if (this.state.isNavbarDisabled && !isDisabled) {
      bindEditorKeys(this.document)
      this.setState({ isNavbarDisabled: false })
    }
  }

  getContent () {
    return (<HtmlLayout data={this.state.data} api={this.props.api} />)
  }

  render () {
    return (
      <div
        className='vcv-editor-here' ref={(editor) => {
          if (editor && editor.ownerDocument) {
            this.document = editor.ownerDocument
          }
        }}
      >
        {this.getContent()}
      </div>
    )
  }
}

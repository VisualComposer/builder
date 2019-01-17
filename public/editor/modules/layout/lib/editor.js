import React from 'react'
import vcCake from 'vc-cake'
import HtmlLayout from './htmlLayout'
import { bindEditorKeys } from 'public/tools/comboKeys'
import PropTypes from 'prop-types'

const elementsStorage = vcCake.getStorage('elements')
const wordpressDataStorage = vcCake.getStorage('wordpressData')

export default class LayoutEditor extends React.Component {
  static propTypes = {
    api: PropTypes.object.isRequired
  }

  constructor (props) {
    super(props)
    let data = elementsStorage.state('document').get() || []
    this.state = {
      data
    }
    this.updateState = this.updateState.bind(this)
  }

  updateState (data) {
    this.setState({ data }, () => {
      wordpressDataStorage.state('lastAction').set('contentBuilt')
    })
  }

  componentDidMount () {
    elementsStorage.state('document').onChange(this.updateState)
    this.props.api.notify('editor:mount')
    bindEditorKeys(this.document)
  }

  componentWillUnmount () {
    elementsStorage.state('document').ignoreChange(this.updateState)
  }

  getContent () {
    return (<HtmlLayout data={this.state.data} api={this.props.api} />)
  }

  render () {
    return (
      <div className='vcv-editor-here' ref={(editor) => {
        if (editor && editor.ownerDocument) {
          this.document = editor.ownerDocument
        }
      }}>
        {this.getContent()}
      </div>
    )
  }
}

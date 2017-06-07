import React from 'react'
import vcCake from 'vc-cake'
import HtmlLayout from './htmlLayout'
const elementsStorage = vcCake.getStorage('elements')
const workspaceStorage = vcCake.getStorage('workspace')

export default class LayoutEditor extends React.Component {
  static propTypes = {
    api: React.PropTypes.object.isRequired
  }

  iframeBody = null
  editFormIsOpened = false

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
    }, {
      debounce: 50
    })

    workspaceStorage.state('contentEnd').onChange((data) => {
      this.iframeBody = document.querySelector('#vcv-editor-iframe').contentWindow.document.body
      const overlayElement = document.createElement('div')
      this.createOverlayStyles(overlayElement)

      if (data === 'editElement' && !this.editFormIsOpened) {
        this.editFormIsOpened = true
        this.iframeBody.appendChild(overlayElement)
        this.iframeBody.addEventListener('click', this.closeEditForm)
      } else if (data !== 'editElement' && this.editFormIsOpened) {
        this.editFormIsOpened = false
        this.iframeBody.removeChild(this.iframeBody.querySelector('#vcv-iframe-body-overlay'))
        this.iframeBody.removeEventListener('click', this.closeEditForm)
      }
    })
  }

  componentWillUnmount () {
    this.iframeBody.removeEventListener('click', this.closeEditForm)
  }

  closeEditForm () {
    workspaceStorage.state('settings').set(false)
  }

  createOverlayStyles (element) {
    element.id = 'vcv-iframe-body-overlay'
    element.style.position = 'fixed'
    element.style.top = '0'
    element.style.left = '0'
    element.style.right = '0'
    element.style.bottom = '0'
    element.style.zIndex = '9999'
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

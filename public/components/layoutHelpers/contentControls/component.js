import React from 'react'
import RowControl from './lib/rowControl'
import vcCake from 'vc-cake'
import MobileDetect from 'mobile-detect'
import PropTypes from 'prop-types'

const workspaceStorage = vcCake.getStorage('workspace')
const elementsStorage = vcCake.getStorage('elements')
const workspaceSettings = workspaceStorage.state('settings')
const dataManager = vcCake.getService('dataManager')
const roleManager = vcCake.getService('roleManager')
const cook = vcCake.getService('cook')

export default class ContentControls extends React.Component {
  static propTypes = {
    api: PropTypes.object.isRequired,
    id: PropTypes.string.isRequired
  }

  addedId = null
  iframeWindow = null

  constructor (props) {
    super(props)
    this.state = {
      isDraggingOver: false
    }
    this.handleClick = this.handleClick.bind(this)
    this.handleDrop = this.handleDrop.bind(this)
    this.handleDragOver = this.handleDragOver.bind(this)
    this.handleDragLeave = this.handleDragLeave.bind(this)
    this.openEditForm = this.openEditForm.bind(this)

    const mobileDetect = new MobileDetect(window.navigator.userAgent)
    if (mobileDetect.mobile() && (mobileDetect.tablet() || mobileDetect.phone())) {
      this.isMobile = true
    }
    this.container = React.createRef()
  }

  componentDidMount () {
    const { current } = this.container
    const col = current.closest('.vce-col')
    const colInner = current.closest('.vce-col-inner')
    const colContent = current.closest('.vce-col-content')

    col && col.setAttribute('data-vcv-centered-control', true)
    colInner && colInner.setAttribute('data-vcv-centered-control', true)
    colContent && colContent.setAttribute('data-vcv-centered-control', true)
  }

  componentWillUnmount () {
    const { current } = this.container
    const col = current.closest('.vce-col')
    const colInner = current.closest('.vce-col-inner')
    const colContent = current.closest('.vce-col-content')

    col && col.removeAttribute('data-vcv-centered-control')
    colInner && colInner.removeAttribute('data-vcv-centered-control')
    colContent && colContent.removeAttribute('data-vcv-centered-control')
  }

  handleClick () {
    // TODO: Check this
    const element = vcCake.getService('document').get(this.props.id)
    let options = ''
    const children = vcCake.getService('cook').getContainerChildren(element.tag)
    if (children.length === 1) {
      options = children[0].tag
    }
    const currentState = workspaceSettings.get()
    if (currentState && currentState.action === 'add') {
      workspaceSettings.set(false)
      setTimeout(() => {
        workspaceStorage.trigger('add', this.props.id, options)
      }, 300)
    } else {
      workspaceStorage.trigger('add', this.props.id, options)
    }
  }

  handleDragOver (event) {
    event.stopPropagation()
    event.preventDefault()
    event.dataTransfer.dropEffect = 'copy'
    this.setState({
      isDraggingOver: true
    })
  }

  handleDragLeave (event) {
    event.stopPropagation()
    event.preventDefault()
    this.setState({
      isDraggingOver: false
    })
  }

  handleDrop (event) {
    event.stopPropagation()
    event.preventDefault()
    this.setState({
      isDraggingOver: false
    })
    const files = event.dataTransfer.files
    const images = Array.from(files).filter(file => file.type.includes('image'))
    if (images.length) {
      const elementTag = images.length > 1 ? 'imageGallery' : 'singleImage'
      const element = cook.get({ tag: elementTag }).toJS()
      element.parent = this.props.id

      elementsStorage.trigger('add', element)
      this.addedId = element.id
      // creating a global variable because otherwise it won't store files object
      window.vcvDropFile = images

      const iframe = document.getElementById('vcv-editor-iframe')
      this.iframeWindow = iframe && iframe.contentWindow && iframe.contentWindow.window
      this.iframeWindow.vcv.on('ready', this.openEditForm)
    }
  }

  openEditForm (action, id) {
    if (action === 'add' && id === this.addedId) {
      workspaceStorage.trigger('edit', this.addedId, '', { imageDrop: true })
      this.iframeWindow.vcv.off('ready', this.openEditForm)
    }
  }

  render () {
    const localizations = dataManager.get('localizations')
    const addElementText = localizations ? localizations.addElement : 'Add Element'
    const isAbleToAdd = roleManager.can('editor_content_element_add', roleManager.defaultTrue())
    let classes = 'vcvhelper vcv-row-control-container vcv-row-control-container-hide-labels vcv-is-disabled-outline'
    if (this.isMobile) {
      classes += ' vcv-row-control-container-mobile-add'
    }
    if (this.state.isDraggingOver) {
      classes += ' vcv-is-dragging'
    }
    if (!isAbleToAdd) {
      classes += ' vcv-row-control-container--add-disabled'
    }
    const action = isAbleToAdd ? this.handleClick : null

    return (
      <div
        className={classes}
        title={addElementText}
        onClick={action}
        ref={this.container}
        onDragOver={this.handleDragOver}
        onDragLeave={this.handleDragLeave}
        onDrop={this.handleDrop}
      >
        <RowControl />
      </div>
    )
  }
}

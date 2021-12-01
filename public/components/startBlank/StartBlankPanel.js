import React from 'react'
import ReactDOM from 'react-dom'
import vcCake from 'vc-cake'
import HfsPanelContent from './lib/hsfPanelContent'
import PropTypes from 'prop-types'

const workspaceStorage = vcCake.getStorage('workspace')
const workspaceSettings = workspaceStorage.state('settings')
const elementsStorage = vcCake.getStorage('elements')
const cook = vcCake.getService('cook')
const dataManager = vcCake.getService('dataManager')
const settingsStorage = vcCake.getStorage('settings')

export default class startBlank extends React.Component {
  static localizations = dataManager.get('localizations')
  static propTypes = {
    unmountStartBlank: PropTypes.func.isRequired
  }

  constructor (props) {
    super(props)
    this.handleMouseUp = this.handleMouseUp.bind(this)
    this.handleStartClick = this.handleStartClick.bind(this)
    this.openEditForm = this.openEditForm.bind(this)
  }

  componentDidMount () {
    ReactDOM.findDOMNode(this).classList.add('vcv-ui-state--visible')
  }

  handleMouseUp () {
    const dragState = workspaceStorage.state('drag')
    if (dragState.get() && dragState.get().active) {
      dragState.set({ active: false })
    }
  }

  handleStartClick () {
    const editorType = dataManager.get('editorType')
    const blankHeaderTitle = startBlank.localizations.blankHeaderTitle ? startBlank.localizations.blankHeaderTitle : 'Design your header here as a part of your layout. You can also download header templates from the Visual Composer Hub.'
    const blankFooterTitle = startBlank.localizations.blankFooterTitle ? startBlank.localizations.blankFooterTitle : 'Design your footer here as a part of your layout. You can also download footer templates from the Visual Composer Hub.'
    if (editorType === 'popup') {
      const cookElement = cook.get({ tag: 'popupRoot' }).toJS()
      const rowElement = cook.get({ tag: 'row', parent: cookElement.id }).toJS()
      elementsStorage.trigger('add', cookElement)
      elementsStorage.trigger('add', rowElement)
      this.addedId = cookElement.id
      const iframe = document.getElementById('vcv-editor-iframe')
      this.iframeWindow = iframe && iframe.contentWindow && iframe.contentWindow.window
      this.iframeWindow.vcv && this.iframeWindow.vcv.on('ready', this.openEditForm)
    } else if (editorType === 'vcv_layouts') {
      const layoutType = settingsStorage.state('layoutType').get()
      let elementTag
      if (layoutType === 'postTemplate') {
        elementTag = 'layoutContentArea'
      } else if (layoutType === 'archiveTemplate') {
        elementTag = 'layoutPostList'
      }

      const commonDesignOptions = { device: { all: { boxModel: { marginTop: '50px', marginBottom: '50px' } } } }
      const headerElement = cook.get({ tag: 'textBlock', designOptions: commonDesignOptions, output: `<p style="text-align:center;">${blankHeaderTitle}</p>` }).toJS()
      const initialElement = cook.get({ tag: elementTag }).toJS()
      const footerElement = cook.get({ tag: 'textBlock', designOptions: commonDesignOptions, output: `<p style="text-align:center;">${blankFooterTitle}</p>` }).toJS()
      elementsStorage.trigger('add', headerElement)
      elementsStorage.trigger('add', initialElement)
      elementsStorage.trigger('add', footerElement)
    } else {
      const settings = {
        action: 'add',
        element: {},
        tag: '',
        options: {}
      }
      workspaceSettings.set(settings)
    }
    this.props.unmountStartBlank()
  }

  openEditForm (action, id) {
    if (action === 'add' && id === this.addedId) {
      workspaceStorage.trigger('edit', this.addedId, '')
      this.iframeWindow.vcv.off('ready', this.openEditForm)
    }
  }

  render () {
    const editorType = dataManager.get('editorType')
    let type = editorType.replace('vcv_', '')
    type = editorType === 'vcv_layouts' ? 'Layout' : type.charAt(0).toUpperCase() + type.slice(1)
    const headingPart1 = `${startBlank.localizations ? startBlank.localizations.blankPageTitleHeadingPart1 : 'Name Your '} ${type}`
    const headingPart2 = startBlank.localizations ? startBlank.localizations.blankPageTitleHeadingPart2 : 'and Start Building'
    const startBlankContent = (
      <HfsPanelContent
        type={type}
        onClick={this.handleStartClick}
      />
    )

    return (
      <div className='vcv-start-blank-container' onMouseUp={this.handleMouseUp}>
        <div className='vcv-start-blank-scroll-container'>
          <div className='vcv-start-blank-inner'>
            <div className='vcv-start-blank-heading-container'>
              <div className='vcv-start-blank-page-heading'>{headingPart1}</div>
              <div className='vcv-start-blank-page-heading'>{headingPart2}</div>
            </div>
            {startBlankContent}
          </div>
        </div>
      </div>
    )
  }
}

import React from 'react'
import ReactDOM from 'react-dom'
import vcCake from 'vc-cake'
import HfsPanelContent from './lib/hsfPanelContent'
import PagePanelContent from './lib/pagePanelContent'
import PropTypes from 'prop-types'

const workspaceStorage = vcCake.getStorage('workspace')
const workspaceSettings = workspaceStorage.state('settings')
const settingsStorage = vcCake.getStorage('settings')

export default class startBlank extends React.Component {
  static propTypes = {
    unmountStartBlank: PropTypes.func.isRequired
  }

  constructor (props) {
    super(props)
    this.handleCloseClick = this.handleCloseClick.bind(this)
    this.handleMouseUp = this.handleMouseUp.bind(this)
    this.handlePageNameClick = this.handlePageNameClick.bind(this)
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

  handlePageNameClick (value) {
    if (vcCake.env('HFS_START_PAGE') && value) {
      settingsStorage.state('pageTitle').set(value)
    }
    this.handleCloseClick(true)
  }

  handleCloseClick (blank) {
    if (blank) {
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

  render () {
    const localizations = window.VCV_I18N && window.VCV_I18N()
    const buttonText = localizations ? localizations.premiumTemplatesButton : 'Go Premium'
    const helperText = localizations ? localizations.blankPageHelperText : 'Get a Premium license to access Visual Composer Hub. Download professionally designed templates, more content elements, extensions, and more.'
    let headingPart1
    let headingPart2

    let buttonUrl = window.VCV_UTM().feBlankPagePremiumTemplates
    if (vcCake.env('editor') === 'backend') {
      buttonUrl = window.VCV_UTM().beBlankPagePremiumTemplates
    }
    let premium = null
    if (typeof window.vcvIsPremium !== 'undefined' && !window.vcvIsPremium) {
      premium = (
        <div>
          <a href={buttonUrl} target='_blank' className='vcv-start-blank-button' disabled>{buttonText}</a>
          <p className='vcv-start-blank-helper'>{helperText}</p>
        </div>
      )
    }
    let startBlankContent
    if (vcCake.env('HFS_START_PAGE') && window.VCV_EDITOR_TYPE) {
      premium = null
      let type = window.VCV_EDITOR_TYPE()
      type = type.charAt(0).toUpperCase() + type.slice(1)
      headingPart1 = `${localizations ? localizations.blankPageTitleHeadingPart1 : 'Name Your '} ${type}`
      headingPart2 = localizations ? localizations.blankPageTitleHeadingPart2 : 'and Start Building'
      startBlankContent = (
        <HfsPanelContent
          type={type}
          addClick={this.handlePageNameClick}
          value={settingsStorage.state('pageTitle').get()}
        />
      )
    } else {
      headingPart1 = localizations ? localizations.blankPageHeadingPart1 : 'Select Blank Page'
      headingPart2 = localizations ? localizations.blankPageHeadingPart2 : 'or Start With a template'
      startBlankContent = (
        <PagePanelContent
          unmountStartBlank={this.props.unmountStartBlank}
          handleCloseClick={this.handleCloseClick}
        />
      )
    }

    return (
      <div className='vcv-start-blank-container' onMouseUp={this.handleMouseUp}>
        <div className='vcv-start-blank-scroll-container'>
          <div className='vcv-start-blank-inner'>
            <div className='vcv-start-blank-heading-container'>
              <div className='vcv-start-blank-page-heading'>{headingPart1}</div>
              <div className='vcv-start-blank-page-heading'>{headingPart2}</div>
            </div>
            {startBlankContent}
            {premium}
          </div>
        </div>
      </div>
    )
  }
}

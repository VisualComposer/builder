import React from 'react'
import vcCake from 'vc-cake'
import classNames from 'classnames'
import VCVLogo from './vcvLogo'
import VersionBox from './versionBox'
import Timeline from './timeline'
import { getResponse } from 'public/tools/response'

const dataProcessorService = vcCake.getService('dataProcessor')

export default class VideoScreen extends React.Component {
  static localizations = window.VCV_I18N && window.VCV_I18N()

  constructor (props) {
    super(props)
    this.state = {
      isLoading: false
    }
    this.activationContent = React.createRef()
    this.handleTakeTutorialClick = this.handleTakeTutorialClick.bind(this)
  }

  componentDidMount () {
    setTimeout(() => {
      this.activationContent.current && this.activationContent.current.classList.add('vcv-activation-content--active')
    }, 0)
  }

  getDoMoreText () {
    let doMoreWithVcText = VideoScreen.localizations ? VideoScreen.localizations.doMoreWithVcText : 'Do more with Visual Composer Hub'
    const hasManageOptions = window.VCV_MANAGE_OPTIONS && window.VCV_MANAGE_OPTIONS()
    if (!window.vcvIsAnyActivated) {
      doMoreWithVcText = `${doMoreWithVcText} - <a href="${window.vcvGoPremiumUrl}">free and premium</a>.`
    }

    if (window.vcvIsFreeActivated) {
      doMoreWithVcText = `${doMoreWithVcText} - <a href="${window.vcvGoPremiumUrl}">premium</a>.`
    }

    if (!window.vcvIsPremiumActivated && hasManageOptions) {
      return (
        <p className='vcv-activation-description' dangerouslySetInnerHTML={{ __html: doMoreWithVcText }} />
      )
    }
  }

  handleTakeTutorialClick (e) {
    if (window.VCV_TUTORIAL_PAGE_URL && window.VCV_TUTORIAL_PAGE_URL()) {
      return true
    } else if (this.state.isLoading) {
      e.preventDefault()
    } else {
      e.preventDefault()
      this.setState({ isLoading: true })
      dataProcessorService.appAdminServerRequest({
        'vcv-action': 'createTutorialPage:adminNonce',
      }).then((requestData) => {
        // This means everything is done and just need to redirect user
        const response = getResponse(requestData)
        if (response.status === true) {
          window.location.href = response.tutorialUrl
        }
      }, (error) => {
        this.setState({ isLoading: false })
        console.warn('Failed to get Tutorial Template URL', error)
      })
    }
  }

  render () {
    // TODO: add tutorial template button when it will be ready
    const createYourWordpressWebsite = VideoScreen.localizations ? VideoScreen.localizations.createYourWordpressWebsite : 'Create Your WordPress Website.'
    const anyLayoutFastAndEasy = VideoScreen.localizations ? VideoScreen.localizations.anyLayoutFastAndEasy : 'Any Layout. Fast and Easy.'
    const buildYourSiteWithDragAndDropText = VideoScreen.localizations ? VideoScreen.localizations.buildYourSiteWithDragAndDrop : 'Build your site with the help of drag and drop editor straight from the frontend - it\'s that easy.'
    const createNewText = VideoScreen.localizations ? VideoScreen.localizations.createNewPage : 'Create a new page'
    const takeTutorialText = VideoScreen.localizations ? VideoScreen.localizations.takeTutorialTemplate : 'Take Tutorial Template'
    const downloadingText = VideoScreen.localizations ? VideoScreen.localizations.downloading : 'Downloading'

    let createNewButton = null
    let takeTutorialButton = null

    if (window.VCV_CREATE_NEW_URL && window.VCV_CREATE_NEW_URL()) {
      createNewButton = (
        <a href={window.VCV_CREATE_NEW_URL() || ''} className='vcv-activation-button'>{createNewText}</a>
      )
    }

    const takeTutorialButtonClasses = classNames({
      'vcv-activation-button': true,
      'vcv-activation-button--dark': true,
      'vcv-activation-loading-text--animation': this.state.isLoading
    })
    takeTutorialButton = (
      <a href={(window.VCV_TUTORIAL_PAGE_URL && window.VCV_TUTORIAL_PAGE_URL()) || ''} className={takeTutorialButtonClasses} onClick={this.handleTakeTutorialClick}>{takeTutorialText}</a>
    )
    
    return (
      <div className='vcv-activation-content' ref={this.activationContent}>
        <VCVLogo />
        <VersionBox />
        <Timeline />
        <p className='vcv-activation-heading'>
          {createYourWordpressWebsite}
          <br />
          {anyLayoutFastAndEasy}
        </p>
        <p className='vcv-activation-description'>
          {buildYourSiteWithDragAndDropText}
        </p>
        <div className='vcv-activation-video-container'>
          <div className='vcv-activation-video'>
            <iframe
              className='vcv-activation-video-iframe'
              src='https://www.youtube.com/embed/ughXiLqxhxc?rel=0'
              frameBorder='0'
            />
          </div>
        </div>
        <div className='vcv-activation-button-container'>
          {createNewButton}
          {takeTutorialButton}
        </div>
        {this.getDoMoreText()}
      </div>
    )
  }
}

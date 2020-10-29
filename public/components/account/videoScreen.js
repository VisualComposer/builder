import React from 'react'
import vcCake from 'vc-cake'
import classNames from 'classnames'
import VCVLogo from './vcvLogo'
import VersionBox from './versionBox'
import Timeline from './timeline'
import { getResponse } from 'public/tools/response'

const dataProcessorService = vcCake.getService('dataProcessor')
const dataManager = vcCake.getService('dataManager')

export default class VideoScreen extends React.Component {
  static localizations = dataManager.get('localizations')

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
    let doMoreWithVcText = VideoScreen.localizations ? VideoScreen.localizations.doMoreWithVcText : 'Do more with the Visual Composer Hub'
    const hasManageOptions = dataManager.get('manageOptions')
    if (!dataManager.get('vcvIsAnyActivated')) {
      doMoreWithVcText = `${doMoreWithVcText} - <a href="${dataManager.get('vcvGoPremiumUrl')}">free and premium</a>.`
    }

    if (dataManager.get('vcvIsFreeActivated')) {
      doMoreWithVcText = `${doMoreWithVcText} - <a href="${dataManager.get('vcvGoPremiumUrl')}">premium</a>.`
    }

    if (!dataManager.get('vcvIsPremiumActivated') && hasManageOptions) {
      return (
        <p className='vcv-activation-description' dangerouslySetInnerHTML={{ __html: doMoreWithVcText }} />
      )
    }
  }

  handleTakeTutorialClick (e) {
    if (dataManager.get('tutorialPageUrl')) {
      return true
    } else if (this.state.isLoading) {
      e.preventDefault()
    } else {
      e.preventDefault()
      this.setState({ isLoading: true })
      dataProcessorService.appAdminServerRequest({
        'vcv-action': 'editors:tutorial:create:adminNonce'
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
    const createYourWordpressWebsite = VideoScreen.localizations ? VideoScreen.localizations.createYourWordpressWebsite : 'Create Your WordPress Website.'
    const anyLayoutFastAndEasy = VideoScreen.localizations ? VideoScreen.localizations.anyLayoutFastAndEasy : 'Any Layout. Fast and Easy.'
    const buildYourSiteWithDragAndDropText = VideoScreen.localizations ? VideoScreen.localizations.buildYourSiteWithDragAndDrop : 'Build your site with the help of the drag and drop builder straight from the frontend editor - it\'s that easy.'
    const createNewText = VideoScreen.localizations ? VideoScreen.localizations.createNewPage : 'Create a new page'
    const takeTutorialText = VideoScreen.localizations ? VideoScreen.localizations.takeTutorialTemplate : 'Try The Tutorial Template'

    let createNewButton = null
    let takeTutorialButton = null

    if (dataManager.get('createNewUrl')) {
      createNewButton = (
        <a href={dataManager.get('createNewUrl') || ''} className='vcv-activation-button'>{createNewText}</a>
      )
    }

    if (dataManager.get('manageOptions')) {
      const takeTutorialButtonClasses = classNames({
        'vcv-activation-button': true,
        'vcv-activation-button--dark': true,
        'vcv-activation-button--loading': this.state.isLoading
      })
      takeTutorialButton = (
        <a href={dataManager.get('tutorialPageUrl') || ''} className={takeTutorialButtonClasses} onClick={this.handleTakeTutorialClick}>{takeTutorialText}</a>
      )
    }

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

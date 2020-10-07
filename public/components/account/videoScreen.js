import React from 'react'
import VCVLogo from './vcvLogo'
import VersionBox from './versionBox'
import Timeline from './timeline'

export default class VideoScreen extends React.Component {
  static localizations = window.VCV_I18N && window.VCV_I18N()

  constructor (props) {
    super(props)
    this.activationContent = React.createRef()
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
      doMoreWithVcText = `${doMoreWithVcText} - <a href="${window.vcvGoPremiumUrl}">free and premium.</a>`
    }

    if (window.vcvIsFreeActivated) {
      doMoreWithVcText = `${doMoreWithVcText} - <a href="${window.vcvGoPremiumUrl}">premium.</a>`
    }

    if (!window.vcvIsPremiumActivated && hasManageOptions) {
      return (
        <p className='vcv-activation-description' dangerouslySetInnerHTML={{ __html: doMoreWithVcText }} />
      )
    }
  }

  render () {
    const takeTutorialText = VideoScreen.localizations ? VideoScreen.localizations.takeTutorialTemplate : 'Take Tutorial Template'
    const createYourWordpressWebsite = VideoScreen.localizations ? VideoScreen.localizations.createYourWordpressWebsite : 'Create Your WordPress Website.'
    const anyLayoutFastAndEasy = VideoScreen.localizations ? VideoScreen.localizations.anyLayoutFastAndEasy : 'Any Layout. Fast and Easy.'
    const buildYourSiteWithDragAndDropText = VideoScreen.localizations ? VideoScreen.localizations.buildYourSiteWithDragAndDrop : 'Build your site with the help of drag and drop editor straight from the frontend - it’s that easy.'

    let createNewButton = null
    if (window.VCV_CREATE_NEW_URL && window.VCV_CREATE_NEW_URL()) {
      createNewButton = (
        <a href={window.VCV_CREATE_NEW_URL()} className='vcv-activation-button'>{window.VCV_CREATE_NEW_TEXT()}</a>
      )
    }
    const tutorialTemplateLink = 'link' // TODO: add tutorial template link later
    const takeTutorialButton = (
      <a
        href={tutorialTemplateLink} target='_blank' rel='noopener noreferrer'
        className='vcv-activation-button vcv-activation-button--dark'
      >
        {takeTutorialText}
      </a>
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
          {takeTutorialButton}
          {createNewButton}
        </div>

        {this.getDoMoreText()}
      </div>
    )
  }
}

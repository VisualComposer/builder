import React from 'react'
import VCVLogo from './vcvLogo'
import VersionBox from './versionBox'
import Timeline from './timeline'
import ShareButtons from './shareButtons'

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

  render () {
    const upgradeToPremiumText = VideoScreen.localizations ? VideoScreen.localizations.upgradeToPremium : 'Upgrade To Premium'
    const createYourWordpressWebsite = VideoScreen.localizations ? VideoScreen.localizations.createYourWordpressWebsite : 'Create Your WordPress Website.'
    const anyLayoutFastAndEasy = VideoScreen.localizations ? VideoScreen.localizations.anyLayoutFastAndEasy : 'Any Layout. Fast and Easy.'
    const buildYourSiteWithDragAndDropText = VideoScreen.localizations ? VideoScreen.localizations.buildYourSiteWithDragAndDrop : 'Build your site with the help of drag and drop editor straight from the frontend - it’s that easy.'

    let createNewButton = null
    if (window.VCV_CREATE_NEW_URL && window.VCV_CREATE_NEW_URL()) {
      createNewButton = (
        <a href={window.VCV_CREATE_NEW_URL()} className='vcv-activation-button'>{window.VCV_CREATE_NEW_TEXT()}</a>
      )
    }
    let upgradeButton = null
    const upgradeLink = window.VCV_UPGRADE_TO_PREMIUM && window.VCV_UPGRADE_TO_PREMIUM()
    if (this.props.licenseType === 'free' && upgradeLink) {
      upgradeButton = (
        <a href={upgradeLink} target='_blank' rel='noopener noreferrer' className='vcv-activation-button vcv-activation-button--dark'>
          {upgradeToPremiumText}
        </a>
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
          {upgradeButton}
        </div>

        <ShareButtons />
      </div>
    )
  }
}

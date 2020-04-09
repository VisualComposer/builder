import React from 'react'
import VCVLogo from './vcvLogo'
import VersionBox from './versionBox'
import Timeline from './timeline'
import ShareButtons from './shareButtons'

export default class VideoScreen extends React.Component {
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
    let createNewButton = null
    if (window.VCV_CREATE_NEW_URL && window.VCV_CREATE_NEW_URL()) {
      createNewButton = (
        <a href={window.VCV_CREATE_NEW_URL()} className='vcv-activation-button'>{window.VCV_CREATE_NEW_TEXT()}</a>
      )
    }
    let upgradeButton = null
    if (this.props.licenseType === 'free') {
      upgradeButton = (
        <a href='#' className='vcv-activation-button vcv-activation-button--dark'>Upgrade to premium</a>
      )
    }

    const localizations = window.VCV_I18N && window.VCV_I18N()
    const createYourWordpressWebsite = localizations ? localizations.createYourWordpressWebsite : 'Create Your WordPress Website.'
    const anyLayoutFastAndEasy = localizations ? localizations.anyLayoutFastAndEasy : 'Any Layout. Fast and Easy.'

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
          Build your site with the help of drag and drop editor straight from the frontend - it’s that easy.
        </p>

        <div className='vcv-activation-video-container'>
          <div className='vcv-activation-video'>
            <iframe
              className='vcv-activation-video-iframe'
              src='https://www.youtube.com/embed/bqvF_W2Xnxc'
              frameBorder="0"
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

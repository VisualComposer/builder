import React from 'react'
import LoadingOverlayComponent from 'public/components/overlays/loadingOverlay/loadingOverlayComponent'
import { getStorage } from 'vc-cake'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import classNames from 'classnames'

const workspaceStorage = getStorage('workspace')
const workspaceNotifications = workspaceStorage.state('notifications')
const hubAddonsStorage = getStorage('hubAddons')
const migrationStorage = getStorage('migration')

export default class PopupComponent extends React.Component {
  static propTypes = {
    parent: PropTypes.string,
    hideLayoutBar: PropTypes.bool,
    disableNavBar: PropTypes.bool
  }

  state = {
    elementState: ''
  }

  constructor (props) {
    super(props)
    this.el = document.createElement('div')
    this.downloadingItemOnChange = this.downloadingItemOnChange.bind(this)
  }

  componentDidMount () {
    const modalRoot = document.querySelector(this.props.parent || '.vcv-layout-iframe-container')
    modalRoot.appendChild(this.el)
    this.el.classList.add('vcv-migration-notice-container')
    if (this.props.disableNavBar) {
      let layoutHeader = document.getElementById('vcv-layout-header')
      layoutHeader.style.pointerEvents = 'none'
    }
    if (this.props.hideLayoutBar) {
      document.body.classList.add('vcv-loading-overlay--enabled')
    }
  }

  componentWillUnmount () {
    const modalRoot = document.querySelector(this.props.parent || '.vcv-layout-iframe-container')
    modalRoot.removeChild(this.el)
    this.el.classList.remove('vcv-migration-notice-container')
    if (this.props.disableNavBar) {
      let layoutHeader = document.getElementById('vcv-layout-header')
      layoutHeader.style.pointerEvents = ''
    }
    if (this.props.hideLayoutBar) {
      document.body.classList.remove('vcv-loading-overlay--enabled')
    }
  }

  downloadingItemOnChange (data) {
    // Check is the download finished
    if (!data.includes('wpbMigration')) {
      workspaceStorage.state('downloadingItems').ignoreChange(this.downloadingItemOnChange)
      window.onbeforeunload = null
      window.location.reload()
    }
  }

  clickBackToWordpress (e) {
    window.location.href = window.vcvPostData.backendEditorUrl
  }

  clickDownloadAddon (e) {
    if (this.state.elementState === 'downloading') {
      return
    }
    const addon = window.VCV_HUB_GET_ADDON_TEASER().find((a) => a.tag === 'wpbMigration')
    const localizations = window.VCV_I18N && window.VCV_I18N()
    if (!addon || addon.update || !addon.allowDownload) {
      workspaceNotifications.set({
        type: 'error',
        text: localizations && localizations.addonWpbMigration_download_update_required ? localizations.addonWpbMigration_download_update_required : 'Update Visual Composer plugin to the most recent version to download addon.',
        showCloseButton: 'true',
        icon: 'vcv-ui-icon vcv-ui-icon-error',
        time: 5000
      })
      this.setState({ elementState: 'failed' })
    } else {
      this.setState({ elementState: 'downloading' })
      workspaceStorage.state('downloadingItems').onChange(this.downloadingItemOnChange)
      hubAddonsStorage.trigger('downloadAddon', addon)
    }
  }

  render () {
    const localizations = window.VCV_I18N && window.VCV_I18N()
    if (this.state.elementState === 'downloading') {
      return <LoadingOverlayComponent />
    }

    let buttonHtml = (
      <button className='vcv-migration-button vcv-migration-button--start' onClick={this.clickDownloadAddon.bind(this)}>{localizations.addonWpbMigration_download_button}</button>
    )
    const hasAddon = window.VCV_HUB_GET_ADDONS().hasOwnProperty('wpbMigration')
    const hasWpb = window.VCV_WPBAKERY_ACTIVE && window.VCV_WPBAKERY_ACTIVE()
    if (hasAddon) {
      // addons exists but no WPB activated
      buttonHtml = null
    }

    let firstCheckClasses = {
      'vcv-ui-icon': true,
      'vcv-ui-icon-save': hasAddon,
      'vcv-ui-icon-close-thin': !hasAddon,
      'vcv-ui-state--success': hasAddon,
      'vcv-ui-state--error': !hasAddon
    }

    let secondCheckClasses = {
      'vcv-ui-icon': true,
      'vcv-ui-icon-save': hasWpb,
      'vcv-ui-icon-close-thin': !hasWpb,
      'vcv-ui-state--success': hasWpb,
      'vcv-ui-state--error': !hasWpb
    }

    return ReactDOM.createPortal(
      <div className='vcv-migration-notice'>
        <img className='vcv-migration-image' src={migrationStorage.state('icon').get()} alt='Migrate' />
        <h1 className='vcv-migration-title'>{localizations.addonWpbMigration_title}</h1>
        <p className='vcv-migration-description'>{localizations.addonWpbMigration_intro}</p>
        <div className='vcv-migration-notes'>
          <div className='vcv-migration-note'>
            <i className={classNames(firstCheckClasses)} />
            <p className='vcv-migration-description'>{localizations.addonWpbMigration_checkAddon}</p>
          </div>
          <div className='vcv-migration-note'>
            <i className={classNames(secondCheckClasses)} />
            <p className='vcv-migration-description'>{localizations.addonWpbMigration_checkWpb}</p>
          </div>
        </div>
        <p className='vcv-migration-description vcv-migration-description--emphasized'>{localizations.addonWpbMigration_note}</p>
        {buttonHtml}
        <button className='vcv-migration-button vcv-migration-button--back' onClick={this.clickBackToWordpress.bind(this)}>{localizations.addonWpbMigration_backToWordpress}</button>
      </div>,
      this.el
    )
  }
}

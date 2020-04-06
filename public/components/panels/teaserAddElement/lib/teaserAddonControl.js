import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

export default class TeaserAddonControl extends React.Component {
  static propTypes = {
    element: PropTypes.object.isRequired,
    elementState: PropTypes.string.isRequired,
    showLoading: PropTypes.bool.isRequired,
    name: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired
  }

  render () {
    const { element, elementState, onClick, showLoading, name } = this.props
    const localizations = window.VCV_I18N && window.VCV_I18N()
    const downloadAddonText = localizations.downloadAddonText || 'Download Addon'
    const addonInstalledText = localizations.installedText || 'Installed'
    const availableInPremiumText = localizations.availableInPremiumText || 'Available in Premium'
    const isAddonLocked = (!element.allowDownload && elementState === 'inactive') || !window.vcvIsAnyActivated
    let buttonText

    if (elementState === 'success') {
      buttonText = addonInstalledText
    } else if (isAddonLocked) {
      buttonText = availableInPremiumText
    } else if (elementState === 'inactive' || elementState === 'failed') {
      buttonText = downloadAddonText
    }

    const buttonClasses = classNames({
      'vcv-hub-addon-control': true,
      'vcv-hub-addon-control--locked': elementState === 'success'
    })

    let addonControl = <button className={buttonClasses} onClick={onClick}>{buttonText}</button>

    if (elementState === 'downloading' || showLoading) {
      addonControl = <span className='vcv-ui-icon vcv-ui-wp-spinner' />
    }

    return (
      <li className='vcv-ui-item-list-item'>
        <div className='vcv-hub-addon-item-container'>
          <img className='vcv-hub-addon-image' src={element.metaAddonImageUrl} alt={name} />
          <div className='vcv-hub-addon-item-content-container'>
            <h3 className='vcv-hub-addon-name'>{name}</h3>
            <p className='vcv-hub-addon-description'>{element.metaDescription}</p>
            {addonControl}
          </div>
        </div>
      </li>
    )
  }
}

import React from 'react'
import PopupInner from '../popupInner'
import { getService } from 'vc-cake'
const dataManager = getService('dataManager')
const dataProcessor = getService('dataProcessor')

export default class DataCollectionPopup extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      isChecked: false
    }

    this.handleChange = this.handleChange.bind(this)
    this.handlePrimaryButtonClick = this.handlePrimaryButtonClick.bind(this)
    this.handleCloseClick = this.handleCloseClick.bind(this)
  }

  handleChange () {
    this.setState({ isChecked: !this.state.isChecked })
  }

  handlePrimaryButtonClick () {
    const checkedInput = document.querySelector('#vcv-layout-popup-data-collection:checked')
    if (!checkedInput) {
      return
    }
    dataProcessor.appAdminServerRequest({
      'vcv-action': 'dataCollection:submit:adminNonce',
      'vcv-dataCollection': true
    })

    dataManager.set('dataCollectionEnabled', true)

    this.props.onPrimaryButtonClick()
  }

  handleCloseClick () {
    dataProcessor.appAdminServerRequest({
      'vcv-action': 'dataCollection:submit:adminNonce',
      'vcv-dataCollection': false
    })

    this.props.onClose()
  }

  render () {
    const localizations = dataManager.get('localizations')
    const headingText = localizations ? localizations.dataCollectionHeadingText : 'Share Usage Data'
    const text = localizations ? localizations.dataCollectionText : 'Help to make Visual Composer better by sharing anonymous usage data. We appreciate your help.'
    const readMoreText = localizations ? localizations.readMoreText : 'Read more'
    const dashboardUrl = `${window.vcvSettingsDashboardUrl}#vcv-ui-settings-data-collection-table`
    const confirmText = localizations ? localizations.dataCollectionToggleText : 'Share anonymous data'

    const customButtonProps = {
      disabled: !this.state.isChecked
    }

    return (
      <PopupInner
        {...this.props}
        headingText={headingText}
        popupName='dataCollectionPopup'
        customButtonProps={customButtonProps}
        customButtonTag='button'
        onPrimaryButtonClick={this.handlePrimaryButtonClick}
        onClose={this.handleCloseClick}
      >
        <p className='vcv-layout-popup-text'>{text} <a className='vcv-layout-popup-text--anchor' target='_blank' rel='noopener noreferrer' href={dashboardUrl}>{readMoreText}</a></p>
        <div className='vcv-layout-popup-checkbox-option-wrapper'>
          <input
            type='checkbox'
            id='vcv-layout-popup-data-collection'
            className='vcv-layout-popup-checkbox'
            name='vcv-data-collection'
            checked={this.state.isChecked}
            onChange={this.handleChange}
          />
          <label htmlFor='vcv-layout-popup-data-collection' className='vcv-layout-popup-checkbox-label'>
            {confirmText}
          </label>
        </div>
      </PopupInner>
    )
  }
}

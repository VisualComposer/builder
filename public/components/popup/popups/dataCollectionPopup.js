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

    dataManager.set('dataCollectionEnabled', () => { return true })

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
    const headingText = localizations ? localizations.dataCollectionHeadingText : 'Help us make Visual Composer better'
    const text = localizations ? localizations.dataCollectionText : 'Help us to improve the plugin by sharing anonymous data about Visual Composer usage. We appreciate your help!'
    const confirmText = localizations ? localizations.yesIWouldLikeToHelpText : 'Yes, I would like to help'

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
        <p className='vcv-layout-popup-text'>{text}</p>
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

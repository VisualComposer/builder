import React from 'react'
import classNames from 'classnames'
import { getStorage, getService } from 'vc-cake'
import PremiumTeaser from 'public/components/premiumTeasers/component'

const editorPopupStorage = getStorage('editorPopup')
const dataManager = getService('dataManager')

export default class FullPagePopupContainer extends React.Component {
  constructor (props) {
    super(props)

    const activePopup = editorPopupStorage.state('activeFullPopup').get()

    this.state = {
      popupVisible: false,
      activePopup: activePopup
    }

    this.handleCloseClick = this.handleCloseClick.bind(this)
    this.handlePrimaryButtonClick = this.handlePrimaryButtonClick.bind(this)
    this.handlePopupChange = this.handlePopupChange.bind(this)
    this.handleOutsideClick = this.handleOutsideClick.bind(this)
  }

  componentDidMount () {
    editorPopupStorage.state('activeFullPopup').onChange(this.handlePopupChange)
  }

  componentWillUnmount () {
    editorPopupStorage.state('activeFullPopup').ignoreChange(this.handlePopupChange)
  }

  handlePopupChange (activePopup) {
    this.setState({
      activePopup: activePopup,
      popupVisible: !!activePopup
    })
  }

  handleCloseClick () {
    this.setState({ popupVisible: false })
    window.setTimeout(() => {
      editorPopupStorage.state('activeFullPopup').set(false)
    }, 350)
  }

  handlePrimaryButtonClick () {
    const popupData = editorPopupStorage.state('fullScreenPopupData').get() || {}
    popupData.primaryButtonClick && popupData.primaryButtonClick()
  }

  handleOutsideClick (event) {
    if (event.target.classList.contains('vcv-layout-popup--full-page')) {
      this.handleCloseClick()
    }
  }

  render () {
    const { activePopup, popupVisible } = this.state
    const popupClasses = classNames({
      'vcv-layout-popup': true,
      'vcv-layout-popup--full-page': true,
      'vcv-layout-popup--visible': popupVisible
    })
    const popupData = editorPopupStorage.state('fullScreenPopupData').get() || {}

    const popupProps = {
      onClose: this.handleCloseClick,
      onPrimaryButtonClick: this.handlePrimaryButtonClick,
      isPremiumActivated: dataManager.get('isPremiumActivated'),
      ...popupData
    }
    let activePopupHtml = null

    if (activePopup === 'premium-teaser') {
      activePopupHtml = <PremiumTeaser {...popupProps} />
    }

    return (
      <div className={popupClasses} onClick={this.handleOutsideClick}>
        <div className='vcv-layout-popup-container'>
          {activePopupHtml}
        </div>
      </div>
    )
  }
}

import React from 'react'
import classNames from 'classnames'
import { getStorage } from 'vc-cake'
import PremiumPopup from './popups/premiumPopup'

const editorPopupStorage = getStorage('editorPopup')
const elementsStorage = getStorage('elements')

export default class PopupContainer extends React.Component {
  constructor (props) {
    super(props)

    const activePopup = editorPopupStorage.state('activeFullPopup').get()

    this.state = {
      actionClicked: false,
      popupVisible: false,
      activePopup: activePopup
    }

    this.handleCloseClick = this.handleCloseClick.bind(this)
    this.handlePrimaryButtonClick = this.handlePrimaryButtonClick.bind(this)
    this.handleDocumentChange = this.handleDocumentChange.bind(this)
    this.handlePopupChange = this.handlePopupChange.bind(this)
    this.handleOutsideClick = this.handleOutsideClick.bind(this)
  }

  componentDidMount () {
    elementsStorage.state('document').onChange(this.handleDocumentChange)
    editorPopupStorage.state('activeFullPopup').onChange(this.handlePopupChange)
  }

  componentWillUnmount () {
    elementsStorage.state('document').ignoreChange(this.handleDocumentChange)
    editorPopupStorage.state('activeFullPopup').onChange(this.handlePopupChange)
  }

  handleDocumentChange (data) {
    if (data && data.length) {
      window.setTimeout(() => {
        this.setState({
          popupVisible: !!this.state.activePopup
        })
        elementsStorage.state('document').ignoreChange(this.handleDocumentChange)
      }, 500)
    }
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
      editorPopupStorage.trigger('hideFullPagePopup', this.state.activePopup)
    }, 500)
  }

  handlePrimaryButtonClick () {
    this.setState({ actionClicked: true })
    window.setTimeout(() => {
      this.setState({
        actionClicked: false,
        popupVisible: false
      })
      editorPopupStorage.trigger('hideFullPagePopup', this.state.activePopup)
    }, 500)
  }

  handleOutsideClick (event) {
    if (event.target.classList.contains('vcv-layout-popup--full-page')) {
      this.handleCloseClick()
    }
  }

  render () {
    const { activePopup, actionClicked, popupVisible } = this.state
    const popupText = editorPopupStorage.state('popupText').get()
    const popupClasses = classNames({
      'vcv-layout-popup': true,
      'vcv-layout-popup--full-page': true,
      'vcv-layout-popup--visible': popupVisible,
      'vcv-layout-popup--action-clicked': actionClicked
    })

    const popupProps = {
      onClose: this.handleCloseClick,
      onPrimaryButtonClick: this.handlePrimaryButtonClick,
      text: popupText
    }
    let activePopupHtml = null

    if (activePopup === 'premiumPopup') {
      activePopupHtml = <PremiumPopup {...popupProps} />
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

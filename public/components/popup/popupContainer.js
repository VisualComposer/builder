import React from 'react'
import classNames from 'classnames'
import { getStorage } from 'vc-cake'
import VotePopup from './popups/votePopup'
import ReviewPopup from './popups/reviewPopup'
import DataCollectionPopup from './popups/dataCollectionPopup'

const editorPopupStorage = getStorage('editorPopup')
const elementsStorage = getStorage('elements')

export default class PopupContainer extends React.Component {
  constructor (props) {
    super(props)

    const activePopup = editorPopupStorage.state('activePopup').get()

    this.state = {
      actionClicked: false,
      popupVisible: false,
      activePopup: activePopup
    }

    this.handleCloseClick = this.handleCloseClick.bind(this)
    this.handlePrimaryButtonClick = this.handlePrimaryButtonClick.bind(this)
    this.handleDocumentChange = this.handleDocumentChange.bind(this)
    this.handlePopupChange = this.handlePopupChange.bind(this)
  }

  componentDidMount () {
    elementsStorage.state('document').onChange(this.handleDocumentChange)
    editorPopupStorage.state('activePopup').onChange(this.handlePopupChange)
  }

  componentWillUnmount () {
    elementsStorage.state('document').ignoreChange(this.handleDocumentChange)
    editorPopupStorage.state('activePopup').onChange(this.handlePopupChange)
  }

  handleDocumentChange (data) {
    if (data && data.length) {
      window.setTimeout(() => {
        this.setState({
          popupVisible: !!this.state.activePopup
        })
        elementsStorage.state('document').ignoreChange(this.handleDocumentChange)
      }, 1000)
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
      editorPopupStorage.trigger('hidePopup', this.state.activePopup)
    }, 1000)
  }

  handlePrimaryButtonClick () {
    this.setState({ actionClicked: true })
    window.setTimeout(() => {
      this.setState({
        actionClicked: false,
        popupVisible: false
      })
      editorPopupStorage.trigger('hidePopup', this.state.activePopup)
    }, 1000)
  }

  render () {
    const { activePopup, actionClicked, popupVisible } = this.state
    const popupClasses = classNames({
      'vcv-layout-popup': true,
      'vcv-layout-popup--visible': popupVisible,
      'vcv-layout-popup--action-clicked': actionClicked
    })

    const popupProps = {
      onClose: this.handleCloseClick,
      onPrimaryButtonClick: this.handlePrimaryButtonClick
    }
    let activePopupHtml = null

    if (activePopup === 'votePopup') {
      activePopupHtml = <VotePopup {...popupProps} />
    } else if (activePopup === 'reviewPopup') {
      activePopupHtml = <ReviewPopup {...popupProps} />
    } else if (activePopup === 'dataCollectionPopup') {
      activePopupHtml = <DataCollectionPopup {...popupProps} />
    }

    return (
      <div className={popupClasses}>
        <div className='vcv-layout-popup-container'>
          {activePopupHtml}
        </div>
      </div>
    )
  }
}

import React from 'react'
import { Dispatch } from 'redux' // eslint-disable-line
import PopupInner from '../popupInner'
import { getService } from 'vc-cake'
import { connect } from 'react-redux'
import { popupShown, popupsSet, popupVisibilitySet } from '../../../editor/stores/editorPopup/slice'
import { Popups, VotePopupProps } from '../types'
import { AppStateType } from '../../../editor/stores/reducer'

const dataManager = getService('dataManager')
const dataProcessor = getService('dataProcessor')
const localizations = dataManager.get('localizations')
const headingText = localizations ? localizations.feedbackVoteHeadingText : 'How likely are you to recommend Visual Composer to friend or colleague?'
const buttonText = localizations ? localizations.feedbackVoteButtonText : 'Submit Your Feedback'
// const veryDisappointed = localizations ? localizations.veryDisappointed : 'Not likely at all'
// const extremelyLikely = localizations ? localizations.somewhatDisappointed : 'Extremely likely'

const VotePopup = ({ popups, popupsSet, popupVisibilitySet, popupShown, onPrimaryButtonClick, onClose }: VotePopupProps) => {
  const handlePrimaryButtonClick = () => {
    const checkedInput: HTMLInputElement | null = document.querySelector('input.vcv-layout-popup-checkbox:checked')
    if (!checkedInput) {
      return
    }

    dataProcessor.appAdminServerRequest({
      'vcv-action': 'license:feedback:submit:adminNonce',
      'vcv-feedback': checkedInput.value
    })

    // Set vote value in storage so we can use it in the review popup
    const popupState = JSON.parse(JSON.stringify(popups)) || {}
    Object.preventExtensions(popupState)
    if (popupState.votePopup) {
      popupState.votePopup.voteValue = checkedInput.value
    }
    popupsSet(popupState)

    // Show review popup
    const visibilityTimeout = setTimeout(() => {
      popupVisibilitySet(true)
      popupShown('reviewPopup')

      window.clearTimeout(visibilityTimeout)
    }, 2000)

    onPrimaryButtonClick()
  }

  const handleCloseClick = () => {
    // Do not show popup again
    dataProcessor.appAdminServerRequest({
      'vcv-action': 'license:feedback:submit:adminNonce',
      'vcv-feedback': 'skip'
    })
    onClose()
  }

  return (
    <PopupInner
      headingText={headingText}
      buttonText={buttonText}
      onPrimaryButtonClick={handlePrimaryButtonClick}
      onClose={handleCloseClick}
      popupName='votePopup'
    >
      <div className='vcv-layout-popup-checkbox-option-wrapper'>
        <input type='radio' className='vcv-layout-popup-checkbox' name='vcv-feedback' value='1' />
        <label htmlFor='vcv-feedback-vote-very-disappointed' className='vcv-layout-popup-checkbox-label'>
          1
        </label>
      </div>
      <div className='vcv-layout-popup-checkbox-option-wrapper'>
        <input type='radio' className='vcv-layout-popup-checkbox' name='vcv-feedback' value='2' />
        <label htmlFor='vcv-feedback-vote-somewhat-disappointed' className='vcv-layout-popup-checkbox-label'>
          2
        </label>
      </div>
      <div className='vcv-layout-popup-checkbox-option-wrapper'>
        <input type='radio' className='vcv-layout-popup-checkbox' name='vcv-feedback' value='3' />
        <label htmlFor='vcv-feedback-vote-not-disappointed' className='vcv-layout-popup-checkbox-label'>
          3
        </label>
      </div>
      <div className='vcv-layout-popup-checkbox-option-wrapper'>
        <input type='radio' className='vcv-layout-popup-checkbox' name='vcv-feedback' value='4' />
        <label htmlFor='vcv-feedback-vote-not-disappointed' className='vcv-layout-popup-checkbox-label'>
          4
        </label>
      </div>
      <div className='vcv-layout-popup-checkbox-option-wrapper'>
        <input type='radio' className='vcv-layout-popup-checkbox' name='vcv-feedback' value='5' />
        <label htmlFor='vcv-feedback-vote-not-disappointed' className='vcv-layout-popup-checkbox-label'>
          5
        </label>
      </div>
      <div className='vcv-layout-popup-checkbox-option-wrapper'>
        <input type='radio' className='vcv-layout-popup-checkbox' name='vcv-feedback' value='6' />
        <label htmlFor='vcv-feedback-vote-not-disappointed' className='vcv-layout-popup-checkbox-label'>
          6
        </label>
      </div>
      <div className='vcv-layout-popup-checkbox-option-wrapper'>
        <input type='radio' className='vcv-layout-popup-checkbox' name='vcv-feedback' value='7' />
        <label htmlFor='vcv-feedback-vote-not-disappointed' className='vcv-layout-popup-checkbox-label'>
          7
        </label>
      </div>
      <div className='vcv-layout-popup-checkbox-option-wrapper'>
        <input type='radio' className='vcv-layout-popup-checkbox' name='vcv-feedback' value='8' />
        <label htmlFor='vcv-feedback-vote-not-disappointed' className='vcv-layout-popup-checkbox-label'>
          8
        </label>
      </div>
      <div className='vcv-layout-popup-checkbox-option-wrapper'>
        <input type='radio' className='vcv-layout-popup-checkbox' name='vcv-feedback' value='9' />
        <label htmlFor='vcv-feedback-vote-not-disappointed' className='vcv-layout-popup-checkbox-label'>
          9
        </label>
      </div>
      <div className='vcv-layout-popup-checkbox-option-wrapper'>
        <input type='radio' className='vcv-layout-popup-checkbox' name='vcv-feedback' value='10' />
        <label htmlFor='vcv-feedback-vote-not-disappointed' className='vcv-layout-popup-checkbox-label'>
          10
        </label>
      </div>
    </PopupInner>
  )
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  popupShown: (data: string) => dispatch(popupShown(data)),
  popupsSet: (data: Popups) => dispatch(popupsSet(data)), // eslint-disable-line
  popupVisibilitySet: (data:boolean) => dispatch(popupVisibilitySet(data))
})

const mapStateToProps = (state:AppStateType) => ({
  popups: state.editorPopup.popups
})

export default connect(mapStateToProps, mapDispatchToProps)(VotePopup)

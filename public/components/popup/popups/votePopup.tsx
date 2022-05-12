import React from 'react'
import { Dispatch } from 'redux' // eslint-disable-line
import PopupInner from '../popupInner'
import { getService } from 'vc-cake'
import { connect } from 'react-redux'
import {popupShown, popupsSet, Popups, popupVisibilitySet} from '../../../editor/stores/editorPopup/slice'
import { AppStateType } from '../../../editor/stores/reducer'

const dataManager = getService('dataManager')
const dataProcessor = getService('dataProcessor')
const localizations = dataManager.get('localizations')
const headingText = localizations ? localizations.feedbackVoteHeadingText : 'How disappointed would you be if this product no longer existed tomorrow?'
const buttonText = localizations ? localizations.feedbackVoteButtonText : 'Submit Your Feedback'
const veryDisappointed = localizations ? localizations.veryDisappointed : 'Very disappointed'
const somewhatDisappointed = localizations ? localizations.somewhatDisappointed : 'Somewhat disappointed'
const disappointed = localizations ? localizations.disappointed : 'Not disappointed (it really isn’t that useful)'

type Props = {
  popups: Popups,
  onPrimaryButtonClick: () => void,
  onClose: () => void,
  popupShown: any,
  popupsSet: any,
  popupVisibilitySet: (status: boolean) => void
}

const VotePopup: React.FC<Props> = (props) => {
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
    const popupState = JSON.parse(JSON.stringify(props.popups)) || {}
    Object.preventExtensions(popupState)
    if (popupState.votePopup) {
      popupState.votePopup.voteValue = checkedInput.value
    }
    props.popupsSet(popupState)

    // Show review popup
    const visibilityTimeout = setTimeout(() => {
      props.popupVisibilitySet(true)
      props.popupShown('reviewPopup')

      window.clearTimeout(visibilityTimeout)
    }, 2000)

    props.onPrimaryButtonClick()
  }

  const handleCloseClick = () => {
    // Do not show popup again
    dataProcessor.appAdminServerRequest({
      'vcv-action': 'license:feedback:submit:adminNonce',
      'vcv-feedback': 'skip'
    })
    props.onClose()
  }

  return (
    <PopupInner
      {...props}
      headingText={headingText}
      buttonText={buttonText}
      onPrimaryButtonClick={handlePrimaryButtonClick}
      onClose={handleCloseClick}
      popupName='votePopup'
    >
      <div className='vcv-layout-popup-checkbox-option-wrapper'>
        <input type='radio' id='vcv-feedback-vote-very-disappointed' className='vcv-layout-popup-checkbox' name='vcv-feedback' value='1' />
        <label htmlFor='vcv-feedback-vote-very-disappointed' className='vcv-layout-popup-checkbox-label'>
          {veryDisappointed}
        </label>
      </div>
      <div className='vcv-layout-popup-checkbox-option-wrapper'>
        <input type='radio' id='vcv-feedback-vote-somewhat-disappointed' className='vcv-layout-popup-checkbox' name='vcv-feedback' value='2' />
        <label htmlFor='vcv-feedback-vote-somewhat-disappointed' className='vcv-layout-popup-checkbox-label'>
          {somewhatDisappointed}
        </label>
      </div>
      <div className='vcv-layout-popup-checkbox-option-wrapper'>
        <input type='radio' id='vcv-feedback-vote-not-disappointed' className='vcv-layout-popup-checkbox' name='vcv-feedback' value='3' />
        <label htmlFor='vcv-feedback-vote-not-disappointed' className='vcv-layout-popup-checkbox-label'>
          {disappointed}
        </label>
      </div>
    </PopupInner>
  )
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  popupShown: (data: string) => dispatch(popupShown(data)),
  popupsSet: (data: any) => dispatch(popupsSet(data)),
  popupVisibilitySet: (data:boolean) => dispatch(popupVisibilitySet(data))
})

const mapStateToProps = (state:AppStateType) => ({
  popups: state.editorPopup.popups
})

export default connect(mapStateToProps, mapDispatchToProps)(VotePopup)

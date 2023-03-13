import React, {useState} from 'react'
import {Dispatch} from 'redux' // eslint-disable-line
import PopupInner from '../popupInner'
import { getService } from 'vc-cake'
import { connect } from 'react-redux'
import { popupShown, popupsSet, popupVisibilitySet } from '../../../editor/stores/editorPopup/slice'
import { Popups, VotePopupProps } from '../types'
import { AppStateType } from '../../../editor/stores/reducer'

const dataManager = getService('dataManager')
const dataProcessor = getService('dataProcessor')
const localizations = dataManager.get('localizations')
const voteHeading = localizations ? localizations.feedbackVoteHeadingText : 'How likely are you to recommend Visual Composer to friend or colleague?'
const reviewHeadingPositive = localizations ? 'test1' : 'test1'
const reviewHeadingNeutral = localizations ? 'test2' : 'test2'
const reviewHeadingNegative = localizations ? 'test3' : 'test3'
const veryDisappointed = localizations ? localizations.veryDisappointed : 'Not likely at all'
const extremelyLikely = localizations ? localizations.somewhatDisappointed : 'Extremely likely'

const VotePopup = ({
  popups,
  popupsSet,
  popupVisibilitySet,
  popupShown,
  onPrimaryButtonClick,
  onClose
}: VotePopupProps) => {

  const [headingText, setHeadingText] = useState(voteHeading);

  const handleVote = () => {
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

      const voteScore = parseInt(popupState.votePopup.voteValue)

      if (voteScore <= 6) {
        setHeadingText(reviewHeadingNegative)
      } else if (voteScore > 6 && voteScore <= 8) {
          setHeadingText(reviewHeadingNeutral)
      } else {
          setHeadingText(reviewHeadingPositive)
      }

      popupContent = (
            <div>
                <input type="text" />
                <button>Submit</button>
            </div>
      )
  }

  const handleCloseClick = () => {
    // Do not show popup again
    dataProcessor.appAdminServerRequest({
      'vcv-action': 'license:feedback:submit:adminNonce',
      'vcv-feedback': 'skip'
    })
    onClose()
  }

    let popupContent = (
        <div className="vcv-ui-feedback-container">
            {
                [...Array(10)].map((e, i) => <label className='vcv-ui-feedback-radio' key={`vote-${i}`}>
                    <input type='radio' className='vcv-layout-popup-checkbox' name='vcv-feedback' value={i + 1} onChange={handleVote}/>
                    <span>
              {i + 1}
            </span>
                </label>)
            }
        </div>
    )


    return (
    <PopupInner
      headingText={headingText}
      onClose={handleCloseClick}
      popupName='votePopup'
      hasButton={false}
      onPrimaryButtonClick={handleVote}
    >
      {popupContent}
      <div className='vcv-ui-feedback-description'>
        <span>{veryDisappointed}</span>
        <span>{extremelyLikely}</span>
      </div>
    </PopupInner>
  )
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  popupShown: (data: string) => dispatch(popupShown(data)),
  popupsSet: (data: Popups) => dispatch(popupsSet(data)), // eslint-disable-line
  popupVisibilitySet: (data: boolean) => dispatch(popupVisibilitySet(data))
})

const mapStateToProps = (state: AppStateType) => ({
  popups: state.editorPopup.popups
})

export default connect(mapStateToProps, mapDispatchToProps)(VotePopup)

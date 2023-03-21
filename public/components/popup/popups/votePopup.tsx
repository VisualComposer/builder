import React, { useCallback, useState } from 'react'
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
const voteHeading = localizations ? localizations.feedbackVoteHeadingText : 'How likely are you to recommend Visual Composer to friend or colleague?'
const reviewHeadingPositive = localizations ? localizations.reviewPositive : 'What is the biggest value you get from Visual Composer?'
const reviewHeadingNeutral = localizations ? localizations.reviewNeutral : 'What is the one thing we should improve in Visual Composer?'
const reviewHeadingNegative = localizations ? localizations.reviewNegative : 'What problems do you experience when using Visual Composer?'
const veryDisappointed = localizations ? localizations.veryDisappointed : 'Not likely at all'
const extremelyLikely = localizations ? localizations.somewhatDisappointed : 'Extremely likely'

const VotePopup = ({
  popups,
  popupsSet,
  onClose
}: VotePopupProps) => {
  const [headingText, setHeadingText] = useState(voteHeading)
  const [voteState, setVoteState] = useState('vote')
  const [isDisabled, setIsDisabled] = useState(true)

  const handleVote = useCallback(() => {
    const checkedInput: HTMLInputElement | null = document.querySelector('input.vcv-layout-popup-checkbox:checked')
    if (!checkedInput) {
      return
    }

    dataProcessor.appAdminServerRequest({
      'vcv-action': 'vote:score:feedback:submit:adminNonce',
      'vcv-feedback': checkedInput.value
    })

    // Set vote value in storage so we can use it in the review popup
    const currentPopup = JSON.parse(JSON.stringify(popups)) || {}
    Object.preventExtensions(currentPopup)
    if (currentPopup?.votePopup) {
      currentPopup.votePopup.voteValue = checkedInput.value
    }
    popupsSet(currentPopup)

    const voteScore = parseInt(currentPopup.votePopup.voteValue)

    if (voteScore <= 6) {
      setHeadingText(reviewHeadingNegative)
    } else if (voteScore > 6 && voteScore <= 8) {
      setHeadingText(reviewHeadingNeutral)
    } else {
      setHeadingText(reviewHeadingPositive)
    }

    setVoteState('review')
  }, [voteState])

  const handleCloseClick = () => {
    // Do not show popup again
    dataProcessor.appAdminServerRequest({
      'vcv-action': 'vote:score:feedback:submit:adminNonce',
      'vcv-feedback': 'skip'
    })
    onClose()
  }

  const handleReviewSubmit = (e:React.FormEvent) => {
    e.preventDefault()

    const target = e.target as HTMLFormElement
    const formData = new FormData(target)

    const userReview = formData.get('vcv-user-review') as string
    if (!userReview) {
      onClose()
    }

    dataProcessor.appAdminServerRequest({
      'vcv-action': 'review:survey:submit:adminNonce',
      'vcv-user-message': userReview
    })

    onClose()
  }

  const handleTexareaChange = (e:React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value) {
      setIsDisabled(false)
    } else {
      setIsDisabled(true)
    }
  }

  const popupContent = () => {
    if (voteState === 'vote') {
      return (
        <>
          <div className="vcv-ui-feedback-container">
            {
              [...Array(10)].map((e, i) => <label className="vcv-ui-feedback-radio" key={`vote-${i}`}>
                <input type="radio" className="vcv-layout-popup-checkbox" name="vcv-feedback" value={i + 1} onChange={handleVote} />
                <span>
                  {i + 1}
                </span>
              </label>)
            }
          </div>
          <div className="vcv-ui-feedback-description">
            <span>{veryDisappointed}</span>
            <span>{extremelyLikely}</span>
          </div>
        </>
      )
    } else if (voteState === 'review') {
      const submit = localizations.submit ? localizations.submit : 'Submit'
      return (
        <form className='vcv-layout-popup--review-form' onSubmit={handleReviewSubmit}>
          <textarea className='vcv-layout-popup-textarea' maxLength={1000} name='vcv-user-review' onChange={handleTexareaChange} />
          <button className='vcv-layout-popup-btn' type='submit' disabled={isDisabled}>{submit}</button>
        </form>
      )
    } else {
      return null
    }
  }

  return (
    <PopupInner
      headingText={headingText}
      onClose={handleCloseClick}
      popupName='votePopup'
      hasButton={false}
      onPrimaryButtonClick={handleVote}
    >
      {popupContent()}
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

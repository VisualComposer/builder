import React from 'react'
import PopupInner from '../popupInner'
import { getService } from 'vc-cake'
import { connect } from 'react-redux'
import { AppStateType } from '../../../editor/stores/reducer'
import { ReviewPopupProps, CustomButtonProps } from '../types'

const dataManager = getService('dataManager')
const localizations = dataManager.get('localizations')
const positiveReviewHeadingText = localizations ? localizations.thankYouText : 'Thank you!'
const negativeReviewHeadingText = localizations ? localizations.negativeReviewHeadingText : 'How can we become better?'
const positiveReviewText = localizations ? localizations.positiveReviewText : 'Thanks for your feedback. Please rate us on WordPress.org and help others to discover Visual Composer.'
const negativeReviewText = localizations ? localizations.negativeReviewText : 'Your opinion matters. Help us to improve by taking a quick survey.'
const positiveReviewButtonText = localizations ? localizations.positiveReviewButtonText : 'Write Your Review'
const negativeReviewButtonText = localizations ? localizations.negativeReviewButtonText : 'Leave Your Feedback'

const ReviewPopup = ({ onPrimaryButtonClick, onClose, popups }: ReviewPopupProps) => {
  const popupState = popups || {}
  let reviewType = '3' // If not provided for some reason
  if (popupState && popupState.votePopup) {
    reviewType = popupState.votePopup.voteValue || ''
  }

  const isPositiveReview: boolean = reviewType === '1' || reviewType === '2'
  const headingText: string = isPositiveReview ? positiveReviewHeadingText : negativeReviewHeadingText
  const reviewText: string = isPositiveReview ? positiveReviewText : negativeReviewText
  const buttonText: string = isPositiveReview ? positiveReviewButtonText : negativeReviewButtonText

  const feedbackLink: string = isPositiveReview
    ? 'https://wordpress.org/support/plugin/visualcomposer/reviews/?filter=5#new-topic-0'
    : dataManager.get('utm')['editor-feedback-review-popup-button']

  const customButtonProps: CustomButtonProps<string> = {
    target: '_blank',
    rel: 'noopener noreferrer',
    href: feedbackLink
  }

  return (
    <PopupInner
      onPrimaryButtonClick={onPrimaryButtonClick}
      onClose={onClose}
      headingText={headingText}
      buttonText={buttonText}
      popupName='reviewPopup'
      customButtonProps={customButtonProps}
    >
      <p className='vcv-layout-popup-text'>{reviewText}</p>
    </PopupInner>
  )
}

const mapStateToProps = (state: AppStateType) => ({
  popups: state.editorPopup.popups
})

export default connect(mapStateToProps)(ReviewPopup)

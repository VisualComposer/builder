import React from 'react'
import PopupInner from '../popupInner'
import { getService } from 'vc-cake'
import { connect } from 'react-redux'

const dataManager = getService('dataManager')
const localizations = dataManager.get('localizations')
const positiveReviewHeadingText = localizations ? localizations.thankYouText : 'Thank you!'
const negativeReviewHeadingText = localizations ? localizations.negativeReviewHeadingText : 'How can we become better?'
const positiveReviewText = localizations ? localizations.positiveReviewText : 'Thanks for your feedback. Please rate us on WordPress.org and help others to discover Visual Composer.'
const negativeReviewText = localizations ? localizations.negativeReviewText : 'Your opinion matters. Help us to improve by taking a quick survey.'
const positiveReviewButtonText = localizations ? localizations.positiveReviewButtonText : 'Write Your Review'
const negativeReviewButtonText = localizations ? localizations.negativeReviewButtonText : 'Leave Your Feedback'

const ReviewPopup = (props) => {
  const popupState = props.popups || {}
  let reviewType = '3' // If not provided for some reason
  if (popupState && popupState.votePopup) {
    reviewType = popupState.votePopup.voteValue
  }

  const isPositiveReview = reviewType === '1' || reviewType === '2'
  const headingText = isPositiveReview ? positiveReviewHeadingText : negativeReviewHeadingText
  const reviewText = isPositiveReview ? positiveReviewText : negativeReviewText
  const buttonText = isPositiveReview ? positiveReviewButtonText : negativeReviewButtonText

  const feedbackLink = isPositiveReview
    ? 'https://wordpress.org/support/plugin/visualcomposer/reviews/?filter=5#new-topic-0'
    : dataManager.get('utm')['editor-feedback-review-popup-button']

  const customButtonProps = {
    target: '_blank',
    rel: 'noopener noreferrer',
    href: feedbackLink
  }

  return (
    <PopupInner
      {...props}
      headingText={headingText}
      buttonText={buttonText}
      popupName='reviewPopup'
      customButtonProps={customButtonProps}
    >
      <p className='vcv-layout-popup-text'>{reviewText}</p>
    </PopupInner>
  )
}

const mapStateToProps = state => ({
  popups: state.editorPopup.popups
})

export default connect(mapStateToProps)(ReviewPopup)

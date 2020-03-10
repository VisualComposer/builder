import React from 'react'
import PropTypes from 'prop-types'

export default class ReviewContainer extends React.Component {
  static propTypes = {
    reviewType: PropTypes.string,
    handleClose: PropTypes.func
  }

  constructor (props) {
    super(props)

    this.handleClick = this.handleClick.bind(this)
  }

  handleClick (e) {
    console.log('this.props.reviewType', this.props.reviewType)
  }

  render () {
    const localizations = window.VCV_I18N && window.VCV_I18N()
    const positiveReviewHeadingText = localizations ? localizations.thankYouText : 'Thank you!'
    const negativeReviewHeadingText = localizations ? localizations.negativeReviewHeadingText : 'How can we become better?'
    const positiveReviewText = localizations ? localizations.positiveReviewText : 'We are glad to hear that. Please rate us on WordPress.org and help others to discover Visual Composer.'
    const negativeReviewText = localizations ? localizations.negativeReviewText : 'Your opinion matters. Help us to improve by taking a quick survey.'
    const positiveReviewButtonText = localizations ? localizations.positiveReviewButtonText : 'Write Your Review'
    const negativeReviewButtonText = localizations ? localizations.negativeReviewButtonText : 'Leave Your Feedback'
    const closeButtonText = localizations ? localizations.close : 'Close'

    const isPositiveReview = this.props.reviewType === 'like'
    const headingText = isPositiveReview ? positiveReviewHeadingText : negativeReviewHeadingText
    const reviewText = isPositiveReview ? positiveReviewText : negativeReviewText
    const buttonText = isPositiveReview ? positiveReviewButtonText : negativeReviewButtonText

    let reviewButton = isPositiveReview ?
      <a className='vcv-feedback-review-btn' href='https://wordpress.org/support/plugin/visualcomposer/reviews/#new-post' target='_blank'>{buttonText}</a> :
      <button className='vcv-feedback-review-btn' onClick={this.handleClick}>{buttonText}</button>


    return <div className='vcv-feedback-review'>
      <h2 className='vcv-feedback-review-heading'>{headingText}</h2>
      <p className='vcv-feedback-review-text'>{reviewText}</p>
      {reviewButton}
      <button
        className='vcv-feedback-review-close vcv-ui-icon vcv-ui-icon-close-thin'
        aria-label={closeButtonText}
        onClick={this.props.handleClose}
      />
    </div>
  }
}

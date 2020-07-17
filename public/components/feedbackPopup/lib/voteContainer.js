import React from 'react'
import PropTypes from 'prop-types'

export default class VoteContainer extends React.Component {
  static propTypes = {
    onVote: PropTypes.func,
    onClose: PropTypes.func
  }

  getVote = () => {
    const checkedInput = document.querySelector('.vcv-feedback-vote input:checked')
    if (!checkedInput) {
      return
    }
    return checkedInput.value
  }

  render () {
    const localizations = window.VCV_I18N && window.VCV_I18N()
    const headingText = localizations ? localizations.feedbackVoteHeadingText : 'How disappointed would you be if this product no longer existed tomorrow?'
    const closeButtonText = localizations ? localizations.close : 'Close'
    const buttonText = localizations ? localizations.feedbackVoteButtonText : 'Submit Your Feedback'
    const veryDisappointed = localizations ? localizations.veryDisappointed : 'Very disappointed'
    const somewhatDisappointed = localizations ? localizations.somewhatDisappointed : 'Somewhat disappointed'
    const disappointed = localizations ? localizations.disappointed : 'Not disappointed (it really isn’t that useful)'

    return (
      <div className='vcv-feedback-vote'>
        <header className='vcv-feedback-vote-header'>
          <h2 className='vcv-feedback-vote-heading'>{headingText}</h2>
          <button
            className='vcv-feedback-vote-close vcv-ui-icon vcv-ui-icon-close-thin'
            aria-label={closeButtonText}
            onClick={this.props.onClose}
          />
        </header>
        <div className='vcv-feedback-vote-control-wrapper'>
          <input type='radio' id='vcv-feedback-vote-very-disappointed' className='vcv-feedback-vote-control' name='vcv-feedback' value='1' />
          <label htmlFor='vcv-feedback-vote-very-disappointed' className='vcv-feedback-vote-control-label'>
            {veryDisappointed}
          </label>
        </div>
        <div className='vcv-feedback-vote-control-wrapper'>
          <input type='radio' id='vcv-feedback-vote-somewhat-disappointed' className='vcv-feedback-vote-control' name='vcv-feedback' value='2' />
          <label htmlFor='vcv-feedback-vote-somewhat-disappointed' className='vcv-feedback-vote-control-label'>
            {somewhatDisappointed}
          </label>
        </div>
        <div className='vcv-feedback-vote-control-wrapper'>
          <input type='radio' id='vcv-feedback-vote-not-disappointed' className='vcv-feedback-vote-control' name='vcv-feedback' value='3' />
          <label htmlFor='vcv-feedback-vote-not-disappointed' className='vcv-feedback-vote-control-label'>
            {disappointed}
          </label>
        </div>
        <a
          className='vcv-feedback-vote-btn'
          onClick={() => { this.props.onVote(this.getVote()) }}
        >
          {buttonText}
        </a>
      </div>
    )
  }
}

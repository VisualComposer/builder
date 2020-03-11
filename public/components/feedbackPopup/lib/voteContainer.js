import React from 'react'
import PropTypes from 'prop-types'

export default class VoteContainer extends React.Component {
  static propTypes = {
    handleVote: PropTypes.func
  }

  render () {
    const localizations = window.VCV_I18N && window.VCV_I18N()
    const voteText = localizations ? localizations.feedbackVoteText : 'Hi there, how do You like Visual Composer?'
    const likeText = localizations ? localizations.likeText : 'Like'
    const dislikeText = localizations ? localizations.dislikeText : 'Dislike'

    return (
      <div className='vcv-feedback-vote'>
        <p className='vcv-feedback-vote-text'>{voteText}</p>
        <button
          className='vcv-feedback-vote-control vcv-ui-icon vcv-ui-icon-thumbs-up'
          onClick={() => {this.props.handleVote('like')}}
          aria-label={likeText}
          title={likeText}
        />
        <button
          className='vcv-feedback-vote-control vcv-ui-icon vcv-ui-icon-thumbs-down'
          onClick={() => {this.props.handleVote('dislike')}}
          aria-label={dislikeText}
          title={dislikeText}
        />
      </div>
    )
  }
}

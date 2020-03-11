import React from 'react'
import { getStorage, getService } from 'vc-cake'
import VoteContainer from './lib/voteContainer'
import ReviewContainer from './lib/reviewContainer'

const elementsStorage = getStorage('elements')
const dataProcessor = getService('dataProcessor')

export default class FeedbackPopup extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      isEditorLoaded: false,
      vote: ''
    }
    this.feedbackRef = React.createRef()
    this.handleVote = this.handleVote.bind(this)
    this.handleDocumentChange = this.handleDocumentChange.bind(this)
    this.handleClose = this.handleClose.bind(this)
  }

  componentDidMount () {
    elementsStorage.state('document').onChange(this.handleDocumentChange)
  }

  componentWillUnmount () {
    elementsStorage.state('document').ignoreChange(this.handleDocumentChange)
  }

  componentDidUpdate (prevProps, prevState) {
    if (prevState.isEditorLoaded !== this.state.isEditorLoaded || prevState.vote !== this.state.vote) {
      const visibilityTimeout = setTimeout(() => {
        this.feedbackRef.current.classList.add('vcv-feedback--visible')
        window.clearTimeout(visibilityTimeout)
      }, 2000)
    }
  }

  handleDocumentChange (data) {
    if (data && data.length) {
      this.setState({ isEditorLoaded: true })
    }
  }

  handleVote (e) {
    this.feedbackRef.current.classList.add('vcv-feedback--voted')
    const vote = e.currentTarget.dataset.vote
    const visibilityTimeout = setTimeout(() => {
      this.feedbackRef.current.classList.remove('vcv-feedback--visible', 'vcv-feedback--voted')
      this.setState({ vote: vote })
      window.clearTimeout(visibilityTimeout)
    }, 1000)
    const feedback = vote === 'like' ? 1 : -1
    dataProcessor.appAdminServerRequest({
      'vcv-action': 'license:feedback:submit:adminNonce',
      'vcv-feedback': feedback
    })
  }

  handleClose () {
    this.feedbackRef.current.classList.remove('vcv-feedback--visible')
  }

  getReviewProps () {
    return {
      reviewType: this.state.vote,
      handleClose: this.handleClose
    }
  }

  getVoteProps () {
    return {
      handleVote: this.handleVote
    }
  }

  render () {
    if (!this.state.isEditorLoaded) {
      return null
    }

    const feedbackState = !this.state.vote ? 'vote' : 'review'
    const feedbackContent = !this.state.vote
      ? <VoteContainer {...this.getVoteProps()} />
      : <ReviewContainer {...this.getReviewProps()} />

    return (
      <div className='vcv-feedback' data-feedback-state={feedbackState} ref={this.feedbackRef}>
        {feedbackContent}
      </div>
    )
  }
}

import React from 'react'
import { getStorage } from 'vc-cake'
import VoteContainer from './lib/voteContainer'
import ReviewContainer from './lib/reviewContainer'

const elementsStorage = getStorage('elements')

export default class FeedbackPopup extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      isEditorLoaded: false,
      vote: ''
    }
    this.feedbackRef = React.createRef();
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
    if (prevState.isEditorLoaded !== this.state.isEditorLoaded) {
      let visibilityTimeout = setTimeout(() => {
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
    this.setState({ vote:  e.currentTarget.dataset.vote })
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
    const feedbackContent = !this.state.vote ?
      <VoteContainer {...this.getVoteProps()} /> :
      <ReviewContainer {...this.getReviewProps()} />

    return <div className='vcv-feedback' data-feedback-state={feedbackState} ref={this.feedbackRef}>
      {feedbackContent}
    </div>
  }
}

import React from 'react'
import classNames from 'classnames'
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
        this.setState({ feedbackVisible: true })
        window.clearTimeout(visibilityTimeout)
      }, 2000)
    }
  }

  handleDocumentChange (data) {
    if (data && data.length) {
      this.setState({ isEditorLoaded: true })
    }
  }

  handleVote (vote) {
    this.setState({ feedbackVoted: true })
    const visibilityTimeout = setTimeout(() => {
      this.setState({
        feedbackVisible: false,
        feedbackVoted: false,
        vote: vote
      })
      window.clearTimeout(visibilityTimeout)
    }, 1000)
    dataProcessor.appAdminServerRequest({
      'vcv-action': 'license:feedback:submit:adminNonce',
      'vcv-feedback': vote
    })
  }

  handleClose () {
    this.setState({ feedbackVisible: false })
  }

  render () {
    if (!this.state.isEditorLoaded) {
      return null
    }

    const feedbackState = !this.state.vote ? 'vote' : 'review'
    const feedbackContent = !this.state.vote
      ? <VoteContainer onVote={this.handleVote} onClose={this.handleClose} />
      : <ReviewContainer reviewType={this.state.vote} onClose={this.handleClose} />

    const feedbackClasses = classNames({
      'vcv-feedback': true,
      'vcv-feedback--visible': this.state.feedbackVisible,
      'vcv-feedback--voted': this.state.feedbackVoted
    })

    return (
      <div className={feedbackClasses} data-feedback-state={feedbackState}>
        <div className='vcv-feedback-container'>
          {feedbackContent}
        </div>
      </div>
    )
  }
}

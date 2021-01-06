import React from 'react'
import { getService } from 'vc-cake'
import GiphyContainer from 'public/components/stockMedia/giphyContainer'

const dataManager = getService('dataManager')

export default class GiphyMediaTab extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      scrolledToBottom: false,
      scrollTop: 0
    }

    this.handleMediaScroll = this.handleMediaScroll.bind(this)
    this.handleClickGoPremium = this.handleClickGoPremium.bind(this)
  }

  componentDidMount () {
    window.setTimeout(() => {
      const mediaFrame = document.querySelector('.media-frame-content')
      if (mediaFrame) {
        mediaFrame.addEventListener('scroll', this.handleMediaScroll)
      }
    }, 100)
  }

  componentWillUnmount () {
    const mediaFrame = document.querySelector('.media-frame-content')
    if (mediaFrame) {
      mediaFrame.removeEventListener('scroll', this.handleMediaScroll)
    }
  }

  handleMediaScroll (e) {
    const el = e.currentTarget
    const clientRect = el.getBoundingClientRect()
    const windowHeight = window.innerHeight || document.documentElement.clientHeight
    const scrolledToBottom = (el.scrollTop + clientRect.height + (windowHeight / 2)) >= el.scrollHeight
    this.setState({
      scrollTop: el.scrollTop,
      scrolledToBottom: scrolledToBottom
    })
  }

  handleClickGoPremium (clickedType) {
    const utm = dataManager.get('utm')
    const utmMedium = 'giphy-add-media-editor'
    const utmLink = clickedType === 'button' ? utm['editor-hub-go-premium'] : utm['editor-hub-popup-teaser']
    const teaserUrl = utmLink.replace('{medium}', utmMedium)

    window.open(teaserUrl)
  }

  render () {
    return (
      <GiphyContainer
        onClickGoPremium={this.handleClickGoPremium}
        scrolledToBottom={this.state.scrolledToBottom}
        scrollTop={this.state.scrollTop}
      />
    )
  }
}

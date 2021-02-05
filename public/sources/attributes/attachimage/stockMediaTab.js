import React from 'react'
import { getService } from 'vc-cake'
import UnsplashContainer from 'public/components/stockMedia/unsplashContainer'

const dataManager = getService('dataManager')

export default class StockMediaTab extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      scrolledToBottom: false,
      scrollTop: 0
    }

    this.handleMediaScroll = this.handleMediaScroll.bind(this)
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

  render () {
    const utm = dataManager.get('utm')
    const utmMedium = 'unsplash-addmedia-editor'
    const utmLink = utm['editor-hub-go-premium']
    const teaserUrl = utmLink.replace('{medium}', utmMedium)

    return (
      <UnsplashContainer
        scrolledToBottom={this.state.scrolledToBottom}
        scrollTop={this.state.scrollTop}
        goPremiumLink={teaserUrl}
        namespace='editor'
        filterType='unsplash'
        renderPlace='addmedia'
      />
    )
  }
}

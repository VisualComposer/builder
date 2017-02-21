import React from 'react'
import classNames from 'classnames'
const { Component, PropTypes } = React
export default class VideoEmbedBackground extends Component {
  static propTypes = {
    id: PropTypes.string,
    atts: PropTypes.object,
    editor: PropTypes.object
  }

  render () {
    const { reactKey, deviceKey, deviceData } = this.props
    const { videoEmbed } = deviceData
    if (videoEmbed && videoEmbed.urls && videoEmbed.urls.length) {
      let videoData = videoEmbed.urls[ 0 ]
      let videoKey = `${reactKey}-${videoData.id}`
      let containerClasses = [
        `vce-asset-video-embed-container`,
        `vce-visible-${deviceKey}-only`
      ]
      let customProps = {}
      return <div className={classNames(containerClasses)} {...customProps}>
        <div className='vce-asset-video-embed-wrapper'>
          <div className='vce-asset-video-embed-background'
            data-vce-assets-video-embed={videoData.id}
            data-vce-assets-video-replacer='.vce-asset-video-embed-player'
            data-vce-assets-video-orientation-class='vce-asset-video-embed--state-landscape'>
            <svg className='vce-asset-video-embed-sizer' />
            <video key={videoKey} className='vce-asset-video-embed-player'>
              <source src={videoData.url} type='video/mp4' />
            </video>
          </div>
        </div>
      </div>
    }
    return null
  }
}

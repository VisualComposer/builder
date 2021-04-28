import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'

export default class VideoEmbedBackground extends React.Component {
  static propTypes = {
    id: PropTypes.string,
    atts: PropTypes.object,
    editor: PropTypes.object
  }

  render () {
    const { reactKey, deviceKey, deviceData } = this.props
    const { videoEmbed } = deviceData
    if (videoEmbed && videoEmbed.urls && videoEmbed.urls.length) {
      const videoData = videoEmbed.urls[0]
      const videoKey = `${reactKey}-${videoData.id}`
      const containerClasses = [
        'vce-asset-video-embed-container',
        `vce-visible-${deviceKey}-only`
      ]
      const playsInline = true
      let videoElement = (
        <video key={videoKey} className='vce-asset-video-embed-player' playsInline={playsInline}>
          <source src={videoData.url} type='video/mp4' />
        </video>
      )

      if (deviceData.lazyLoad) {
        const videoElementString = `
          <video class="vce-asset-video-embed-player vcv-lozad" playsinline="${playsInline}" loop="true" autoplay="true" muted="true">
            <source data-src="${videoData.url}" type="video/mp4" />
          </video>
          <noscript>
            <video class="vce-asset-video-embed-player" playsinline="${playsInline}" loop="true" autoplay="true" muted="true">
              <source src="${videoData.url}" type="video/mp4" />
            </video>
          </noscript>
        `
        videoElement = (
          <div className='vcvhelper' data-vcvs-html={videoElementString}>
            {videoElement}
          </div>
        )
      }

      return (
        <div className={classNames(containerClasses)}>
          <div className='vce-asset-video-embed-wrapper'>
            <div
              className='vce-asset-video-embed-background'
              data-vce-assets-video-embed={videoData.id}
              data-vce-assets-video-replacer='.vce-asset-video-embed-player'
              data-vce-assets-video-orientation-class='vce-asset-video-embed--state-landscape'
            >
              <svg className='vce-asset-video-embed-sizer' />
              {videoElement}
            </div>
          </div>
        </div>
      )
    }

    return null
  }
}

import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'

export default class YoutubeBackground extends React.Component {
  static propTypes = {
    id: PropTypes.string,
    atts: PropTypes.object,
    editor: PropTypes.object
  }

  render () {
    const { deviceKey, deviceData } = this.props
    const { videoYoutube } = deviceData

    const ytrx = /^.*((youtu\.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*)(?:(\?t|&start)=(?:(\d+)h)?(?:(\d+)m)?(\d+)s)?.*/
    if (videoYoutube && videoYoutube.search(ytrx) !== -1) {
      const videoData = videoYoutube.trim().match(ytrx)
      const videoId = videoData[7]
      const playerSettings = {
        videoId: videoId
      }
      const helperClasses = classNames({
        'vce-asset-video-yt-player': true,
        'vcv-lozad': deviceData.lazyLoad
      })
      const vcvHelperHTML = '<div class="vce-asset-video-yt-player" />'
      const vcvHelper = `<div class="${helperClasses}" />`
      const containerClasses = [
        'vce-asset-video-yt-container',
        `vce-visible-${deviceKey}-only`
      ]

      return (
        <div className={classNames(containerClasses)}>
          <div className='vce-asset-video-yt-wrapper'>
            <div
              className='vce-asset-video-yt-background'
              data-vce-assets-video-yt={playerSettings.videoId}
              data-vce-assets-video-replacer='.vce-asset-video-yt-player'
              data-vce-assets-video-orientation-class='vce-asset-video-yt--state-landscape'
            >
              <svg className='vce-asset-video-yt-sizer' width='0' height='0' />
              <div className='vcvhelper' data-vcvs-html={vcvHelper} dangerouslySetInnerHTML={{ __html: vcvHelperHTML }} />
            </div>
          </div>
        </div>
      )
    }

    return null
  }
}

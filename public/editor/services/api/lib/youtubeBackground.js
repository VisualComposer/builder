import React from 'react'
import classNames from 'classnames'
const { Component, PropTypes } = React
export default class YoutubeBackground extends Component {
  static propTypes = {
    id: PropTypes.string,
    atts: PropTypes.object,
    editor: PropTypes.object
  }

  render () {
    const { deviceKey, deviceData, applyBackground } = this.props
    const { videoYoutube, parallax } = deviceData

    let ytrx = /^.*((youtu\.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&\?]*)(?:(\?t|&start)=(?:(\d+)h)?(?:(\d+)m)?(\d+)s)?.*/
    if (videoYoutube && videoYoutube.search(ytrx) !== -1) {
      let videoData = videoYoutube.trim().match(ytrx)
      let videoId = videoData[ 7 ]
      let playerSettings = {
        videoId: videoId
      }
      let vcvHelperHTML = `<div class="vce-asset-video-yt-player" />`
      let containerClasses = [
        `vce-asset-video-yt-container`,
        `vce-visible-${deviceKey}-only`
      ]

      let customProps = {}
      if (parallax) {
        customProps[ 'data-vce-assets-parallax' ] = '.vce-asset-video-yt-wrapper'
      }
      if (parallax === 'simple-fade') {
        customProps[ 'data-vce-assets-parallax-fade' ] = true
      }
      return <div className={classNames(containerClasses)} {...customProps} {...applyBackground}>
        <div className='vce-asset-video-yt-wrapper'>
          <div className='vce-asset-video-yt-background'
            data-vce-assets-video-yt={playerSettings.videoId}
            data-vce-assets-video-replacer='.vce-asset-video-yt-player'
            data-vce-assets-video-orientation-class='vce-asset-video-yt--state-landscape'>
            <svg className='vce-asset-video-yt-sizer' />
            <vcvhelper data-vcvs-html={vcvHelperHTML} dangerouslySetInnerHTML={{ __html: vcvHelperHTML }} />
          </div>
        </div>
      </div>
    }
    return null
  }
}

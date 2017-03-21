import React from 'react'
import classNames from 'classnames'
const { Component, PropTypes } = React
export default class VimeoBackground extends Component {
  static propTypes = {
    id: PropTypes.string,
    atts: PropTypes.object,
    editor: PropTypes.object
  }

  render () {
    const { deviceKey, deviceData } = this.props
    const { videoVimeo } = deviceData

    let vrx = /https?:\/\/(?:www\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|)(\d+)(?:$|\/|\?)/
    if (videoVimeo && videoVimeo.search(vrx) !== -1) {
      let videoData = videoVimeo.trim().match(vrx)
      let videoId = videoData[ 3 ]
      let playerSettings = {
        videoId: videoId
      }
      let vcvHelperHTML = `<div class="vce-asset-video-vimeo-player" />`
      let containerClasses = [
        `vce-asset-video-vimeo-container`,
        `vce-visible-${deviceKey}-only`
      ]
      return <div className={classNames(containerClasses)}>
        <div className='vce-asset-video-vimeo-wrapper'>
          <div className='vce-asset-video-vimeo-background'
            data-vce-assets-video-vimeo={playerSettings.videoId}
            data-vce-assets-video-replacer='.vce-asset-video-vimeo-player'
            data-vce-assets-video-orientation-class='vce-asset-video-vimeo--state-landscape'>
            <svg className='vce-asset-video-vimeo-sizer' />
            <vcvhelper data-vcvs-html={vcvHelperHTML} dangerouslySetInnerHTML={{ __html: vcvHelperHTML }} />
          </div>
        </div>
      </div>
    }
    return null
  }
}

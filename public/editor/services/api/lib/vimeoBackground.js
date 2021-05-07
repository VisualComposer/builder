import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'

export default class VimeoBackground extends React.Component {
  static propTypes = {
    id: PropTypes.string,
    atts: PropTypes.object,
    editor: PropTypes.object
  }

  render () {
    const { deviceKey, deviceData } = this.props
    const { videoVimeo } = deviceData

    const vrx = /https?:\/\/(?:www\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/([^/]*)\/videos\/|album\/(\d+)\/video\/|)(\d+)(?:$|\/|\?)/
    if (videoVimeo && videoVimeo.search(vrx) !== -1) {
      const videoData = videoVimeo.trim().match(vrx)
      const videoId = videoData[3]
      const playerSettings = {
        videoId: videoId
      }
      const helperClasses = classNames({
        'vce-asset-video-vimeo-player': true,
        'vcv-lozad': deviceData.lazyLoad
      })
      const vcvHelperHTML = '<div class="vce-asset-video-vimeo-player" />'
      const vcvHelper = `<div class="${helperClasses}" />`
      const containerClasses = [
        'vce-asset-video-vimeo-container',
        `vce-visible-${deviceKey}-only`
      ]

      return (
        <div className={classNames(containerClasses)}>
          <div className='vce-asset-video-vimeo-wrapper'>
            <div
              className='vce-asset-video-vimeo-background'
              data-vce-assets-video-vimeo={playerSettings.videoId}
              data-vce-assets-video-replacer='.vce-asset-video-vimeo-player'
              data-vce-assets-video-orientation-class='vce-asset-video-vimeo--state-landscape'
            >
              <svg className='vce-asset-video-vimeo-sizer' />
              <div className='vcvhelper' data-vcvs-html={vcvHelper} dangerouslySetInnerHTML={{ __html: vcvHelperHTML }} />
            </div>
          </div>
        </div>
      )
    }

    return null
  }
}

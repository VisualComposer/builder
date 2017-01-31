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
    let vcvHelperHTML = `<div class="vce-asset-video-yt-player" />`
    let containerClasses = [
      `vce-asset-video-yt-container`,
      `vce-visible-${this.props.device}-only`
    ]
    return <div className={classNames(containerClasses)}>
      <div className='vce-asset-video-yt-background'
        data-vce-assets-video-yt={this.props.settings.videoId}
        data-vce-assets-video-replacer='.vce-asset-video-yt-player'
        data-vce-assets-video-orientation-class='vce-asset-video-yt--state-landscape'>
        <svg className='vce-asset-video-yt-sizer' />
        <vcvhelper data-vcvs-html={vcvHelperHTML} dangerouslySetInnerHTML={{ __html: vcvHelperHTML }} />
      </div>
    </div>
  }
}

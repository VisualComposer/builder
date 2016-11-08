/* global React, vcvAPI */
class Component extends vcvAPI.elementComponent {
  render () {
    let { id, atts, editor } = this.props
    let { customClass, videoPlayer } = atts
    let classes = 'vce-video-player'
    let source, videoId
    let yrx = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/
    let vrx = /https?:\/\/(?:www\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|)(\d+)(?:$|\/|\?)/

    if (typeof customClass === 'string' && customClass) {
      classes = classes.concat(' ' + customClass)
    }
    console.log(this.props)
    console.log('vimeo: ', videoPlayer.match(vrx))
    console.log('youtube: ', videoPlayer.match(yrx))

    if (videoPlayer.match(vrx)) {
      videoId = videoPlayer.match(vrx)
      source = `//player.vimeo.com/video/${videoId[3]}`
    } else if (videoPlayer.match(yrx)) {
      videoId = videoPlayer.match(yrx)
      source = `https://www.youtube.com/embed/${videoId[7]}`
    }

    return <div className={classes} id={'el-' + id} {...editor}>
      <div className='vce-video-player-iframe-container'>
        <iframe
          className='vce-video-player-iframe'
          src={source}
          width='640'
          height='390'
          frameBorder='0'
          allowFullScreen='true'
        />
      </div>
    </div>
  }
}

/* global React, vcvAPI */
class Component extends vcvAPI.elementComponent {
  render () {
    let { id, atts, editor } = this.props
    let { customClass, videoPlayer, alignment, size, customSize } = atts
    let classes = 'vce-video-player vce'
    let wrapperClasses = 'vce-video-player-wrapper'
    let innerClasses = 'vce-video-player-inner'
    let source, url, videoWidth
    let vrx = /https?:\/\/(?:www\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|)(\d+)(?:$|\/|\?)/
    let ytrx = /^.*((youtu\.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*)(?:(\?t|&start)=(?:(\d+)h)?(?:(\d+)m)?(\d+)s)?.*/
    let validUnits = (src) => {
      switch (src) {
        case 'px':
          return src
        case 'em':
          return src
        case 'rem':
          return src
        case 'pt':
          return src
        case 'pc':
          return src
        case '%':
          return src
        default:
          return 'px'
      }
    }
    if (typeof customClass === 'string' && customClass) {
      classes = classes.concat(' ' + customClass)
    }
    if (editor) {
      innerClasses += ' vce-video-player-disabled'
    }
    if (alignment) {
      classes += ` vce-video-player--align-${alignment}`
    }
    if (size) {
      if (size === 'custom') {
        if (/^[0-9.]+$/.test(customSize)) {
          videoWidth = `${parseFloat(customSize)}px`
        } else if (parseFloat(customSize)) {
          let chars = customSize.slice(parseFloat(customSize).toString().length)
          videoWidth = `${parseFloat(customSize)}${validUnits(chars)}`
        } else {
          videoWidth = '560px'
        }
      } else {
        videoWidth = `${size.slice(0, size.indexOf('x'))}px`
      }
      classes += ` vce-video-player--size-${size}`
    }
    if (videoPlayer.match(vrx)) {
      url = videoPlayer.match(vrx)
      source = `//player.vimeo.com/video/${url[3]}?loop=0`
    } else if (videoPlayer.match(ytrx)) {
      url = videoPlayer.match(ytrx)
      let seconds = 0
      if (url[8]) {
        seconds += url[9] === undefined ? 0 : (Number(url[9]) * 60 * 60)
        seconds += url[10] === undefined ? 0 : (Number(url[10]) * 60)
        seconds += url[11] === undefined ? 0 : (Number(url[11]))
      }
      source = `https://www.youtube.com/embed/${url[7]}?start=${seconds}&loop=0&cc_load_policy=0&iv_load_policy=3`
    }

    return <div className={classes} id={'el-' + id} {...editor}>
      <div className={wrapperClasses}>
        <div className={innerClasses} style={{width: videoWidth}}>
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
    </div>
  }
}

/* global React, vcvAPI */
class Component extends vcvAPI.elementComponent {
  render () {
    let { id, atts, editor } = this.props
    let { customClass, videoPlayer, alignment, size, customSize, color, controls } = atts
    let classes = 'vce-yt-video-player vce'
    let wrapperClasses = 'vce-yt-video-player-wrapper'
    let innerClasses = 'vce-yt-video-player-inner'
    let source, videoWidth, videoId
    let autoplay = 0
    let loop = `&loop=0`
    let rel = 0
    let start = 0
    let end = ''
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
      classes = classes.concat(` ${customClass}`)
    }
    if (editor) {
      innerClasses += ' vce-yt-video-player-disabled'
    }
    if (alignment) {
      classes += ` vce-yt-video-player--align-${alignment}`
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
      classes += ` vce-yt-video-player--size-${size}`
    }
    if (videoPlayer.match(ytrx)) {
      let url
      url = videoPlayer.match(ytrx)
      videoId = url[7]
      if (url[8]) {
        start += url[9] === undefined ? 0 : (Number(url[9]) * 60 * 60)
        start += url[10] === undefined ? 0 : (Number(url[10]) * 60)
        start += url[11] === undefined ? 0 : (Number(url[11]))
      }
    }
    if (atts.autoplay) {
      autoplay = 1
    }
    if (atts.loop) {
      loop = `&loop=1&playlist=${videoId}`
    }
    if (atts.rel) {
      rel = 1
    }
    if (atts.start) {
      start = atts.start
    }
    if (atts.end) {
      end += `&end=${atts.end}`
    }

    source = `https://www.youtube.com/embed/${videoId}?autoplay=${autoplay}&color=${color}&controls=${controls}${loop}&rel=${rel}&start=${start}${end}&cc_load_policy=0&iv_load_policy=3`

    return <div className={classes} id={'el-' + id} {...editor}>
      <div className={wrapperClasses}>
        <div className={innerClasses} style={{width: videoWidth}}>
          <iframe
            className='vce-yt-video-player-iframe'
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

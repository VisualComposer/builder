/* global React, vcvAPI */
class Component extends vcvAPI.elementComponent {
  parseTime (timeString) {
    let time = {
      h: 0,
      m: 0,
      s: 0,
      toSeconds() {
        return this.h * 60 * 60 + this.m * 60 + this.s
      },
      toString () {
        return this.h + 'h' + this.m + 'm' + this.s + 's'
      }
    }

    // replace all spaces
    timeString = timeString.replace(/\s+/g, '')
    // get matched vars
    let re = /([0-9]+[hms])|([0-9]+(?=:|$))/gi
    let timeData = timeString.match(re)
    if (timeData) {
      function findByLetter (char, value) {
        if (value.slice(-1) === char) {
          return true
        }
        return false
      }

      // search for hours
      let hi = timeData.findIndex(findByLetter.bind(null, 'h'))
      if (hi !== -1) {
        time.h = parseInt(timeData[ hi ])
        timeData.splice(hi, 1)
      }
      // search for minutes
      let mi = timeData.findIndex(findByLetter.bind(null, 'm'))
      if (mi !== -1) {
        time.m = parseInt(timeData[ mi ])
        timeData.splice(mi, 1)
      }
      // search for seconds
      let si = timeData.findIndex(findByLetter.bind(null, 's'))
      if (si !== -1) {
        time.s = parseInt(timeData[ si ])
        timeData.splice(si, 1)
      }
    }

    // get simple vars
    // filter data and remove last matched elements
    timeData = timeData.filter((value) => {
      let re = /^\d+$/
      if (re.test(value)) {
        return true
      }
      return false
    })
    timeData.splice(3)
    // get seconds
    if (timeData.length) {
      if (!time.s) {
        time.s = parseInt(timeData.pop())
      }
    }
    // get minutes
    if (timeData.length) {
      if (!time.m) {
        time.m = parseInt(timeData.pop())
      }
    }
    // get hours
    if (timeData.length) {
      if (!time.h) {
        time.h = parseInt(timeData.pop())
      }
    }
    return time.toSeconds()
  }
  validUnits (src) {
    switch (src) {
      case 'px':
        return src
      case 'em':
        return src
      case 'rem':
        return src
      case 'vw':
        return src
      case 'vh':
        return src
      case '%':
        return src
      default:
        return 'px'
    }
  }

  render () {
    let { id, atts, editor } = this.props
    let { customClass, videoPlayer, alignment, size, customSize, advanced } = atts
    let classes = 'vce-yt-video-player'
    let source, videoWidth, videoId, loop
    let autoplay = advanced && atts.autoplay ? 1 : 0
    let color = advanced && atts.color ? atts.color : 'red'
    let controls = 2
    let rel = advanced && atts.rel ? 1 : 0
    let start = advanced && atts.start ? this.parseTime(atts.start) : 0
    let end = advanced && atts.end ? `&end=${this.parseTime(atts.end)}` : ''
    let ytrx = /^.*((youtu\.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*)(?:(\?t|&start)=(?:(\d+)h)?(?:(\d+)m)?(\d+)s)?.*/

    if (advanced) {
      controls = atts.controls ? 2 : 0
    }
    if (typeof customClass === 'string' && customClass) {
      classes = classes.concat(` ${customClass}`)
    }
    if (alignment) {
      classes += ` vce-yt-video-player--align-${alignment}`
    }
    if (size) {
      classes += ` vce-yt-video-player--size-${size}`
      if (size === 'custom') {
        if (/^[0-9.]+$/.test(customSize)) {
          videoWidth = `${parseFloat(customSize)}px`
        } else if (parseFloat(customSize)) {
          let chars = customSize.slice(parseFloat(customSize).toString().length)
          videoWidth = `${parseFloat(customSize)}${this.validUnits(chars)}`
        } else {
          videoWidth = '560px'
        }
      } else {
        videoWidth = `${size.slice(0, size.indexOf('x'))}px`
      }
    }
    if (videoPlayer && videoPlayer.match(ytrx)) {
      let url = videoPlayer.trim()
      url = url.match(ytrx)
      videoId = url[ 7 ]
      loop = advanced && atts.loop ? `&loop=1&playlist=${videoId}` : `&loop=0`
      if (url[ 8 ]) {
        start += url[ 9 ] === undefined ? 0 : (Number(url[ 9 ]) * 60 * 60)
        start += url[ 10 ] === undefined ? 0 : (Number(url[ 10 ]) * 60)
        start += url[ 11 ] === undefined ? 0 : (Number(url[ 11 ]))
      }
    }

    source = `https://www.youtube.com/embed/${videoId}?autoplay=${autoplay}&color=${color}&controls=${controls}${loop}&rel=${rel}&start=${start}${end}&cc_load_policy=0&iv_load_policy=3`

    return <div className={classes} {...editor} data-vcv-element-disabled='true'>
      <div className='vce vce-yt-video-player-wrapper' id={'el-' + id} style={{width: videoWidth}}>
        <div className='vce-yt-video-player-inner'>
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

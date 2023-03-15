import React from 'react'
import vcCake from 'vc-cake'

const vcvAPI = vcCake.getService('api')

export default class YoutubePlayerComponent extends vcvAPI.elementComponent {
  parseTime (timeString) {
    const time = {
      h: 0,
      m: 0,
      s: 0,
      toSeconds () {
        return this.h * 60 * 60 + this.m * 60 + this.s
      },
      toString () {
        return this.h + 'h' + this.m + 'm' + this.s + 's'
      }
    }

    // replace all spaces
    timeString = timeString.replace(/\s+/g, '')
    // get matched vars
    const re = /([0-9]+[hms])|([0-9]+(?=:|$))/gi
    let timeData = timeString.match(re)
    if (timeData) {
      const findByLetter = (char, value) => value.slice(-1) === char

      // search for hours
      const hi = timeData.findIndex(findByLetter.bind(null, 'h'))
      if (hi !== -1) {
        time.h = parseInt(timeData[hi])
        timeData.splice(hi, 1)
      }
      // search for minutes
      const mi = timeData.findIndex(findByLetter.bind(null, 'm'))
      if (mi !== -1) {
        time.m = parseInt(timeData[mi])
        timeData.splice(mi, 1)
      }
      // search for seconds
      const si = timeData.findIndex(findByLetter.bind(null, 's'))
      if (si !== -1) {
        time.s = parseInt(timeData[si])
        timeData.splice(si, 1)
      }

      // get simple vars
      // filter data and remove last matched elements
      timeData = timeData.filter((value) => {
        const re = /^\d+$/
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
    const { id, atts, editor } = this.props
    const { customClass, videoPlayer, alignment, size, customSize, advanced, metaCustomId, extraDataAttributes } = atts
    let classes = 'vce-yt-video-player'
    let source, videoWidth, videoId, loop
    const autoplay = advanced && atts.autoplay ? 1 : 0
    const color = advanced && atts.color ? atts.color : 'red'
    let controls = 1
    const rel = advanced && atts.rel ? 1 : 0
    let start = advanced && atts.start ? this.parseTime(atts.start) : 0
    const end = advanced && atts.end ? `&end=${this.parseTime(atts.end)}` : ''
    const ytrx = /^.*((youtu\.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*)(?:(\?t|&start)=(?:(\d+)h)?(?:(\d+)m)?(\d+)s)?.*/
    const customProps = this.getExtraDataAttributes(extraDataAttributes)

    if (advanced) {
      controls = atts.controls ? 1 : 0
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
          const chars = customSize.slice(parseFloat(customSize).toString().length)
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
      videoId = url[7]
      loop = advanced && atts.loop ? `&loop=1&playlist=${videoId}` : '&loop=0'
      if (url[8]) {
        start += url[9] === undefined ? 0 : (Number(url[9]) * 60 * 60)
        start += url[10] === undefined ? 0 : (Number(url[10]) * 60)
        start += url[11] === undefined ? 0 : (Number(url[11]))
      }
    }

    source = `https://www.youtube.com/embed/${videoId}?autoplay=${autoplay}&mute=${autoplay}&color=${color}&controls=${controls}${loop}&rel=${rel}&start=${start}${end}&cc_load_policy=0&iv_load_policy=3&enablejsapi=1`

    if (metaCustomId) {
      customProps.id = metaCustomId
    }

    const html = `<iframe class='vce-yt-video-player-iframe' src='${source}' width='640' height='390' allowFullScreen title='YouTube video' />`

    if (vcCake.env('editor') === 'backend') {
      source = `https://www.youtube.com/embed/${videoId}?autoplay=false&color=${color}&controls=${controls}${loop}&rel=${rel}&start=${start}${end}&cc_load_policy=0&iv_load_policy=3&enablejsapi=1`
    }

    const doAll = this.applyDO('all')

    return (
      <div className={classes} {...editor} {...customProps} data-vcv-element-disabled>
        <div className='vce vce-yt-video-player-wrapper' id={'el-' + id} style={{ width: videoWidth }} {...doAll}>
          <div className='vce-yt-video-player-inner'>
            <div className='vcvhelper' data-vcvs-html={html}>
              <iframe
                className='vce-yt-video-player-iframe'
                src={source}
                width='640'
                height='390'
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

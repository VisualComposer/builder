import React from 'react'
import vcCake from 'vc-cake'

const vcvAPI = vcCake.getService('api')

export default class VimeoPlayerComponent extends vcvAPI.elementComponent {
  validUnits (src) {
    switch (src) {
      case 'px':
        return src
      case 'em':
        return src
      case 'rem':
        return src
      case '%':
        return src
      case 'vw':
        return src
      case 'vh':
        return src
      default:
        return 'px'
    }
  }

  render () {
    const { id, atts, editor } = this.props
    const { customClass, videoPlayer, alignment, size, customSize, advanced, metaCustomId } = atts
    let classes = 'vce-vim-video-player'
    let source, videoWidth, videoId
    const autopause = advanced && atts.autopause ? 1 : 0
    const autoplay = advanced && atts.autoplay ? 1 : 0
    const loop = advanced && atts.loop ? 1 : 0
    const color = advanced ? atts.color.slice(1) : '00adef'
    const vrx = /https?:\/\/(?:www\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/([^/]*)\/videos\/|album\/(\d+)\/video\/|)(\d+)(?:$|\/|\?)/
    const customProps = {}

    if (typeof customClass === 'string' && customClass) {
      classes = classes.concat(` ${customClass}`)
    }
    if (alignment) {
      classes += ` vce-vim-video-player--align-${alignment}`
    }
    if (size) {
      classes += ` vce-vim-video-player--size-${size}`
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
    if (videoPlayer.match(vrx)) {
      const url = videoPlayer.match(vrx)
      videoId = url[3]
    }

    if (metaCustomId) {
      customProps.id = metaCustomId
    }

    source = `//player.vimeo.com/video/${videoId}?autopause=${autopause}&autoplay=${autoplay}&muted=${autoplay}&color=${color}&loop=${loop}`

    const html = `<iframe class='vce-vim-video-player-iframe' src='${source}' frameBorder='0' allowFullScreen='true' title='Vimeo video' />`

    if (vcCake.env('editor') === 'backend') {
      source = `//player.vimeo.com/video/${videoId}?autopause=${autopause}&autoplay=false&color=${color}&loop=${loop}`
    }

    const doAll = this.applyDO('all')

    return (
      <div className={classes} {...customProps} {...editor} data-vcv-element-disabled>
        <div className='vce vce-vim-video-player-wrapper' id={'el-' + id} style={{ width: videoWidth }} {...doAll}>
          <div className='vce-vim-video-player-inner'>
            <div className='vcvhelper' data-vcvs-html={html}>
              <iframe
                className='vce-vim-video-player-iframe'
                src={source}
                frameBorder='0'
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

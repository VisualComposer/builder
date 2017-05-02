import React from 'react'
import vcCake from 'vc-cake'
const vcvAPI = vcCake.getService('api')
const cook = vcCake.getService("cook")

export default class InstagramImage extends vcvAPI.elementComponent {
  static unique = 0

  componentDidMount () {
    if (this.props.atts.width) {
      this.checkCustomSize(this.props.atts.width)
    }
    this.insertInstagram(this.props.atts.instagramUrl, this.props.atts.includeCaption)
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.atts.width) {
      this.checkCustomSize(nextProps.atts.width)
    } else {
      this.setState({
        size: null
      })
    }

    if (this.props.atts.instagramUrl !== nextProps.atts.instagramUrl || this.props.atts.includeCaption !== nextProps.atts.includeCaption) {
      this.insertInstagram(nextProps.atts.instagramUrl, nextProps.atts.includeCaption)
    }
  }

  checkCustomSize (width) {
    width = this.validateSize(width)
    width = /^\d+$/.test(width) ? width + 'px' : width
    let size = { width }
    this.setSizeState(size)
  }

  validateSize (value) {
    let units = [ 'px', 'em', 'rem', '%', 'vw', 'vh' ]
    let re = new RegExp('^-?\\d*(\\.\\d{0,9})?(' + units.join('|') + ')?$')
    if (value === '' || value.match(re)) {
      return value
    } else {
      return null
    }
  }

  setSizeState (size) {
    this.setState({ size })
  }

  updateInstagramHtml (tagString = '') {
    tagString = tagString.replace(/max-width\:\d+px\;/g, 'max-width:100%;')
    const component = this.getDomNode().querySelector('.vce-instagram-image-inner')
    this.updateInlineHtml(component, tagString)
    let iframe = document.querySelector('#vcv-editor-iframe').contentWindow
    if (iframe && iframe.instgrm && iframe.instgrm.Embeds) {
      iframe.instgrm.Embeds.process()
    }
  }

  loadJSONP (url, callback, context) {
    let name = '_jsonp_instagramImage_' + InstagramImage.unique++
    if (url.indexOf('?') >= 0) {
      url += '&callback=' + name
    } else {
      url += '?callback=' + name
    }

    let script = document.createElement('script')
    script.type = 'text/javascript'
    script.async = true
    script.src = url

    let clearScript = () => {
      document.getElementsByTagName('head')[ 0 ].removeChild(script)
      script = null
      delete window[ name ]
    }

    let timeout = 10 // 10 second by default
    let timeoutTrigger = window.setTimeout(() => {
      clearScript()
    }, timeout * 1000)

    window[ name ] = function (data) {
      window.clearTimeout(timeoutTrigger)
      callback.call((context || window), data)
      clearScript()
    }

    document.getElementsByTagName('head')[ 0 ].appendChild(script)
  }

  insertInstagram (url, includeCaption) {
    if (url.match('instagram-media')) {
      this.updateInstagramHtml(url)
    } else {
      let createdUrl = 'https://api.instagram.com/oembed/?url=' + url + '&hidecaption=' + !includeCaption
      this.loadJSONP(
        createdUrl,
        (data) => {
          this.updateInstagramHtml(data.html)
          this.props.api.request('layout:rendered', true)
        }
      )
    }
  }

  render () {
    let { id, atts, editor } = this.props
    let { customClass, width, alignment, metaCustomId } = atts
    let classes = 'vce-instagram-image'
    let wrapperClasses = 'vce-instagram-image-wrapper vce'
    let customProps = {}
    let innerClasses = 'vce-instagram-image-inner'
    let innerCustomProps = {}

    if (typeof customClass === 'string' && customClass) {
      classes += ' ' + customClass
    }

    if (width) {
      innerCustomProps.style = this.state ? this.state.size : null
    }

    if (alignment) {
      classes += ` vce-instagram-image--align-${alignment}`
    }

    customProps.key = `customProps:${id}`

    if (metaCustomId) {
      customProps.id = metaCustomId
    }

    let doAll = this.applyDO('all')

    return <div {...customProps} className={classes} {...editor}>
      <div className={wrapperClasses} id={'el-' + id} {...doAll}>
        <div className={innerClasses} {...innerCustomProps} />
      </div>
    </div>
  }
}

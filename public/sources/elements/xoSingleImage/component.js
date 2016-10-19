/* global React, vcvAPI */
/*eslint no-unused-vars: 0*/
class Component extends vcvAPI.elementComponent {
  componentDidMount () {
    if (this.props.atts.shape && this.props.atts.shape === 'round') {
      this.setMaxWidthState(this.props.atts.image)
    }
  }
  componentWillReceiveProps (nextProps) {
    if (nextProps.atts.shape && nextProps.atts.shape === 'round') {
      this.setMaxWidthState(nextProps.atts.image)
    } else {
      this.setState({
        imgSize: null
      })
    }
  }
  render () {
    let {id, atts, editor} = this.props
    let {image, shape, clickableOptions, imageUrl, customClass} = atts
    let containerClasses = 'vce-single-image-container vce'
    let classes = 'vce-single-image'
    let customProps = {}
    let CustomTag = 'div'

    var imgSrc = this.getImageUrl(image)
    if (typeof customClass === 'string' && customClass) {
      classes += ' ' + customClass
    }
    if (clickableOptions === 'url') {
      CustomTag = 'a'
      let { url, title, targetBlank, relNofollow } = imageUrl
      customProps = {
        'href': url,
        'title': title,
        'target': targetBlank ? '_blank' : undefined,
        'rel': relNofollow ? 'nofollow' : undefined
      }
    } else if (clickableOptions === 'imageNewTab') {
      CustomTag = 'a'
      customProps = {
        'href': imgSrc,
        'target': '_blank'
      }
    } else if (clickableOptions === 'lightbox') {
      CustomTag = 'a'
      customProps = {
        'href': imgSrc,
        'data-lightbox': `lightbox-${id}`
      }
    } else if (clickableOptions === 'zoom') {
      classes += ' vcv-single-image-zoom-container'
    }

    if (shape && shape !== 'square') {
      classes += ` vce-single-image--border-${shape}`

      if (shape === 'round') {
        customProps.style = this.state ? this.state.imgSize : null
      }
    }
    customProps.key = `customProps:${id}-${imgSrc}-${clickableOptions}-${shape}`
    return <div className={containerClasses} id={'el-' + id} {...editor}>
      <CustomTag {...customProps} className={classes}>
        <img className='vce-single-image' src={imgSrc} />
      </CustomTag>
    </div>
  }

  setMaxWidthState (image) {
    let img = new window.Image()
    img.onload = () => {
      let size = img.height >= img.width ? img.width : img.height
      this.setState({imgSize: {
        maxWidth: size,
        backgroundImage: 'url(' + img.src + ')'
      }})
    }
    img.onerror =() => {
      this.setState({imgSize: null})
    }
    img.src = this.getImageUrl(image)
  }
  getPublicImage (filename) {
    const vcCake = require('vc-cake')
    const assetsManager = vcCake.getService('assets-manager')
    var {tag} = this.props.atts
    return assetsManager.getPublicPath(tag, filename)
  }
  getImageUrl (image) {
    let imageUrl
    // Move it to attribute
    if (image && image.full) {
      imageUrl = image.full
    } else {
      imageUrl = this.getPublicImage(image)
    }
    return imageUrl
  }
}

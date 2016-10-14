let containerClasses = 'vce-single-image-container vce'
let classes = 'vce-single-image-inner'
let customProps = {}
let CustomTag = 'div'

// todo how to get unique key every time, when render happens?
let count = new Date().getTime()

if (typeof customClass === 'string' && customClass) {
  classes += ' ' + customClass
}

var imgSrc = image
let vcCake = require('vc-cake')
const cook = vcCake.getService('cook')
let cookElement = cook.get(atts)
const AssetsManager = vcCake.getService('assets-manager')

if (typeof imgSrc !== 'string' && typeof imgSrc.urls[ 0 ] !== 'undefined') {
  imgSrc = imgSrc.urls[ 0 ].full
} else {
  imgSrc = AssetsManager.getPublicPath(cookElement.get('tag'), cookElement.get('image'))
}

var setRoundImage = () => {
  var img = new Image()
  let _this = this
  img.onload = function () {
    let imgSize = {}
    let size = this.height >= this.width ? this.width : this.height
    imgSize = {
      maxWidth: size,
      backgroundImage: 'url(' + imgSrc + ')'
    }

    if (!_this.state || !_this.state.imgSize || _this.state.imgSize.backgroundImage !== imgSize.backgroundImage) {
      _this.setState({ imgSize: imgSize })
    }
  }
  img.src = imgSrc
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
    'data-lightbox': `lightbox-${this.props.id}`
  }
} else if (clickableOptions === 'zoom') {
  classes += ' vcv-single-image-zoom-container'
}

if (shape && shape !== 'square') {
  classes += ` vce-single-image--border-${shape}`

  if (shape === 'round') {
    setRoundImage()

    customProps.style = this.state ? this.state.imgSize : null
  }
}

customProps.key = `customProps:${this.props.id}-${imgSrc}-${clickableOptions}-${shape}`
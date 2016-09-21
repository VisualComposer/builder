export default {
  devices: {
    'mobile-portrait': {
      min: '0',
      max: '543px' // mobile-landscape.min - 1
    },
    'mobile-landscape': {
      min: '544px',
      max: '767px' // tablet-portrait.min - 1
    },
    'tablet-portrait': {
      min: '768px',
      max: '991px' // tablet-landscape.min - 1
    },
    'tablet-landscape': {
      min: '992px',
      max: '1199px' // desktop.min - 1
    },
    'desktop': {
      min: '1200px',
      max: null
    }
  },
  getDevices () {
    return this.devices
  },
  getDeviceCss (device, data) {
    let cssObj = {}
    let tempProperty = null
    let tempValue = null

    // get background color
    if (data[ device ].backgroundColor !== '') {
      cssObj[ 'background-color' ] = data[ device ].backgroundColor
    }
    // get background images
    if (data[ device ].backgroundImage.urls.length) {
      tempProperty = 'background-image'
      tempValue = []
      for (let url of data[ device ].backgroundImage.urls) {
        tempValue.push('url(' + url.full + ')')
      }
      tempValue = tempValue.join(',')
    }
    if (tempProperty && tempValue) {
      cssObj[ tempProperty ] = tempValue
    }
    // get background style
    switch (data[ device ].backgroundStyle) {
      case 'cover':
        tempProperty = 'background-size'
        tempValue = 'cover'
        break
      case 'contain':
        tempProperty = 'background-size'
        tempValue = 'contain'
        break
      case 'no-repeat':
        tempProperty = 'background-repeat'
        tempValue = 'no-repeat'
        break
      case 'repeat':
        tempProperty = 'background-repeat'
        tempValue = 'repeat'
        break
      default:
        tempProperty = null
        tempValue = null
        break
    }
    if (tempProperty && tempValue) {
      cssObj[ tempProperty ] = tempValue
    }
    // get borders
    if (data[ device ].borderTop !== '') {
      cssObj[ 'border-top-width' ] = (parseFloat(data[ device ].borderTop).toString() === data[ device ].borderTop) ? data[ device ].borderTop + 'px' : data[ device ].borderTop
    }
    if (data[ device ].borderRight !== '') {
      cssObj[ 'border-right-width' ] = (parseFloat(data[ device ].borderRight).toString() === data[ device ].borderRight) ? data[ device ].borderRight + 'px' : data[ device ].borderRight
    }
    if (data[ device ].borderBottom !== '') {
      cssObj[ 'border-bottom-width' ] = (parseFloat(data[ device ].borderBottom).toString() === data[ device ].borderBottom) ? data[ device ].borderBottom + 'px' : data[ device ].borderBottom
    }
    if (data[ device ].borderLeft !== '') {
      cssObj[ 'border-left-width' ] = (parseFloat(data[ device ].borderLeft).toString() === data[ device ].borderLeft) ? data[ device ].borderLeft + 'px' : data[ device ].borderLeft
    }

    // get border color
    if (data[ device ].borderColor !== '') {
      if (data[ device ].borderTop !== '') {
        cssObj[ 'border-top-color' ] = data[ device ].borderColor
      }
      if (data[ device ].borderRight !== '') {
        cssObj[ 'border-right-color' ] = data[ device ].borderColor
      }
      if (data[ device ].borderBottom !== '') {
        cssObj[ 'border-bottom-color' ] = data[ device ].borderColor
      }
      if (data[ device ].borderLeft !== '') {
        cssObj[ 'border-left-color' ] = data[ device ].borderColor
      }
    }

    // get border style
    if (data[ device ].borderStyle !== '') {
      if (data[ device ].borderTop !== '') {
        cssObj[ 'border-top-style' ] = data[ device ].borderStyle
      }
      if (data[ device ].borderRight !== '') {
        cssObj[ 'border-right-style' ] = data[ device ].borderStyle
      }
      if (data[ device ].borderBottom !== '') {
        cssObj[ 'border-bottom-style' ] = data[ device ].borderStyle
      }
      if (data[ device ].borderLeft !== '') {
        cssObj[ 'border-left-style' ] = data[ device ].borderStyle
      }
    }

    // get border radius
    if (data[ device ].borderTopRightRadius !== '') {
      cssObj[ 'border-top-right-radius' ] = (parseFloat(data[ device ].borderTopRightRadius).toString() === data[ device ].borderTopRightRadius) ? data[ device ].borderTopRightRadius + 'px' : data[ device ].borderTopRightRadius
    }
    if (data[ device ].borderBottomRightRadius !== '') {
      cssObj[ 'border-bottom-right-radius' ] = (parseFloat(data[ device ].borderBottomRightRadius).toString() === data[ device ].borderBottomRightRadius) ? data[ device ].borderBottomRightRadius + 'px' : data[ device ].borderBottomRightRadius
    }
    if (data[ device ].borderBottomLeftRadius !== '') {
      cssObj[ 'border-bottom-left-radius' ] = (parseFloat(data[ device ].borderBottomLeftRadius).toString() === data[ device ].borderBottomLeftRadius) ? data[ device ].borderBottomLeftRadius + 'px' : data[ device ].borderBottomLeftRadius
    }
    if (data[ device ].borderTopLeftRadius !== '') {
      cssObj[ 'border-top-left-radius' ] = (parseFloat(data[ device ].borderTopLeftRadius).toString() === data[ device ].borderTopLeftRadius) ? data[ device ].borderTopLeftRadius + 'px' : data[ device ].borderTopLeftRadius
    }
    // get margin
    if (data[ device ].marginTop !== '') {
      cssObj[ 'margin-top' ] = (parseFloat(data[ device ].marginTop).toString() === data[ device ].marginTop) ? data[ device ].marginTop + 'px' : data[ device ].marginTop
    }
    if (data[ device ].marginRight !== '') {
      cssObj[ 'margin-right' ] = (parseFloat(data[ device ].marginRight).toString() === data[ device ].marginRight) ? data[ device ].marginRight + 'px' : data[ device ].marginRight
    }
    if (data[ device ].marginBottom !== '') {
      cssObj[ 'margin-bottom' ] = (parseFloat(data[ device ].marginBottom).toString() === data[ device ].marginBottom) ? data[ device ].marginBottom + 'px' : data[ device ].marginBottom
    }
    if (data[ device ].marginLeft !== '') {
      cssObj[ 'margin-left' ] = (parseFloat(data[ device ].marginLeft).toString() === data[ device ].marginLeft) ? data[ device ].marginLeft + 'px' : data[ device ].marginLeft
    }
    // get padding
    if (data[ device ].paddingTop !== '') {
      cssObj[ 'padding-top' ] = (parseFloat(data[ device ].paddingTop).toString() === data[ device ].paddingTop) ? data[ device ].paddingTop + 'px' : data[ device ].paddingTop
    }
    if (data[ device ].paddingRight !== '') {
      cssObj[ 'padding-right' ] = (parseFloat(data[ device ].paddingRight).toString() === data[ device ].paddingRight) ? data[ device ].paddingRight + 'px' : data[ device ].paddingRight
    }
    if (data[ device ].paddingBottom !== '') {
      cssObj[ 'padding-bottom' ] = (parseFloat(data[ device ].paddingBottom).toString() === data[ device ].paddingBottom) ? data[ device ].paddingBottom + 'px' : data[ device ].paddingBottom
    }
    if (data[ device ].paddingLeft !== '') {
      cssObj[ 'padding-left' ] = (parseFloat(data[ device ].paddingLeft).toString() === data[ device ].paddingLeft) ? data[ device ].paddingLeft + 'px' : data[ device ].paddingLeft
    }

    if (!data[ device ].showOnDevice) {
      cssObj = { 'display': 'none' }
    }

    let css = ''
    for (let prop in cssObj) {
      css += prop + ':' + cssObj[ prop ] + ';'
    }

    return ('#el-' + data.id + '{' + css + '}')
  },
  getCss (id, data) {
    data.id = id
    if (data.deviceTypes === 'all') {
      return this.getDeviceCss('all', data)
    }

    let css = []
    let devices = this.getDevices()
    for (let device in devices) {
      css.push('@media (--' + device + ') { ' + this.getDeviceCss(device, data) + ' }')
    }
    return css.join(' ')
  }
}


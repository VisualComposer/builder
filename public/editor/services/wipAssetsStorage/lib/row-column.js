export default {
  devices: {
    'xs': {
      min: '0',
      max: '543px' // mobile-landscape.min - 1
    },
    'sm': {
      min: '544px',
      max: '767px' // tablet-portrait.min - 1
    },
    'md': {
      min: '768px',
      max: '991px' // tablet-landscape.min - 1
    },
    'lg': {
      min: '992px',
      max: '1199px' // desktop.min - 1
    },
    'xl': {
      min: '1200px',
      max: null
    }
  },
  getDevices () {
    return this.devices
  },
  getDeviceCss (device, data) {
    let deviceCss = []

    for (let key in data) {
      let cssObj = {}
      // get background color
      cssObj[ 'flex-grow' ] = 0
      cssObj[ 'flex-shrink' ] = 0
      cssObj[ 'flex-basis' ] = 'calc(100% * ( ' + data[ key ].numerator + ' / ' + data[ key ].denominator + ' ))'
      cssObj[ 'max-width' ] = 'calc(100% * ( ' + data[ key ].numerator + ' / ' + data[ key ].denominator + ' ))'
      let css = ''
      for (let prop in cssObj) {
        css += prop + ':' + cssObj[ prop ] + ';'
      }
      deviceCss.push('.vce-col--' + device + '-' + data[ key ].numerator + '-' + data[ key ].denominator + '{' + css + '}')
    }
    return deviceCss.join(' ')
  },
  getCss (data) {
    let css = []
    let devices = this.getDevices()
    for (let device in devices) {
      css.push('@media (--' + device + ') { ' + this.getDeviceCss(device, data) + ' }')
    }
    return css.join(' ')
  }
}


import lodash from 'lodash'
import {getService} from 'vc-cake'

const {getBlockRegexp} = getService('utils')
const blockRegexp = getBlockRegexp()

interface Options {
  backgroundType: string,
  borderStyle: string,
  backgroundColor: string,
  backgroundStyle: string,
  backgroundPosition: string,
  backgroundZoom: string,
  backgroundZoomSpeed: string,
  backgroundZoomReverse: boolean,
  gradientAngle: number,
  gradientOverlay: boolean,
  gradientType: string,
  sliderEffect: string,
  gradientStartColor: string,
  gradientEndColor: string,
  animationDelay: any,
  boxModel: { [index: string]: any }
}

interface DeviceObject {
  all?: Options,
  xl?: Options,
  lg?: Options,
  md?: Options,
  sm?: Options,
  xs?: Options
}

interface FieldValue {
  device: DeviceObject
}

interface ComponentState {
  currentDevice: string,
  devices: {
    [index: string]: Options
  }
}

interface Mixin {
  variables: {
    [index: string]: any,
    selector: {
      value: string
    },
    device: {
      value: string
    },
    animationDelay: {
      value: any
    }
    angle: {
      value: number
    }
    startColor: {
      value: string
    },
    endColor: {
      value: string
    }
    backgroundColor: {
      value: string
    }
  }
}

interface Mixins {
  [index: string]: Mixin
}

export const deviceDefaults = {
  backgroundType: 'imagesSimple',
  borderStyle: 'solid',
  backgroundColor: '',
  backgroundStyle: 'cover',
  backgroundPosition: 'center-top',
  backgroundZoom: 50,
  backgroundZoomSpeed: 30,
  backgroundZoomReverse: false,
  gradientOverlay: false,
  gradientType: 'linear',
  gradientAngle: 45,
  sliderEffect: 'slide',
  gradientStartColor: 'rgba(226, 135, 135, 0.5)',
  gradientEndColor: 'rgba(93, 55, 216, 0.5)',
  animationDelay: '',
  boxModel: {}
}

export const defaultState = {
  currentDevice: 'all',
  devices: {},
  defaultStyles: null,
  lazyLoad: true
}

const attributeMixins = {
  boxModelMixin: {
    src: require('raw-loader!./cssMixins/boxModel.pcss'),
    variables: {
      device: {
        value: false
      },
      margin: {
        value: false
      },
      padding: {
        value: false
      },
      borderWidth: {
        value: false
      },
      borderRadius: {
        value: false
      },
      borderBottomLeftRadius: {
        value: false
      },
      borderBottomRightRadius: {
        value: false
      },
      borderBottomWidth: {
        value: false
      },
      borderLeftWidth: {
        value: false
      },
      borderRightWidth: {
        value: false
      },
      borderTopLeftRadius: {
        value: false
      },
      borderTopRightRadius: {
        value: false
      },
      borderTopWidth: {
        value: false
      },
      marginBottom: {
        value: false
      },
      marginLeft: {
        value: false
      },
      marginRight: {
        value: false
      },
      marginTop: {
        value: false
      },
      paddingBottom: {
        value: false
      },
      paddingLeft: {
        value: false
      },
      paddingRight: {
        value: false
      },
      paddingTop: {
        value: false
      },
      borderStyle: {
        value: false
      },
      borderTopStyle: {
        value: false
      },
      borderRightStyle: {
        value: false
      },
      borderBottomStyle: {
        value: false
      },
      borderLeftStyle: {
        value: false
      },
      borderColor: {
        value: false
      },
      borderTopColor: {
        value: false
      },
      borderRightColor: {
        value: false
      },
      borderBottomColor: {
        value: false
      },
      borderLeftColor: {
        value: false
      }
    }
  },
  visibilityMixin: {
    src: require('raw-loader!./cssMixins/visibility.pcss'),
    variables: {
      device: {
        value: 'all'
      }
    }
  },
  backgroundColorMixin: {
    src: require('raw-loader!./cssMixins/backgroundColor.pcss'),
    variables: {
      device: {
        value: 'all'
      },
      backgroundColor: {
        value: false
      }
    }
  },
  gradientMixin: {
    src: require('raw-loader!./cssMixins/gradientColor.pcss'),
    variables: {
      device: {
        value: 'all'
      },
      startColor: {
        value: 'rgba(0, 0, 0, 0)'
      },
      endColor: {
        value: 'rgba(0, 0, 0, 0)'
      },
      angle: {
        value: 0
      }
    }
  },
  radialGradientMixin: {
    src: require('raw-loader!./cssMixins/radialGradientColor.pcss'),
    variables: {
      device: {
        value: 'all'
      },
      startColor: {
        value: 'rgba(0, 0, 0, 0)'
      },
      endColor: {
        value: 'rgba(0, 0, 0, 0)'
      }
    }
  },
  dividerMixin: {
    src: require('raw-loader!./cssMixins/divider.pcss'),
    variables: {
      device: {
        value: 'all'
      }
    }
  },
  animationDelayMixin: {
    src: require('raw-loader!./cssMixins/animationDelay.pcss'),
    variables: {
      device: {
        value: 'all'
      },
      animationDelay: {
        value: false
      }
    }
  }
}

export const getCustomDevices = () => {
  return [
    {
      label: 'Desktop',
      value: 'xl',
      icon: 'vcv-ui-icon-desktop'
    },
    {
      label: 'Tablet Landscape',
      value: 'lg',
      icon: 'vcv-ui-icon-tablet-landscape'
    },
    {
      label: 'Tablet Portrait',
      value: 'md',
      icon: 'vcv-ui-icon-tablet-portrait'
    },
    {
      label: 'Mobile Landscape',
      value: 'sm',
      icon: 'vcv-ui-icon-mobile-landscape'
    },
    {
      label: 'Mobile Portrait',
      value: 'xs',
      icon: 'vcv-ui-icon-mobile-portrait'
    }
  ]
}

export const getCustomDevicesKeys = () => {
  return getCustomDevices().map((device) => {
    return device.value
  })
}

const parseValue = (value: FieldValue) => {
  // set default values
  const newState = lodash.defaultsDeep({}, defaultState)
  // get devices data
  const devices = getCustomDevicesKeys()
  // set current device
  if (!lodash.isEmpty(value.device)) {
    newState.currentDevice = Object.keys(value.device).shift()
  }
  // update devices values
  devices.push('all')
  devices.forEach((device: string) => {
    newState.devices[device] = lodash.defaultsDeep({}, deviceDefaults)
    const deviceValue = value.device && value.device[device as keyof DeviceObject]
    if (deviceValue) {
      newState.devices[device] = lodash.defaultsDeep({}, deviceValue, newState.devices[device])
    }
  })

  return newState
}

export const getUpdatedState = (props: { value: FieldValue }) => {
  let newState = {}
  // data came from props if there is set value
  if (props.value) {
    newState = parseValue(props.value)
  } else {
    // data came from state update
    newState = lodash.defaultsDeep({}, props, defaultState)
  }
  return newState
}

export const getUpdatedValues = (newState: ComponentState) => {
  const newValue: { [index: string]: any } = {}
  let newMixins = {}

  // save only needed data
  let checkDevices = new Array<string>()
  if (newState.currentDevice === 'all') {
    checkDevices.push('all')
  } else {
    checkDevices = checkDevices.concat(getCustomDevicesKeys())
  }
  checkDevices.forEach((device) => {
    if (!lodash.isEmpty(newState.devices[device])) {
      // set default values
      if (!newState.devices[device].backgroundType) {
        newState.devices[device].backgroundType = deviceDefaults.backgroundType
      }
      if (!newState.devices[device].borderStyle) {
        newState.devices[device].borderStyle = deviceDefaults.borderStyle
      }
      if (!newState.devices[device].backgroundStyle) {
        newState.devices[device].backgroundStyle = deviceDefaults.backgroundStyle
      }
      if (!newState.devices[device].backgroundPosition) {
        newState.devices[device].backgroundPosition = deviceDefaults.backgroundPosition
      }

      if (typeof newState.devices[device].gradientAngle === 'undefined') {
        newState.devices[device].gradientAngle = deviceDefaults.gradientAngle
      }

      newValue[device] = lodash.defaultsDeep({}, newState.devices[device])

      // remove all values if display is provided
      if (Object.prototype.hasOwnProperty.call(newValue[device], 'display')) {
        Object.keys(newValue[device]).forEach((style) => {
          if (style !== 'display') {
            delete newValue[device][style]
          }
        })
      } else {
        // Image type backgrounds
        const imgTypeBackgrounds = [
          'imagesSimple',
          'backgroundZoom',
          'imagesSlideshow'
        ]
        if (imgTypeBackgrounds.indexOf(newState.devices[device].backgroundType) === -1) {
          // not image type background selected
          delete newValue[device].images
          delete newValue[device].backgroundStyle
          delete newValue[device].backgroundPosition
          delete newValue[device].backgroundZoom
          delete newValue[device].backgroundZoomSpeed
          delete newValue[device].backgroundZoomReverse
        } else if (!Object.prototype.hasOwnProperty.call(newValue[device], 'images')) {
          // images are empty
          delete newValue[device].images
          delete newValue[device].backgroundType
          delete newValue[device].backgroundStyle
          delete newValue[device].sliderTimeout
          delete newValue[device].sliderDirection
          delete newValue[device].sliderEffect
          delete newValue[device].backgroundPosition
          delete newValue[device].backgroundZoom
          delete newValue[device].backgroundZoomSpeed
          delete newValue[device].backgroundZoomReverse
        } else {
          const images = newValue[device].images
          const isArray = images ? images.constructor === Array : false
          const imageValue = images && images.urls && images.urls[0] ? images.urls[0].full : false
          const isDynamic = imageValue && typeof imageValue === 'string' && imageValue.match(blockRegexp)

          if (!isDynamic && ((isArray && images.length === 0) || (!isArray && (!images.urls || images.urls.length === 0)))) {
            delete newValue[device].images
            delete newValue[device].backgroundType
            delete newValue[device].backgroundStyle
            delete newValue[device].sliderTimeout
            delete newValue[device].sliderDirection
            delete newValue[device].sliderEffect
            delete newValue[device].backgroundPosition
            delete newValue[device].backgroundZoom
            delete newValue[device].backgroundZoomSpeed
            delete newValue[device].backgroundZoomReverse
          }
        }

        if (newValue[device].images) {
          if (newValue[device].lazyLoad === undefined) {
            newValue[device].lazyLoad = true
          }
        } else {
          if (newValue[device].lazyLoad !== undefined) {
            delete newValue[device].lazyLoad
          }
        }

        // Embed video bg
        const embedVideoTypeBackgrounds = [
          'videoEmbed'
        ]

        if (embedVideoTypeBackgrounds.indexOf(newState.devices[device].backgroundType) === -1) {
          // not image type background selected
          delete newValue[device].videoEmbed
        } else {
          if (Object.prototype.hasOwnProperty.call(newValue[device], 'videoEmbed')) {
            const videos = newValue[device].videoEmbed
            const isArray = videos.constructor === Array
            if ((isArray && videos.length === 0) || (!isArray && (!videos.urls || videos.urls.length === 0))) {
              delete newValue[device].videoEmbed
              delete newValue[device].backgroundType
            }
          } else {
            delete newValue[device].videoEmbed
            delete newValue[device].backgroundType
          }
        }

        // slider timeout is empty
        if (newValue[device].sliderTimeout === '' || newValue[device].backgroundType !== 'imagesSlideshow') {
          delete newValue[device].sliderTimeout
        }
        if (newValue[device].sliderEffect === '' || newValue[device].backgroundType !== 'imagesSlideshow') {
          delete newValue[device].sliderEffect
        }
        if (newValue[device].sliderDirection === '' || newValue[device].backgroundType !== 'imagesSlideshow' || newValue[device].sliderEffect !== 'carousel') {
          delete newValue[device].sliderDirection
        }

        // youtube video is empty
        if (newValue[device].backgroundType === 'videoYoutube') {
          if (!newValue[device].videoYoutube) {
            delete newValue[device].videoYoutube
            delete newValue[device].backgroundType
          }
        } else {
          delete newValue[device].videoYoutube
        }

        // vimeo video is empty
        if (newValue[device].backgroundType === 'videoVimeo') {
          if (!newValue[device].videoVimeo) {
            delete newValue[device].videoVimeo
            delete newValue[device].backgroundType
          }
        } else {
          delete newValue[device].videoVimeo
        }

        // gradient stat color is empty
        if (newValue[device].gradientStartColor === '') {
          delete newValue[device].gradientStartColor
        }

        // gradient end color is empty
        if (newValue[device].gradientEndColor === '') {
          delete newValue[device].gradientEndColor
        }

        // gradient overlay is not set
        if (!newValue[device].gradientOverlay) {
          delete newValue[device].gradientAngle
          delete newValue[device].gradientEndColor
          delete newValue[device].gradientStartColor
        }

        if (newValue[device].gradientOverlay && newValue[device].gradientType !== 'linear') {
          delete newValue[device].gradientAngle
        }

        // background color is empty
        if (newValue[device].backgroundColor === '') {
          delete newValue[device].backgroundColor
        }

        // animation is not set
        if (newValue[device].animation === '') {
          delete newValue[device].animation
          delete newValue[device].animationDelay
        }
        if (newValue[device].animationDelay === '') {
          delete newValue[device].animationDelay
        }

        // border is empty
        if (newValue[device].borderColor === '') {
          delete newValue[device].borderColor
        }
        if (newValue[device].borderStyle === '') {
          delete newValue[device].borderStyle
        }
        if (!newValue[device].boxModel || !(newValue[device].boxModel.borderBottomWidth || newValue[device].boxModel.borderLeftWidth || newValue[device].boxModel.borderRightWidth || newValue[device].boxModel.borderTopWidth || newValue[device].boxModel.borderWidth)) {
          delete newValue[device].borderStyle
          delete newValue[device].borderColor
        }
      }
      const deviceMixins = getMixins(newValue, device)
      newMixins = {...newMixins, ...deviceMixins}

      // remove device from list if it's empty
      if (!Object.keys(newValue[device]).length) {
        delete newValue[device]
      }
    }
  })

  return {newValue, newMixins}
}

const addPixelToNumber = (number: any) => {
  return /^\d+$/.test(number) ? `${number}px` : number
}

const getAnimationDelayMixin = (newValue: { [index: string]: Options }, device: string) => {
  const returnMixins: { [index: string]: Mixin } = {}

  if (Object.prototype.hasOwnProperty.call(newValue[device], 'animationDelay')) {
    const value = newValue[device].animationDelay
    if (!lodash.isEmpty(value)) {
      const mixinName = `animationDelayMixin:${device}`
      const animationMixin: Mixin = lodash.defaultsDeep({}, attributeMixins.animationDelayMixin)

      animationMixin.variables.animationDelay = {value: value}

      const selector = `vce-o-animate-delay--${value}`
      animationMixin.variables.selector = {
        value: device === 'all' ? selector : selector + `-${device}`
      }

      animationMixin.variables.device = {value: device}

      returnMixins[mixinName] = animationMixin
    }
  }
  return returnMixins
}

const getBackgroundMixin = (newValue: { [index: string]: Options }, device: string) => {
  const returnMixins: { [index: string]: Mixin } = {}

  if (newValue[device] && newValue[device].backgroundColor) {
    const mixinName = `backgroundColorMixin:${device}`
    const backgroundMixin: Mixin = lodash.defaultsDeep({}, attributeMixins.backgroundColorMixin)
    backgroundMixin.variables.backgroundColor = {
      value: newValue[device].backgroundColor
    }
    backgroundMixin.variables.device = {
      value: device
    }
    returnMixins[mixinName] = backgroundMixin
  }

  return returnMixins
}

const getBoxModelMixin = (newValue: { [index: string]: Options }, device: string) => {
  const returnMixins: { [index: string]: Mixin } = {}
  if (Object.prototype.hasOwnProperty.call(newValue[device], 'boxModel')) {
    const value: { [index: string]: any } = newValue[device].boxModel

    if (!lodash.isEmpty(value)) {
      const mixinName = `boxModelMixin:${device}`
      const boxModelMixin: Mixin = lodash.defaultsDeep({}, attributeMixins.boxModelMixin)
      const syncData: { [index: string]: { key: string, value: string }[] } = {
        borderWidth: [{key: 'borderStyle', value: 'borderStyle'}, {key: 'borderColor', value: 'borderColor'}],
        borderTopWidth: [{key: 'borderTopStyle', value: 'borderStyle'}, {key: 'borderTopColor', value: 'borderColor'}],
        borderRightWidth: [{
          key: 'borderRightStyle',
          value: 'borderStyle'
        }, {
          key: 'borderRightColor',
          value: 'borderColor'
        }],
        borderBottomWidth: [{key: 'borderBottomStyle', value: 'borderStyle'}, {
          key: 'borderBottomColor',
          value: 'borderColor'
        }],
          borderLeftWidth: [{key: 'borderLeftStyle', value: 'borderStyle'}, {
          key: 'borderLeftColor',
          value: 'borderColor'
        }]
      }

      Object.keys(value).forEach((property) => {
        boxModelMixin.variables[property] = {
          value: addPixelToNumber(value[property])
        }

        if (syncData[property]) {
          syncData[property].forEach((syncProp) => {
            const propVal = newValue[device][syncProp.value as keyof Options] || false
            boxModelMixin.variables[syncProp.key] = {
              value: addPixelToNumber(propVal)
            }
          })
        }
      })

      // devices
      boxModelMixin.variables.device = {
        value: device
      }
      returnMixins[mixinName] = boxModelMixin
    }
  }

  return returnMixins
}

const getGradientMixin = (newValue: { [index: string]: Options }, device: string) => {
  const returnMixins: { [index: string]: Mixin } = {}

  if (newValue[device]?.gradientOverlay) {
    const mixinName = `gradientMixin:${device}`
    const isRadial = newValue[device].gradientType === 'radial'
    const gradientMixin: Mixin = lodash.defaultsDeep({}, isRadial ? attributeMixins.radialGradientMixin : attributeMixins.gradientMixin)

    if (!isRadial) {
      gradientMixin.variables.angle = {
        value: newValue[device].gradientAngle || 0
      }
    }

    if (newValue[device].gradientStartColor) {
      gradientMixin.variables.startColor = {
        value: newValue[device].gradientStartColor
      }
    }
    if (newValue[device].gradientEndColor) {
      gradientMixin.variables.endColor = {
        value: newValue[device].gradientEndColor
      }
    }
    gradientMixin.variables.device = {
      value: device
    }
    returnMixins[mixinName] = gradientMixin
  }

  return returnMixins
}

const getVisibilityMixin = (newValue: { [index: string]: Options }, device: string) => {
  const returnMixins: { [index: string]: Mixin } = {}
  const visibilityMixin: Mixin = lodash.defaultsDeep({}, attributeMixins.visibilityMixin)
  const visibilityKey = `visibilityMixin:${device}`
  visibilityMixin.variables.device = {
    value: device
  }
  returnMixins[visibilityKey] = visibilityMixin
  return returnMixins
}

const getMixins = (newValue: { [index: string]: Options }, device: string) => {
  let returnMixins: Mixins = {}
  if (Object.prototype.hasOwnProperty.call(newValue[device], 'display')) {
    const visibilityMixin = getVisibilityMixin(newValue, device)
    returnMixins = {...visibilityMixin}
  } else {
    const boxModelMixin = getBoxModelMixin(newValue, device)
    const backgroundMixin = getBackgroundMixin(newValue, device)
    const gradientMixin = getGradientMixin(newValue, device)
    const animationMixin = getAnimationDelayMixin(newValue, device)

    returnMixins = {...boxModelMixin, ...backgroundMixin, ...gradientMixin, ...animationMixin}
  }
  return returnMixins
}

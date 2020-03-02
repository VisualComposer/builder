/* eslint-disable import/no-webpack-loader-syntax */
import { getService } from 'vc-cake'
import ColumnElement from './component'
import lodash from 'lodash'

const vcvAddElement = getService('cook').add

vcvAddElement(
  require('./settings.json'),
  // Component callback
  function (component) {
    //
    component.add(ColumnElement)
  },
  // css settings // css for element
  {
    css: require('raw-loader!./styles.css'),
    editorCss: require('raw-loader!./editor.css')
  },
  (attr) => {
    // BC for devices
    const { size, lastInRow, firstInRow, designOptionsAdvanced } = attr
    if (size && typeof size !== 'object') {
      attr.size = { all: size, defaultSize: size }
    } else if (size === '') {
      attr.size = {}
    }
    if (lastInRow && typeof lastInRow !== 'object') {
      attr.lastInRow = { all: lastInRow }
    } else if (lastInRow === '') {
      attr.lastInRow = {}
    }
    if (firstInRow && typeof firstInRow !== 'object') {
      attr.firstInRow = { all: firstInRow }
    } else if (firstInRow === '') {
      attr.firstInRow = {}
    }

    // Move parallax settings to new attribute
    if (designOptionsAdvanced && designOptionsAdvanced.device) {
      const newParallaxData = {}
      const newDesignOptionsData = {}
      Object.keys(designOptionsAdvanced.device).forEach((deviceKey) => {
        const deviceData = designOptionsAdvanced.device[deviceKey]
        const newDeviceData = Object.assign({}, deviceData)

        if (deviceData.parallax) {
          const parallaxData = {
            parallaxEnable: true,
            parallax: deviceData.parallax
          }
          if (Object.prototype.hasOwnProperty.call(deviceData, 'parallaxReverse')) {
            parallaxData.parallaxReverse = deviceData.parallaxReverse
          }
          if (Object.prototype.hasOwnProperty.call(deviceData, 'parallaxSpeed')) {
            parallaxData.parallaxSpeed = deviceData.parallaxSpeed
          }
          newParallaxData[deviceKey] = parallaxData

          delete newDeviceData.parallax
          delete newDeviceData.parallaxReverse
          delete newDeviceData.parallaxSpeed

          newDesignOptionsData[deviceKey] = newDeviceData
        }
      })

      if (!lodash.isEmpty(newParallaxData)) {
        attr.parallax = { device: newParallaxData }
        const newDesignOptions = Object.assign({}, designOptionsAdvanced)
        newDesignOptions.device = newDesignOptionsData
        attr.designOptionsAdvanced = newDesignOptions
      }
    }

    return attr
  }
)

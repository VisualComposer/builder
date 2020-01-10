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
    if (typeof size !== 'object') {
      attr.size = { all: size, defaultSize: size }
    }
    if (typeof lastInRow !== 'object') {
      attr.lastInRow = { all: lastInRow }
    }
    if (typeof firstInRow !== 'object') {
      attr.firstInRow = { all: firstInRow }
    }

    // Move parallax settings to new attribute
    if (designOptionsAdvanced && designOptionsAdvanced.device) {
      let newParallaxData = {}
      let newDesignOptionsData = {}
      Object.keys(designOptionsAdvanced.device).forEach((deviceKey) => {
        const deviceData = designOptionsAdvanced.device[ deviceKey ]
        let newDeviceData = Object.assign({}, deviceData)

        if (deviceData.parallax) {
          let parallaxData = {
            parallaxEnable: true,
            parallax: deviceData.parallax
          }
          if (deviceData.hasOwnProperty('parallaxReverse')) {
            parallaxData.parallaxReverse = deviceData.parallaxReverse
          }
          if (deviceData.hasOwnProperty('parallaxSpeed')) {
            parallaxData.parallaxSpeed = deviceData.parallaxSpeed
          }
          newParallaxData[ deviceKey ] = parallaxData

          delete newDeviceData.parallax
          delete newDeviceData.parallaxReverse
          delete newDeviceData.parallaxSpeed

          newDesignOptionsData[ deviceKey ] = newDeviceData
        }
      })

      if (!lodash.isEmpty(newParallaxData)) {
        attr.parallax = { device: newParallaxData }
        let newDesignOptions = Object.assign({}, designOptionsAdvanced)
        newDesignOptions.device = newDesignOptionsData
        attr.designOptionsAdvanced = newDesignOptions
      }
    }

    return attr
  }
)

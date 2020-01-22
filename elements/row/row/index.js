/* eslint-disable import/no-webpack-loader-syntax */
import { getService } from 'vc-cake'
import RowElement from './component'
import lodash from 'lodash'

const vcvAddElement = getService('cook').add

vcvAddElement(
  require('./settings.json'),
  // Component callback
  function (component) {
    component.add(RowElement)
  },
  // css settings // css for element
  {
    css: require('raw-loader!./styles.css'),
    editorCss: false,
    mixins: {
      columnGap: {
        mixin: require('raw-loader!./cssMixins/columnGap.pcss')
      }
    }
  },
  (attr) => {
    const { rowLayout, designOptionsAdvanced } = attr

    if (!rowLayout || Array.isArray(rowLayout)) {
      attr.rowLayout = { all: rowLayout }
    }

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

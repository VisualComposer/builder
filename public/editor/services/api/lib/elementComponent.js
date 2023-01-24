import React from 'react'
import ReactDOM from 'react-dom'
import lodash from 'lodash'
import { env, getService, getStorage } from 'vc-cake'
import YoutubeBackground from './youtubeBackground'
import VimeoBackground from './vimeoBackground'
import ImageSimpleBackground from './imageSimpleBackground'
import ImageBackgroundZoom from './imageBackgroundZoom'
import ImageSlideshowBackground from './imageSlideshowBackground'
import EmbedVideoBackground from './embedVideoBackground'
import ColorGradientBackground from './colorGradientBackground'
import ParallaxBackground from './parallaxBackground'
import Divider from './divider'
import PropTypes from 'prop-types'
import { getResponse } from 'public/tools/response'
import { updateHtmlWithServer, renderInlineHtml } from 'public/tools/updateHtmlWithServer'
import {
  getCssMixinsData,
  getInnerCssMixinsData,
  getMixinsSelector
} from 'public/editor/services/modernAssetsStorage/cssMixins'
import { spinnerHtml } from 'public/tools/spinnerHtml'
import pSBC from 'public/tools/psbc.min.js'

const assetsStorage = getStorage('assets')
const { getBlockRegexp } = getService('utils')
const { getDynamicFieldsData } = getService('cook').dynamicFields
const blockRegexp = getBlockRegexp()
const elementsSettingsStorage = getStorage('elementsSettings')
const dataManager = getService('dataManager')

export default class ElementComponent extends React.Component {
  static propTypes = {
    id: PropTypes.string,
    api: PropTypes.object,
    atts: PropTypes.object,
    editor: PropTypes.object
  }

  constructor (props) {
    super(props)
    this.mixinData = null
    this.updateElementAssets = this.updateElementAssets.bind(this)
  }

  shouldComponentUpdate (nextProps, nextState) {
    if (!nextProps.children && !this.props.children) { // Only general elements without children
      const isStateEqual = lodash.isEqual(this.state, nextState)
      const isRawAttsEqual = lodash.isEqual(this.props.rawAtts, nextProps.rawAtts)

      return !(isStateEqual && isRawAttsEqual)
    }

    return true
  }

  // [gallery ids="318,93"]
  getShortcodesRegexp () {
    return new RegExp('\\[(\\[?)([\\w|-]+\\b)(?![\\w-])([^\\]\\/]*(?:\\/(?!\\])[^\\]\\/]*)*?)(?:(\\/)\\]|\\](?:([^\\[]*(?:\\[(?!\\/\\2\\])[^\\[]*)*)(\\[\\/\\2\\]))?)(\\]?)')
  }

  spinnerHTML () {
    return spinnerHtml
  }

  updateElementAssets (data, source, options) {
    this.updateElementAssetsWithExclusion(this.props.element.id, options)
  }

  updateElementAssetsWithExclusion (id, options, excludedAttributes = []) {
    if (!excludedAttributes.length) {
      assetsStorage.trigger('updateElement', id, options)
    } else if (options && excludedAttributes.indexOf(options.changedAttribute) < 0) {
      assetsStorage.trigger('updateElement', id, options)
    }
  }

  updateShortcodeToHtml (content, ref, cb, action, options) {
    if (ref) {
      updateHtmlWithServer(content, ref, this.props.id, cb, action, options)
    } else if (env('VCV_DEBUG')) {
      console.error('The ref argument in updateShortcodeToHtml method is undefined: ', ref)
    }
  }

  getResponse (result) {
    return getResponse(result)
  }

  updateInlineHtml (ref, html = '', tagString = '') {
    const helper = document.createElement('div')
    ref.innerHTML = this.spinnerHTML()
    if (!tagString) {
      tagString = html
    }
    helper.setAttribute('data-vcvs-html', `${tagString}`)
    helper.classList.add('vcvhelper')
    const id = this.props.id
    const finishCallback = function () {
      ((function (window) {
        window.setTimeout(() => {
          const spinner = ref.querySelector('.vcv-ui-wp-spinner')
          spinner && spinner.remove()
          const freezeReady = dataManager.get('freezeReady')
          freezeReady && freezeReady(id, false)
          window.vcv && window.vcv.trigger('ready', 'update', id)
        }, 500)
      })(env('iframe')))
    }
    renderInlineHtml(html, { headerContent: '', shortcodeContent: html, footerContent: '' }, helper, id, finishCallback)
    ref.appendChild(helper)
  }

  updateInlineScript (elementWrapper, tagString = '') {
    const helper = document.createElement('div')
    elementWrapper.innerHTML = ''
    const scriptHtml = `<script type="text/javascript">${tagString}</script>`
    helper.classList.add('vcvhelper')
    helper.setAttribute('data-vcvs-html', `${scriptHtml}`)
    let script = null
    if (scriptHtml.includes('document.write')) {
      script = document.createElement('span')
      script.innerHTML = 'This script cannot be rendered in the editor because document.write is used in your code. However, it will work on the public and preview page.'
    } else {
      script = document.createElement('script')
      script.type = 'text/javascript'
      const escapedString = escape(tagString)
      script.text = `try{
        eval(unescape('${escapedString}'))
      } catch(e) {console.warn(e);}`
    }

    helper.appendChild(script)
    elementWrapper.appendChild(helper)
  }

  getDomNode () {
    return ReactDOM.findDOMNode(this) // eslint-disable-line
  }

  getBackgroundClass (designOptions) {
    const { device } = designOptions
    const classes = []
    if (device) {
      const { all } = device
      if (all && (all.backgroundColor !== undefined || typeof all.images === 'string' || (all.images && all.images.urls && all.images.urls.length))) {
        classes.push('vce-element--has-background')
      } else {
        for (const currentDevice in device) {
          const deviceData = device[currentDevice]
          if (deviceData && (deviceData.backgroundColor !== undefined || typeof deviceData.images === 'string' || (deviceData.images && deviceData.images.urls && deviceData.images.urls.length))) {
            classes.push(`vce-element--${currentDevice}--has-background`)
          }
        }
      }
    }
    return classes.join(' ')
  }

  applyDO (prop) {
    let propObj = {}

    if (prop === 'all' || prop.indexOf('background') > -1) {
      if (env('VCV_JS_FT_DYNAMIC_FIELDS')) {
        propObj = Object.assign({}, propObj, this.getImageData())
      }

      // Apply lazy load attributes only for Design Options,
      // Design Options Advanced has own separate logic with rendering additional containers
      const designOptions = this.props.atts.designOptions
      if (designOptions && Object.prototype.hasOwnProperty.call(designOptions, 'device')) {
        const doDevices = designOptions.device
        const isLazyLoad = Object.keys(doDevices).find(device => doDevices[device].lazyLoad)

        if (isLazyLoad) {
          let isImagesSet = false
          Object.keys(doDevices).forEach((device) => {
            if (doDevices[device].image && doDevices[device].image.urls && doDevices[device].image.urls[0] && doDevices[device].image.urls[0].full) {
              const dataAttribute = `data-vce-background-image-${device}`
              propObj[dataAttribute] = doDevices[device].image.urls[0].full
              isImagesSet = true
            }
          })
          if (isImagesSet) {
            propObj['data-vce-background-image'] = Object.keys(doDevices)
            propObj['data-vce-lozad'] = true
            propObj['data-vcv-lozad'] = true // only for editor
          }
        }
      }
    }

    // checking all
    if (prop === 'all') {
      prop += ` el-${this.props.id}`
      propObj['data-vce-do-apply'] = prop

      const animationData = this.getAnimationData()
      if (animationData && animationData.animation) {
        propObj['data-vce-animate'] = animationData.animation

        if (animationData.animationDelay) {
          propObj['data-vce-animate-delay'] = animationData.animationDelay
        }
      }
      return propObj
    }

    // checking animate
    if (prop.indexOf('animation') > -1) {
      if (prop !== 'animation') {
        prop = prop.replace('animation', '')
        prop += ` el-${this.props.id}`
        propObj['data-vce-do-apply'] = prop
      }

      const animationData = this.getAnimationData()
      if (animationData && animationData.animation) {
        propObj['data-vce-animate'] = animationData.animation

        if (animationData.animationDelay) {
          propObj['data-vce-animate-delay'] = animationData.animationDelay
        }
      }

      return propObj
    }

    prop += ` el-${this.props.id}`
    propObj['data-vce-do-apply'] = prop

    return propObj
  }

  getAnimationData () {
    const animationData = {
      animation: '',
      animationDelay: ''
    }
    // TODO: Get attributes BY TYPE
    const designOptions = this.props.atts && (this.props.atts.designOptions || this.props.atts.designOptionsAdvanced)

    if (designOptions && designOptions.device) {
      const animations = []
      const animationDelays = []
      Object.keys(designOptions.device).forEach((device) => {
        let prefix = (device === 'all') ? '' : device
        if (designOptions.device[device].animation) {
          if (prefix) {
            prefix = `-${prefix}`
          }
          animations.push(`vce-o-animate--${designOptions.device[device].animation}${prefix}`)

          if (designOptions.device[device].animationDelay) {
            animationDelays.push(`vce-o-animate-delay--${designOptions.device[device].animationDelay}${prefix}`)
          }
        }
      })
      if (animations.length) {
        animationData.animation = animations.join(' ')

        if (animationDelays.length) {
          animationData.animationDelay = animationDelays.join(' ')
        }
      }
    }
    return animationData
  }

  getImageData () {
    // TODO: Get attributes BY TYPE
    const designOptions = this.props.atts && (this.props.atts.designOptions || this.props.atts.designOptionsAdvanced)

    const imageData = {}
    if (designOptions && designOptions.device) {
      Object.keys(designOptions.device).forEach((device) => {
        const imgValueObj = typeof this.props.atts.designOptionsAdvanced !== 'undefined' ? designOptions.device[device].images : designOptions.device[device].image
        const imgValue = imgValueObj && imgValueObj.urls && imgValueObj.urls[0] ? imgValueObj.urls[0].full : ''

        if (typeof imgValue === 'string' && imgValue.match(blockRegexp)) {
          imageData[`data-vce-dynamic-image-${device}`] = this.props.id
        }
      })
    }
    return imageData
  }

  getMixinData (mixinName) {
    if (!this.props.atts.tag) {
      return null
    }
    const allMixinData = getCssMixinsData(this.props.atts.tag)
    const mixin = allMixinData[mixinName]
    let result = null
    if (mixin) {
      result = {
        selector: getMixinsSelector(mixin, this.props.atts)
      }
    }

    return result
  }

  getInnerMixinData (fieldKey, mixinName, i) {
    const allMixinData = getInnerCssMixinsData(this.props.atts.tag)
    const mixin = allMixinData[mixinName]
    let result = null
    if (mixin && this.props.atts[fieldKey]?.value[i]) {
      result = {
        selector: getMixinsSelector(mixin, this.props.atts[fieldKey].value[i])
      }
    }

    return result
  }

  getBackgroundTypeContent (designOptionsAdvanced = this.props.atts.designOptionsAdvanced, parallax = this.props.atts.parallax) {
    if (lodash.isEmpty(designOptionsAdvanced) || lodash.isEmpty(designOptionsAdvanced.device)) {
      return null
    }
    const { device } = designOptionsAdvanced
    const backgroundData = []
    const devices = ['xs', 'sm', 'md', 'lg', 'xl']
    const getBackgroundDeviceData = (deviceKey, deviceData, parallaxData) => {
      const { gradientOverlay } = deviceData
      let reactKey = `${this.props.id}-${deviceKey}-${deviceData.backgroundType}`
      let images = deviceData.images
      const imageValue = images && images.urls && images.urls[0] ? images.urls[0].full : false
      const isDynamic = imageValue && typeof imageValue === 'string' && imageValue.match(blockRegexp)
      if (isDynamic) {
        const blockInfo = imageValue.split(blockRegexp)
        const blockAtts = JSON.parse(blockInfo[4])
        const imageUrl = getDynamicFieldsData({
          blockAtts: blockAtts
        })
        images = [imageUrl]
      }
      const deviceBackgroundElements = []
      const deviceBackgroundData = []

      switch (deviceData.backgroundType) {
        case 'imagesSimple':
          deviceBackgroundElements.push(
            <ImageSimpleBackground
              images={images} deviceData={deviceData} deviceKey={deviceKey} reactKey={reactKey}
              key={reactKey} atts={this.props.atts}
            />)
          break
        case 'backgroundZoom':
          deviceBackgroundElements.push(
            <ImageBackgroundZoom
              images={images} deviceData={deviceData} deviceKey={deviceKey} reactKey={reactKey}
              key={reactKey} atts={this.props.atts}
            />)
          break
        case 'imagesSlideshow':
          deviceBackgroundElements.push(
            <ImageSlideshowBackground
              images={images} deviceData={deviceData} deviceKey={deviceKey} reactKey={reactKey}
              key={reactKey} atts={this.props.atts}
            />)
          break
        case 'videoYoutube':
          deviceBackgroundElements.push(
            <YoutubeBackground
              deviceData={deviceData} deviceKey={deviceKey} reactKey={reactKey}
              key={reactKey} atts={this.props.atts}
            />)
          break
        case 'videoVimeo':
          deviceBackgroundElements.push(
            <VimeoBackground
              deviceData={deviceData} deviceKey={deviceKey} reactKey={reactKey}
              key={reactKey} atts={this.props.atts}
            />)
          break
        case 'videoEmbed':
          deviceBackgroundElements.push(
            <EmbedVideoBackground
              deviceData={deviceData} deviceKey={deviceKey} reactKey={reactKey}
              key={reactKey} atts={this.props.atts}
            />)
          break
      }

      if (gradientOverlay) {
        reactKey = `${this.props.id}-${deviceKey}-${deviceData}-gradientOverlay`
        deviceBackgroundElements.push(
          <ColorGradientBackground
            deviceData={deviceData} deviceKey={deviceKey} reactKey={reactKey}
            key={reactKey} atts={this.props.atts} applyBackground={this.applyDO('gradient')}
          />)
      }

      const extendedOptionsState = elementsSettingsStorage.state('extendedOptions').get()
      const isBackgroundAnimation = extendedOptionsState &&
        extendedOptionsState.backgroundAnimationComponent &&
        parallaxData &&
        parallaxData.parallaxEnable &&
        parallaxData.parallax &&
        parallaxData.parallax === 'backgroundAnimation' &&
        deviceData &&
        deviceData.images &&
        deviceData.images.urls &&
        deviceData.images.urls.length > 1 &&
        deviceData.backgroundType === 'imagesSimple'

      const isBasicParallax = parallaxData &&
        parallaxData.parallaxEnable &&
        parallaxData.parallax &&
        (parallaxData.parallax === 'fixed' || parallaxData.parallax === 'simple' || parallaxData.parallax === 'simple-fade' || parallaxData.parallax === 'mouse-move')

      if (isBasicParallax) {
        reactKey = `${this.props.id}-${deviceKey}-${device[deviceKey]}-parallax`
        deviceBackgroundData.push(
          <ParallaxBackground
            deviceData={parallaxData} deviceKey={deviceKey} reactKey={reactKey}
            key={reactKey} atts={this.props.atts} content={deviceBackgroundElements}
          />)
      } else if (isBackgroundAnimation) {
        const BackgroundAnimation = extendedOptionsState.backgroundAnimationComponent
        reactKey = `${this.props.id}-${deviceKey}-${device[deviceKey]}-background-animation`
        deviceBackgroundData.push(
          <BackgroundAnimation
            deviceData={parallaxData} deviceKey={deviceKey} reactKey={reactKey}
            key={reactKey} atts={this.props.atts} content={deviceBackgroundElements}
          />)
      } else {
        deviceBackgroundData.push(deviceBackgroundElements)
      }

      return deviceBackgroundData
    }

    // Merge parallax and design options background for devices
    if (Object.prototype.hasOwnProperty.call(designOptionsAdvanced.device, 'all') && parallax && parallax.device && !Object.prototype.hasOwnProperty.call(parallax.device, 'all')) {
      devices.forEach((deviceKey) => {
        backgroundData.push(getBackgroundDeviceData(deviceKey, device.all, parallax.device[deviceKey]))
      })
    } else {
      Object.keys(device).forEach((deviceKey) => {
        const parallaxData = parallax && parallax.device
        let parallaxDeviceData = null
        if (parallaxData) {
          parallaxDeviceData = Object.prototype.hasOwnProperty.call(parallax.device, deviceKey) ? parallax.device[deviceKey] : parallax.device.all
        }

        backgroundData.push(getBackgroundDeviceData(deviceKey, device[deviceKey], parallaxDeviceData))
      })
    }
    if (backgroundData.length) {
      return <div className='vce-content-background-container'>{backgroundData}</div>
    }
    return null
  }

  getContainerDivider (designOptionsAdvanced = this.props.atts.designOptionsAdvanced, dividers = this.props.atts.dividers) {
    if (lodash.isEmpty(dividers) || lodash.isEmpty(dividers.device)) {
      return null
    }

    const { device } = dividers
    const dividerElements = []
    const customDevices = []
    const parallaxDevices = []
    let actualDevices = []
    const designOptionsDevices = designOptionsAdvanced && designOptionsAdvanced.device

    designOptionsDevices && Object.keys(designOptionsDevices).forEach((device) => {
      if (device !== 'all') {
        customDevices.push(device)
      }
      if (Object.prototype.hasOwnProperty.call(designOptionsDevices[device], 'parallax')) {
        parallaxDevices.push(device)
      }
    })

    if (customDevices.length && parallaxDevices.length) {
      actualDevices = customDevices
    } else {
      Object.keys(device).forEach((device) => {
        actualDevices.push(device)
      })
    }

    actualDevices.forEach((deviceKey, index) => {
      const dividerDeviceKey = device[deviceKey] ? deviceKey : 'all'
      const dividerDeviceData = device[dividerDeviceKey]
      const { dividerTop, dividerBottom } = dividerDeviceData
      const parallaxKey = (parallaxDevices.indexOf('all') === -1 && parallaxDevices.indexOf(deviceKey) > -1) ? deviceKey : 'all'

      if (dividerTop) {
        const reactKey = `${this.props.id}-${deviceKey}-top-${index}`
        const dividerElement = (
          <Divider
            deviceData={dividerDeviceData} deviceKey={deviceKey} type='Top'
            metaAssetsPath={this.props.atts.metaAssetsPath} key={reactKey} id={this.props.id}
            applyDivider={this.applyDO('divider')}
          />
        )

        if (parallaxDevices.indexOf(deviceKey) > -1 || parallaxDevices.indexOf('all') > -1) {
          dividerElements.push(
            <ParallaxBackground
              deviceData={designOptionsAdvanced.device[parallaxKey]} deviceKey={parallaxKey}
              reactKey={reactKey}
              key={reactKey} atts={this.props.atts} content={dividerElement} divider={dividerTop}
            />
          )
        } else {
          dividerElements.push(dividerElement)
        }
      }

      if (dividerBottom) {
        const reactKey = `${this.props.id}-${deviceKey}-bottom-${index}`

        const dividerElement = (
          <Divider
            deviceData={dividerDeviceData} deviceKey={deviceKey} type='Bottom'
            metaAssetsPath={this.props.atts.metaAssetsPath} key={reactKey} id={this.props.id}
            applyDivider={this.applyDO('divider')}
          />
        )

        if (parallaxDevices.indexOf(deviceKey) > -1 || parallaxDevices.indexOf('all') > -1) {
          dividerElements.push(
            <ParallaxBackground
              deviceData={designOptionsAdvanced.device[parallaxKey]} deviceKey={parallaxKey}
              reactKey={reactKey}
              key={reactKey} atts={this.props.atts} content={dividerElement} divider={dividerBottom}
            />
          )
        } else {
          dividerElements.push(dividerElement)
        }
      }
    })

    if (dividerElements.length === 0) {
      return null
    }

    return <div className='vce-dividers-wrapper'>{dividerElements}</div>
  }

  getImageUrl (image, size) {
    if (!image) {
      return null
    }

    let imageUrl
    // Move it to attribute
    if (size && image && image[size]) {
      imageUrl = image[size]
    } else {
      if (image instanceof Array || (image.urls && image.urls instanceof Array)) {
        const urls = []
        const images = image.urls || image
        images.forEach((item) => {
          const url = item && item.full && item.id ? item.full : (item && item.full ? this.getPublicImage(item.full) : this.getPublicImage(item))
          urls.push(url)
        })
        imageUrl = urls
      } else {
        imageUrl = image && image.full && image.id ? image.full : (image && Object.prototype.hasOwnProperty.call(image, 'full') ? this.getPublicImage(image.full) : this.getPublicImage(image))
      }
    }

    return imageUrl
  }

  getPublicImage (filename) {
    const { metaAssetsPath } = this.props.atts
    if (!filename) {
      return ''
    }
    const isDynamic = env('VCV_JS_FT_DYNAMIC_FIELDS')
    if (isDynamic && filename.match(blockRegexp)) {
      const blockInfo = filename.split(blockRegexp)
      const blockAtts = JSON.parse(blockInfo[4])
      filename = getDynamicFieldsData({
        blockAtts: blockAtts
      })

      return filename
    }
    if (filename.match) {
      if (filename.match('^(https?:)?\\/\\/?') || filename.match(/--vcv-dynamic-/)) {
        return filename
      }
    }

    return metaAssetsPath + filename
  }

  getStickyAttributes (sticky) {
    const attributes = {}
    if (Object.keys(sticky.device).length) {
      const deviceKeys = Object.keys(sticky.device)
      deviceKeys.forEach((deviceKey) => {
        // At the moment allow only for device "all"
        if (deviceKey === 'all') {
          const device = sticky.device[deviceKey]
          if (device.stickyEnable) {
            attributes['data-vce-sticky-element'] = true

            if (device.stickyOffsetTop && device.stickyOffsetTop !== '0') {
              attributes['data-margin-top'] = device.stickyOffsetTop
            }

            if (device.stickyZIndex) {
              attributes['data-vce-sticky-z-index'] = device.stickyZIndex
            }

            if (device.stickyContainer) {
              attributes['data-vce-sticky-container'] = '[data-vce-element-content]'
            }

            if (device.stickyVisibility) {
              attributes['data-vce-sticky-visibility'] = device.stickyVisibility
            }
          }
        }
      })
    }
    return attributes
  }

  getBoxShadowAttributes (data, id) {
    const attributes = {}
    if (Object.keys(data.device).length) {
      const deviceKeys = Object.keys(data.device)
      deviceKeys.forEach((deviceKey) => {
        // At the moment allow only for device "all"
        if (deviceKey === 'all') {
          const device = data.device[deviceKey]
          if (device.boxShadowEnable) {
            attributes['vce-box-shadow'] = `el-${id}`
          }
          if (device.hoverBoxShadowEnable) {
            attributes['vce-hover-box-shadow'] = `el-${id}`
          }
        }
      })
    }
    return attributes
  }

  setCssVariables = (cssVars, styleObj) => {
    for (const [key, value] of Object.entries(cssVars)) {
      if (value) {
        styleObj[`--${key}`] = value
      }
    }
  }

  getColorShade = (percentage, color1, color2, blend) => {
    return pSBC(percentage, color1, color2, blend)
  }

  getExtraDataAttributes (dataAttributes) {
    const customProps = {}
    if (dataAttributes) {
      // Diabling eslint because it messing up regexp
      const attributeRegex = /(\S+)=(\"((?:\\.|[^"\\])*)")/g // eslint-disable-line
      const attributes = dataAttributes.match(attributeRegex)
      if (attributes && attributes.length) {
        const charsRegex = /[\[\]\(\)\{\}",.?!&@$`'+*%#^_:;]+/g // eslint-disable-line
        attributes.forEach((attribute) => {
          const sanitized = attribute.replaceAll(charsRegex, '')
          const parsedAttribute = sanitized.split('=')
          customProps[parsedAttribute[0].toLowerCase()] = parsedAttribute[1] || true
        })
      }
    }
    return customProps
  }

  render () {
    return null
  }
}

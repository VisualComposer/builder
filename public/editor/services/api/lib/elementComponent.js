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
import { getDynamicFieldsData } from 'public/components/dynamicFields/dynamicFields'

const shortcodesAssetsStorage = getStorage('shortcodeAssets')
const assetsStorage = getStorage('assets')
const { getShortcodesRegexp, getBlockRegexp } = getService('utils')
const blockRegexp = getBlockRegexp()
const dataProcessor = getService('dataProcessor')

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

  // [gallery ids="318,93"]
  getShortcodesRegexp () {
    return new RegExp('\\[(\\[?)([\\w|-]+\\b)(?![\\w-])([^\\]\\/]*(?:\\/(?!\\])[^\\]\\/]*)*?)(?:(\\/)\\]|\\](?:([^\\[]*(?:\\[(?!\\/\\2\\])[^\\[]*)*)(\\[\\/\\2\\]))?)(\\]?)')
  }

  componentWillUnmount () {
    if (this.ajax) {
      this.ajax.cancelled = true
    }
  }

  spinnerHTML () {
    return '<span class="vcv-ui-content-editable-helper-loader vcv-ui-wp-spinner"></span>'
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

  updateShortcodeToHtml (content, ref, cb) {
    if (content && (content.match(getShortcodesRegexp()) || content.match(/https?:\/\//) || content.indexOf('<!-- wp') !== -1)) {
      ref && (ref.innerHTML = this.spinnerHTML())
      let that = this
      this.ajax = dataProcessor.appServerRequest({
        'vcv-action': 'elements:ajaxShortcode:adminNonce',
        'vcv-shortcode-string': content,
        'vcv-nonce': window.vcvNonce,
        'vcv-source-id': window.vcvSourceID
      }).then((data) => {
        if (this.ajax && this.ajax.cancelled) {
          this.ajax = null
          return
        }
        let iframe = env('iframe')

        try {
          ((function (window, document) {
            let jsonData = JSON.parse(data)
            let { headerContent, shortcodeContent, footerContent } = jsonData
            ref && (ref.innerHTML = '')
            window.vcvFreezeReady && window.vcvFreezeReady(that.props.id, true)
            let headerDom = window.jQuery('<div>' + headerContent + '</div>', document)
            headerDom.context = document
            shortcodesAssetsStorage.trigger('add', { type: 'header', ref: ref, domNodes: headerDom.children(), cacheInnerHTML: true, addToDocument: true })

            let shortcodeDom = window.jQuery('<div>' + shortcodeContent + '</div>', document)
            shortcodeDom.context = document
            if (shortcodeDom.children().length) {
              shortcodesAssetsStorage.trigger('add', { type: 'shortcode', ref: ref, domNodes: shortcodeDom.contents(), addToDocument: true })
            } else if (shortcodeDom.text()) {
              window.jQuery(ref).append(document.createTextNode(shortcodeDom.text()))
            }

            let footerDom = window.jQuery('<div>' + footerContent + '</div>', document)
            footerDom.context = document
            shortcodesAssetsStorage.trigger('add', { type: 'footer', ref: ref, domNodes: footerDom.children(), addToDocument: true, ignoreCache: true }, () => {
              window.setTimeout(() => {
                window.vcvFreezeReady && window.vcvFreezeReady(that.props.id, false)
                window.vcv && window.vcv.trigger('ready', 'update', that.props.id)
              }, 150)
            })
          })(iframe, iframe.document))
        } catch (e) {
          let jsonData = this.getResponse(data)
          if (jsonData) {
            try {
              ((function (window, document) {
                let { headerContent, shortcodeContent, footerContent } = jsonData
                ref && (ref.innerHTML = '')
                window.vcvFreezeReady && window.vcvFreezeReady(that.props.id, true)
                let headerDom = window.jQuery('<div>' + headerContent + '</div>', document)
                headerDom.context = document
                shortcodesAssetsStorage.trigger('add', { type: 'header', ref: ref, domNodes: headerDom.children(), cacheInnerHTML: true, addToDocument: true })

                let shortcodeDom = window.jQuery('<div>' + shortcodeContent + '</div>', document)
                shortcodeDom.context = document
                if (shortcodeDom.children().length) {
                  shortcodesAssetsStorage.trigger('add', { type: 'shortcode', ref: ref, domNodes: shortcodeDom.contents(), addToDocument: true })
                } else if (shortcodeDom.text()) {
                  window.jQuery(ref).append(document.createTextNode(shortcodeDom.text()))
                }

                let footerDom = window.jQuery('<div>' + footerContent + '</div>', document)
                footerDom.context = document
                shortcodesAssetsStorage.trigger('add', { type: 'footer', ref: ref, domNodes: footerDom.children(), addToDocument: true, ignoreCache: true }, () => {
                  window.setTimeout(() => {
                    window.vcvFreezeReady && window.vcvFreezeReady(that.props.id, false)
                    window.vcv && window.vcv.trigger('ready', 'update', that.props.id)
                  }, 150)
                })
              })(iframe, iframe.document))
            } catch (pe) {
              console.warn(pe)
            }
          } else {
            console.warn('failed to parse json', e, data)
          }
        }
        this.ajax = null
        cb && cb.constructor === Function && cb()
      })
    } else {
      ref && (ref.innerHTML = content)
    }
  }

  updateInlineHtml (elementWrapper, html = '', tagString = '') {
    // const helper = document.createElement('vcvhelper')
    // const comment = document.createComment('[vcvSourceHtml]' + tagString + '[/vcvSourceHtml]')
    // elementWrapper.innerHTML = ''
    // let range = document.createRange()
    // let documentFragment = range.createContextualFragment(tagString)
    //
    // helper.appendChild(documentFragment)
    // elementWrapper.appendChild(comment)
    // elementWrapper.appendChild(helper)

    const helper = document.createElement('div')
    elementWrapper.innerHTML = ''
    if (!tagString) {
      tagString = html
    }
    helper.setAttribute('data-vcvs-html', `${tagString}`)
    helper.classList.add('vcvhelper')
    let range = document.createRange()
    let documentFragment = range.createContextualFragment(html)
    helper.appendChild(documentFragment)
    elementWrapper.appendChild(helper)
  }

  updateInlineScript (elementWrapper, tagString = '') {
    const helper = document.createElement('div')
    elementWrapper.innerHTML = ''
    let scriptHtml = `<script type="text/javascript">${tagString}</script>`
    helper.classList.add('vcvhelper')
    helper.setAttribute('data-vcvs-html', `${scriptHtml}`)
    let script = document.createElement('script')
    script.type = 'text/javascript'
    let escapedString = escape(tagString)
    script.text = `try{ 
      eval(unescape('${escapedString}'))
    } catch(e) {console.warn(e);}`
    // TODO: add catched error message to console..
    helper.appendChild(script)
    elementWrapper.appendChild(helper)
  }

  getDomNode () {
    return ReactDOM.findDOMNode(this)
  }

  getBackgroundClass (designOptions) {
    let { device } = designOptions
    let classes = []
    if (device) {
      let { all } = device
      if (all && (all.backgroundColor !== undefined || typeof all.images === 'string' || (all.images && all.images.urls && all.images.urls.length))) {
        classes.push('vce-element--has-background')
      } else {
        for (let currentDevice in device) {
          let deviceData = device[ currentDevice ]
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

    if (env('VCV_JS_FT_DYNAMIC_FIELDS') && (prop === 'all' || prop.indexOf('background') > -1)) {
      propObj = Object.assign({}, propObj, this.getImageData())
    }

    // checking all
    if (prop === 'all') {
      prop += ` el-${this.props.id}`
      propObj[ 'data-vce-do-apply' ] = prop

      let animationData = this.getAnimationData()
      if (animationData) {
        propObj[ 'data-vce-animate' ] = animationData
      }
      return propObj
    }

    // checking animate
    if (prop.indexOf('animation') > -1) {
      if (prop !== 'animation') {
        prop = prop.replace('animation', '')
        prop += ` el-${this.props.id}`
        propObj[ 'data-vce-do-apply' ] = prop
      }

      let animationData = this.getAnimationData()
      if (animationData) {
        propObj[ 'data-vce-animate' ] = animationData
      }

      return propObj
    }

    prop += ` el-${this.props.id}`
    propObj[ 'data-vce-do-apply' ] = prop

    return propObj
  }

  getAnimationData () {
    let animationData = ''
    // TODO: Get attributes BY TYPE
    let designOptions = this.props.atts && (this.props.atts.designOptions || this.props.atts.designOptionsAdvanced)

    if (designOptions && designOptions.device) {
      let animations = []
      Object.keys(designOptions.device).forEach((device) => {
        let prefix = (device === 'all') ? '' : device
        if (designOptions.device[ device ].animation) {
          if (prefix) {
            prefix = `-${prefix}`
          }
          animations.push(`vce-o-animate--${designOptions.device[ device ].animation}${prefix}`)
        }
      })
      if (animations.length) {
        animationData = animations.join(' ')
      }
    }
    return animationData
  }

  getImageData () {
    // TODO: Get attributes BY TYPE
    let designOptions = this.props.atts && (this.props.atts.designOptions || this.props.atts.designOptionsAdvanced)

    let imageData = {}
    if (designOptions && designOptions.device) {
      Object.keys(designOptions.device).forEach((device) => {
        if (typeof designOptions.device[ device ].image === 'string' && designOptions.device[ device ].image.match(blockRegexp)) {
          imageData[ `data-vce-dynamic-image-${device}` ] = this.props.id
        }
      })
    }
    return imageData
  }

  getMixinData (mixinName) {
    if (!this.props.atts.tag) {
      return null
    }
    const allMixinData = assetsStorage.state('cssMixins').get() || {}
    const mixinData = allMixinData[ this.props.id ] || null
    if (!mixinData) {
      return null
    }
    let { tag } = this.props.atts
    let returnData = null
    if (mixinData[ tag ] && mixinData[ tag ][ mixinName ]) {
      let mixin = Object.keys(mixinData[ tag ][ mixinName ])
      mixin = mixin.length ? mixin.pop() : null
      if (mixin) {
        returnData = mixinData[ tag ][ mixinName ][ mixin ]
      }
    } else {
      returnData = mixinData[ tag ] || mixinData
    }

    return returnData
  }

  getInnerMixinData (fieldKey, mixinName, i) {
    let tag = this.props.atts.tag
    const allMixinData = assetsStorage.state('cssMixins').get()
    const parentMixinData = allMixinData[ this.props.id ] || null
    if (!parentMixinData || !parentMixinData[ tag ] || !parentMixinData[ tag ][ fieldKey ] || !parentMixinData[ tag ][ fieldKey ][ i ]) {
      return null
    }
    let innerMixinData = parentMixinData[ tag ][ fieldKey ][ i ]
    if (!innerMixinData) {
      return null
    }
    let returnData = null
    if (innerMixinData[ 'innerTag' ] && innerMixinData[ 'innerTag' ][ mixinName ]) {
      let mixin = Object.keys(innerMixinData[ 'innerTag' ][ mixinName ])
      mixin = mixin.length ? mixin.pop() : null
      if (mixin) {
        returnData = innerMixinData[ 'innerTag' ][ mixinName ][ mixin ]
      }
    } else {
      returnData = innerMixinData[ 'innerTag' ] || innerMixinData
    }

    return returnData
  }

  getBackgroundTypeContent () {
    let { designOptionsAdvanced } = this.props.atts
    if (lodash.isEmpty(designOptionsAdvanced) || lodash.isEmpty(designOptionsAdvanced.device)) {
      return null
    }
    let { device } = designOptionsAdvanced
    let backgroundData = []
    Object.keys(device).forEach((deviceKey) => {
      let { parallax, gradientOverlay } = device[ deviceKey ]
      let backgroundElements = []
      let reactKey = `${this.props.id}-${deviceKey}-${device[ deviceKey ].backgroundType}`
      let images = device[ deviceKey ].images

      if (typeof images === 'string' && images.match(blockRegexp)) {
        let blockInfo = images.split(blockRegexp)
        let blockAtts = JSON.parse(blockInfo[ 4 ])
        let imageUrl = getDynamicFieldsData({
          blockAtts: blockAtts
        })
        images = [ imageUrl ]
      }

      switch (device[ deviceKey ].backgroundType) {
        case 'imagesSimple':
          backgroundElements.push(
            <ImageSimpleBackground images={images} deviceData={device[ deviceKey ]} deviceKey={deviceKey} reactKey={reactKey}
              key={reactKey} atts={this.props.atts} />)
          break
        case 'backgroundZoom':
          backgroundElements.push(
            <ImageBackgroundZoom images={images} deviceData={device[ deviceKey ]} deviceKey={deviceKey} reactKey={reactKey}
              key={reactKey} atts={this.props.atts} />)
          break
        case 'imagesSlideshow':
          backgroundElements.push(
            <ImageSlideshowBackground images={images} deviceData={device[ deviceKey ]} deviceKey={deviceKey} reactKey={reactKey}
              key={reactKey} atts={this.props.atts} />)
          break
        case 'videoYoutube':
          backgroundElements.push(
            <YoutubeBackground deviceData={device[ deviceKey ]} deviceKey={deviceKey} reactKey={reactKey}
              key={reactKey} atts={this.props.atts} />)
          break
        case 'videoVimeo':
          backgroundElements.push(
            <VimeoBackground deviceData={device[ deviceKey ]} deviceKey={deviceKey} reactKey={reactKey}
              key={reactKey} atts={this.props.atts} />)
          break
        case 'videoEmbed':
          backgroundElements.push(
            <EmbedVideoBackground deviceData={device[ deviceKey ]} deviceKey={deviceKey} reactKey={reactKey}
              key={reactKey} atts={this.props.atts} />)
          break
      }

      // parallax
      if (gradientOverlay) {
        reactKey = `${this.props.id}-${deviceKey}-${device[ deviceKey ]}-gradientOverlay`
        backgroundElements.push(
          <ColorGradientBackground deviceData={device[ deviceKey ]} deviceKey={deviceKey} reactKey={reactKey}
            key={reactKey} atts={this.props.atts} applyBackground={this.applyDO('gradient')} />)
      }

      if (parallax) {
        reactKey = `${this.props.id}-${deviceKey}-${device[ deviceKey ]}-parallax`
        backgroundData.push(
          <ParallaxBackground deviceData={device[ deviceKey ]} deviceKey={deviceKey} reactKey={reactKey}
            key={reactKey} atts={this.props.atts} content={backgroundElements} />)
      } else {
        backgroundData.push(backgroundElements)
      }
    })
    if (backgroundData.length) {
      return <div className='vce-content-background-container'>
        {backgroundData}
      </div>
    }
    return null
  }

  getContainerDivider () {
    let { designOptionsAdvanced, dividers } = this.props.atts

    if (lodash.isEmpty(dividers) || lodash.isEmpty(dividers.device)) {
      return null
    }

    let { device } = dividers
    let dividerElements = []
    let customDevices = []
    let parallaxDevices = []
    let actualDevices = []
    let designOptionsDevices = designOptionsAdvanced && designOptionsAdvanced.device

    designOptionsDevices && Object.keys(designOptionsDevices).forEach((device) => {
      if (device !== 'all') {
        customDevices.push(device)
      }
      if (designOptionsDevices[ device ].hasOwnProperty('parallax')) {
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
      let dividerDeviceKey = device[ deviceKey ] ? deviceKey : 'all'
      let dividerDeviceData = device[ dividerDeviceKey ]
      let { dividerTop, dividerBottom } = dividerDeviceData
      let parallaxKey = (parallaxDevices.indexOf('all') === -1 && parallaxDevices.indexOf(deviceKey) > -1) ? deviceKey : 'all'

      if (dividerTop) {
        let reactKey = `${this.props.id}-${deviceKey}-top-${index}`
        let dividerElement = (
          <Divider deviceData={dividerDeviceData} deviceKey={deviceKey} type={'Top'}
            metaAssetsPath={this.props.atts.metaAssetsPath} key={reactKey} id={this.props.id}
            applyDivider={this.applyDO('divider')} />
        )

        if (parallaxDevices.indexOf(deviceKey) > -1 || parallaxDevices.indexOf('all') > -1) {
          dividerElements.push(
            <ParallaxBackground deviceData={designOptionsAdvanced.device[ parallaxKey ]} deviceKey={parallaxKey}
              reactKey={reactKey}
              key={reactKey} atts={this.props.atts} content={dividerElement} divider={dividerTop} />
          )
        } else {
          dividerElements.push(dividerElement)
        }
      }

      if (dividerBottom) {
        let reactKey = `${this.props.id}-${deviceKey}-bottom-${index}`

        let dividerElement = (
          <Divider deviceData={dividerDeviceData} deviceKey={deviceKey} type={'Bottom'}
            metaAssetsPath={this.props.atts.metaAssetsPath} key={reactKey} id={this.props.id}
            applyDivider={this.applyDO('divider')} />
        )

        if (parallaxDevices.indexOf(deviceKey) > -1 || parallaxDevices.indexOf('all') > -1) {
          dividerElements.push(
            <ParallaxBackground deviceData={designOptionsAdvanced.device[ parallaxKey ]} deviceKey={parallaxKey}
              reactKey={reactKey}
              key={reactKey} atts={this.props.atts} content={dividerElement} divider={dividerBottom} />
          )
        } else {
          dividerElements.push(dividerElement)
        }
      }
    })

    if (dividerElements.length === 0) {
      return null
    }

    return <div className='vce-dividers-wrapper'>
      {dividerElements}
    </div>
  }

  getImageUrl (image, size) {
    if (!image) {
      return null
    }

    let imageUrl
    // Move it to attribute
    if (size && image && image[ size ]) {
      imageUrl = image[ size ]
    } else {
      if (image instanceof Array || (image.urls && image.urls instanceof Array)) {
        let urls = []
        const images = image.urls || image
        images.forEach((item) => {
          let url = item && item.full && item.id ? item.full : (item && item.full ? this.getPublicImage(item.full) : this.getPublicImage(item))
          urls.push(url)
        })
        imageUrl = urls
      } else {
        imageUrl = image && image.full && image.id ? image.full : (image && image.hasOwnProperty('full') ? this.getPublicImage(image.full) : this.getPublicImage(image))
      }
    }

    return imageUrl
  }

  getPublicImage (filename) {
    let { metaAssetsPath } = this.props.atts
    if (!filename) {
      return ''
    }
    if (filename && filename.match) {
      if (filename.match('^(https?:)?\\/\\/?') || filename.match(/--vcv-dynamic-/)) {
        return filename
      }
    }

    return metaAssetsPath + filename
  }

  getStickyAttributes (sticky) {
    let attributes = {}
    if (Object.keys(sticky.device).length) {
      let deviceKeys = Object.keys(sticky.device)
      deviceKeys.forEach((deviceKey) => {
        // At the moment allow only for device "all"
        if (deviceKey === 'all') {
          let device = sticky.device[ deviceKey ]
          if (device.stickyEnable) {
            attributes[ 'data-vce-sticky-element' ] = true

            if (device.stickyOffsetTop && device.stickyOffsetTop !== '0') {
              attributes[ 'data-margin-top' ] = device.stickyOffsetTop
            }

            if (device.stickyZIndex) {
              attributes[ 'data-vce-sticky-z-index' ] = device.stickyZIndex
            }

            if (device.stickyContainer) {
              attributes[ 'data-vce-sticky-container' ] = '[data-vce-element-content]'
            }

            if (device.stickyVisibility) {
              attributes[ 'data-vce-sticky-visibility' ] = device.stickyVisibility
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
      let deviceKeys = Object.keys(data.device)
      deviceKeys.forEach((deviceKey) => {
        // At the moment allow only for device "all"
        if (deviceKey === 'all') {
          let device = data.device[ deviceKey ]
          if (device.boxShadowEnable) {
            attributes[ 'vce-box-shadow' ] = `el-${id}`
          }
        }
      })
    }
    return attributes
  }

  getResponse (result) {
    return getResponse(result)
  }

  render () {
    return null
  }
}

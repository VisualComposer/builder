import React from 'react'
import ReactDOM from 'react-dom'
import lodash from 'lodash'
import YoutubeBackground from './youtubeBackground'
import VimeoBackground from './vimeoBackground'
import ImageSimpleBackground from './imageSimpleBackground'
import ImageSlideshowBackground from './imageSlideshowBackground'
import EmbedVideoBackground from './embedVideoBackground'
import ColorGradientBackground from './colorGradientBackground'
import ParallaxBackground from './parallaxBackground'

const { Component, PropTypes } = React

export default class ElementComponent extends Component {
  static propTypes = {
    id: PropTypes.string,
    api: PropTypes.object,
    atts: PropTypes.object,
    editor: PropTypes.object
  }

  updateInlineHtml (elementWrapper, tagString = '') {
    const helper = document.createElement('vcvhelper')
    const comment = document.createComment('[vcvSourceHtml]' + tagString + '[/vcvSourceHtml]')
    elementWrapper.innerHTML = ''
    let range = document.createRange()
    let documentFragment = range.createContextualFragment(tagString)

    helper.appendChild(documentFragment)
    elementWrapper.appendChild(comment)
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
      if (all && (all.backgroundColor !== undefined || (all.images && all.images.urls && all.images.urls.length))) {
        classes.push('vce-element--has-background')
      } else {
        for (let currentDevice in device) {
          if (device[ currentDevice ] && (device[ currentDevice ].backgroundColor !== undefined || (device[ currentDevice ].images && device[ currentDevice ].images.urls && device[ currentDevice ].images.urls.length))) {
            classes.push(`vce-element--${currentDevice}--has-background`)
          }
        }
      }
    }
    return classes.join(' ')
  }

  applyDO (prop) {
    let propObj = {}

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
    if (prop.indexOf('animation') >= 0) {
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
    let designOptions = this.props.atts && (this.props.atts.designOptions || this.props.atts.designOptionsAdvanced)

    if (designOptions.device) {
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

  getMixinData (mixinName) {
    const vcCake = require('vc-cake')
    const assetsStorage = vcCake.getService('modernAssetsStorage').getGlobalInstance()
    let returnData = null
    let mixinData = assetsStorage.getCssMixinsByElement(this.props.atts)
    let { tag } = this.props.atts
    if (mixinData[ tag ][ mixinName ]) {
      let mixin = Object.keys(mixinData[ tag ][ mixinName ])
      mixin = mixin.length ? mixin.pop() : null
      if (mixin) {
        returnData = mixinData[ tag ][ mixinName ][ mixin ]
      }
    }
    return returnData
  }

  getAttributeMixinData (attributeName) {
    const vcCake = require('vc-cake')
    const assetsStorage = vcCake.getService('modernAssetsStorage').getGlobalInstance()
    let returnData = null
    let mixinData = assetsStorage.getAttributesMixinsByElement(this.props.atts)
    let { tag } = this.props.atts
    if (mixinData[ tag ] && mixinData[ tag ][ attributeName ] && mixinData[ tag ][ attributeName ].variables) {
      returnData = mixinData[ tag ][ attributeName ].variables
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
      switch (device[ deviceKey ].backgroundType) {
        case 'imagesSimple':
          backgroundElements.push(
            <ImageSimpleBackground deviceData={device[ deviceKey ]} deviceKey={deviceKey} reactKey={reactKey} key={reactKey} />)
          break
        case 'imagesSlideshow':
          backgroundElements.push(
            <ImageSlideshowBackground deviceData={device[ deviceKey ]} deviceKey={deviceKey} reactKey={reactKey} key={reactKey} />)
          break
        case 'videoYoutube':
          backgroundElements.push(
            <YoutubeBackground deviceData={device[ deviceKey ]} deviceKey={deviceKey} reactKey={reactKey} key={reactKey} />)
          break
        case 'videoVimeo':
          backgroundElements.push(
            <VimeoBackground deviceData={device[ deviceKey ]} deviceKey={deviceKey} reactKey={reactKey} key={reactKey} />)
          break
        case 'videoEmbed':
          backgroundElements.push(
            <EmbedVideoBackground deviceData={device[ deviceKey ]} deviceKey={deviceKey} reactKey={reactKey} key={reactKey} />)
          break
      }

      // parallax
      if (gradientOverlay) {
        reactKey = `${this.props.id}-${deviceKey}-${device[ deviceKey ]}-gradientOverlay`
        backgroundElements.push(
          <ColorGradientBackground deviceData={device[ deviceKey ]} deviceKey={deviceKey} reactKey={reactKey}
            key={reactKey} applyBackground={this.applyDO('gradient')} />)
      }

      if (parallax) {
        reactKey = `${this.props.id}-${deviceKey}-${device[ deviceKey ]}-parallax`
        backgroundData.push(
          <ParallaxBackground deviceData={device[ deviceKey ]} deviceKey={deviceKey} reactKey={reactKey}
            key={reactKey} content={backgroundElements} />)
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

  render () {
    return null
  }
}

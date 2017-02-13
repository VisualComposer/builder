import React from 'react'
import ReactDOM from 'react-dom'
import lodash from 'lodash'
import YoutubeBackground from './youtubeBackground'
import VimeoBackground from './vimeoBackground'
import ImageSimpleBackground from './imageSimpleBackground'
import ImageSlideshowBackground from './imageSlideshowBackground'
import EmbedVideoBackground from './embedVideoBackground'
import ColorGradientBackground from './colorGradientBackground'

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

  applyDO (prop) {
    prop += ` el-${this.props.id}`
    return {
      'data-vce-do-apply': prop
    }
  }

  getMixinData (mixinName) {
    const vcCake = require('vc-cake')
    const wipAssetsStorage = vcCake.getService('wipAssetsStorage')
    let returnData = null
    let mixinData = wipAssetsStorage.getCssMixinsByElement(this.props.atts)
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
    const wipAssetsStorage = vcCake.getService('wipAssetsStorage')
    let returnData = null
    let mixinData = wipAssetsStorage.getAttributesMixinsByElement(this.props.atts)
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
      let reactKey = `${this.props.id}-${deviceKey}-${device[ deviceKey ].backgroundType}`
      switch (device[ deviceKey ].backgroundType) {
        case 'imagesSimple':
          backgroundData.push(
            <ImageSimpleBackground deviceData={device[deviceKey]} deviceKey={deviceKey} reactKey={reactKey} key={reactKey} applyBackground={this.applyDO('background')} />)
          break
        case 'imagesSlideshow':
          backgroundData.push(
            <ImageSlideshowBackground deviceData={device[deviceKey]} deviceKey={deviceKey} reactKey={reactKey} key={reactKey} applyBackground={this.applyDO('background')} />)
          break
        case 'videoYoutube':
          backgroundData.push(
            <YoutubeBackground deviceData={device[deviceKey]} deviceKey={deviceKey} reactKey={reactKey} key={reactKey} applyBackground={this.applyDO('background')} />)
          break
        case 'videoVimeo':
          backgroundData.push(
            <VimeoBackground deviceData={device[deviceKey]} deviceKey={deviceKey} reactKey={reactKey} key={reactKey} applyBackground={this.applyDO('background')} />)
          break
        case 'videoEmbed':
          backgroundData.push(
            <EmbedVideoBackground deviceData={device[deviceKey]} deviceKey={deviceKey} reactKey={reactKey} key={reactKey} applyBackground={this.applyDO('background')} />)
          break
        case 'colorGradient':
          backgroundData.push(
            <ColorGradientBackground deviceData={device[deviceKey]} deviceKey={deviceKey} reactKey={reactKey} key={reactKey} applyBackground={this.applyDO('background')} />)
          break
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

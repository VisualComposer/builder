import React from 'react'
import ReactDOM from 'react-dom'
import lodash from 'lodash'
import classNames from 'classnames'
import YoutubeBackground from './youtubeBackground'
import VimeoBackground from './vimeoBackground'

const { Component, PropTypes } = React

export default class ElementComponent extends Component {
  static propTypes = {
    id: PropTypes.string,
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

  getMixinData (mixinName) {
    const vcCake = require('vc-cake')
    const assetsManager = vcCake.getService('assets-manager')
    const wipAssetsStorage = vcCake.getService('wipAssetsStorage')
    let returnData = null
    let mixinData = assetsManager.getCssMixinsByElement(this.props.atts)
    if (vcCake.env('FEATURE_ASSETS_MANAGER')) {
      mixinData = wipAssetsStorage.getCssMixinsByElement(this.props.atts)
    }
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
    if (!vcCake.env('FEATURE_ASSETS_MANAGER')) {
      return null
    }
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
      switch (device[ deviceKey ].backgroundType) {
        case 'imagesSimple':
          backgroundData.push(this.getImagesSimple(device[ deviceKey ], deviceKey))
          break
        case 'imagesSlideshow':
          backgroundData.push(this.getImagesSlideshow(device[ deviceKey ], deviceKey))
          break
        case 'videoYoutube':
          backgroundData.push(this.getYoutubeVideo(device[ deviceKey ], deviceKey))
          break
        case 'videoVimeo':
          backgroundData.push(this.getVimeoVideo(device[ deviceKey ], deviceKey))
          break
        case 'videoSelfHosted':
          break
      }
    })
    return <div className='vce-content-background-container'>
      {backgroundData}
    </div>
  }

  getImagesSimple (device, key) {
    let { images, backgroundStyle } = device
    let reactKey = `${this.props.id}-${key}-${device.backgroundType}`
    if (images && images.urls && images.urls.length) {
      let imagesJSX = []
      images.urls.forEach((imgData) => {
        let styles = {
          backgroundImage: `url(${imgData.full})`
        }
        let imgKey = `${reactKey}-${imgData.id}`
        imagesJSX.push((
          <div className='vce-asset-background-simple-item' style={styles} key={imgKey} />
        ))
      })
      let containerClasses = [
        `vce-asset-background-simple-container`,
        `vce-visible-${key}-only`
      ]
      if (backgroundStyle) {
        containerClasses.push(`vce-asset-background-simple--style-${backgroundStyle}`)
      }
      let slideshowClasses = classNames([
        `vce-asset-background-simple`
      ])
      return <div className={classNames(containerClasses)} data-vce-assets-parallax='.vce-asset-background-simple' key={reactKey}>
        <div className={classNames(slideshowClasses)}>
          {imagesJSX}
        </div>
      </div>
    }
    return null
  }

  getImagesSlideshow (device, key) {
    let { images, backgroundStyle, sliderTimeout } = device
    if (!sliderTimeout) {
      sliderTimeout = 5
    }
    let reactKey = `${this.props.id}-${key}-${device.backgroundType}`
    if (images && images.urls && images.urls.length) {
      let imagesJSX = []
      images.urls.forEach((imgData) => {
        let styles = {
          backgroundImage: `url(${imgData.full})`
        }
        let imgKey = `${reactKey}-${imgData.id}`
        imagesJSX.push((
          <div className='vce-asset-background-slider-item' style={styles} key={imgKey} />
        ))
      })
      let containerClasses = [
        `vce-asset-background-slider-container`,
        `vce-visible-${key}-only`
      ]
      if (backgroundStyle) {
        containerClasses.push(`vce-asset-background-slider--style-${backgroundStyle}`)
      }
      let slideshowClasses = [
        `vce-asset-background-slider`
      ]
      return <div className={classNames(containerClasses)} key={reactKey}>
        <div className={classNames(slideshowClasses)} data-vce-assets-slider={sliderTimeout}
          data-vce-assets-slider-slide='.vce-asset-background-slider-item'>
          {imagesJSX}
        </div>
      </div>
    }
    return null
  }

  getYoutubeVideo (device, key) {
    let { videoYoutube } = device
    let reactKey = `${this.props.id}-${key}-${device.backgroundType}`
    let ytrx = /^.*((youtu\.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&\?]*)(?:(\?t|&start)=(?:(\d+)h)?(?:(\d+)m)?(\d+)s)?.*/
    if (videoYoutube && videoYoutube.search(ytrx) !== -1) {
      let videoData = videoYoutube.trim().match(ytrx)
      let videoId = videoData[ 7 ]
      let playerSettings = {
        videoId: videoId
      }
      const { ...otherProps } = this.props
      return <YoutubeBackground {...otherProps} settings={playerSettings} device={key}
        reactKey={reactKey} key={reactKey}
        updateInlineHtml={this.updateInlineHtml} />
    }

    return null
  }

  getVimeoVideo (device, key) {
    let { videoVimeo } = device
    let reactKey = `${this.props.id}-${key}-${device.backgroundType}`
    let vrx = /https?:\/\/(?:www\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|)(\d+)(?:$|\/|\?)/
    if (videoVimeo && videoVimeo.search(vrx) !== -1) {
      let videoData = videoVimeo.trim().match(vrx)
      let videoId = videoData[ 3 ]
      let playerSettings = {
        videoId: videoId
      }
      const { ...otherProps } = this.props
      return <VimeoBackground {...otherProps} settings={playerSettings} device={key}
        reactKey={reactKey} key={reactKey} />
    }
    return null
  }

  render () {
    return null
  }
}

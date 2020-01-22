import React from 'react'
import PropTypes from 'prop-types'
import shapes from './shapes'

export default class DividerShape extends React.Component {
  static propTypes = {
    width: PropTypes.string,
    height: PropTypes.string,
    fill: PropTypes.string,
    shape: PropTypes.string,
    fillType: PropTypes.string,
    backgroundImage: PropTypes.string,
    id: PropTypes.string,
    flipHorizontally: PropTypes.bool,
    deviceKey: PropTypes.string,
    videoEmbed: PropTypes.object,
    percentageHeight: PropTypes.string,
    videoYoutube: PropTypes.string,
    videoVimeo: PropTypes.string
  }

  setAlphaForColor (color, alpha = '1') {
    if (color.indexOf('rgba') >= 0) {
      const values = color.match(/[\d.]+/g)
      if (values[3] && values[3] !== '1') {
        values[3] = alpha
        color = `rgba(${values.join(',')})`
      }
    }

    return color
  }

  getAlphaFromColor (color) {
    let alpha = '1'
    if (color.indexOf('rgba') >= 0) {
      const values = color.match(/[\d.]+/g)
      values[3] && (alpha = values[3])
    }

    return alpha
  }

  getLinearGradient () {
    if (this.props.fillType !== 'gradient') {
      return null
    }

    let startColor = this.setAlphaForColor(this.props.gradientColorStart)
    let startColorAlpha = this.getAlphaFromColor(this.props.gradientColorStart)
    let endColor = this.setAlphaForColor(this.props.gradientColorEnd)
    let endColorAlpha = this.getAlphaFromColor(this.props.gradientColorEnd)
    const angle = this.props.gradientAngle

    if (this.props.flipHorizontally) {
      startColor = this.setAlphaForColor(this.props.gradientColorEnd)
      startColorAlpha = this.getAlphaFromColor(this.props.gradientColorEnd)
      endColor = this.setAlphaForColor(this.props.gradientColorStart)
      endColorAlpha = this.getAlphaFromColor(this.props.gradientColorStart)
    }

    let id = `gradient-${this.props.id}-${this.props.deviceKey}`
    if (this.props.type) {
      id = `gradient-${this.props.id}-${this.props.deviceKey}-${this.props.type}`
    }

    return (
      <linearGradient id={id} gradientUnits='objectBoundingBox' gradientTransform={`rotate(${angle || '0'} 0.5 0.5)`}>
        <stop offset='0%' style={{ stopColor: startColor, stopOpacity: startColorAlpha }} />
        <stop offset='100%' style={{ stopColor: endColor, stopOpacity: endColorAlpha }} />
      </linearGradient>
    )
  }

  changePercentageHeight (height, svgContent, position, defaultWidth, defaultHeight) {
    const heightToPx = defaultWidth * height / 100
    const difference = heightToPx - defaultHeight

    const parser = new window.DOMParser()
    const doc = parser.parseFromString(svgContent, 'text/html')

    let paths = doc.querySelectorAll('path')
    paths = [].slice.call(paths)
    paths.forEach((path) => {
      const d = path.getAttribute('d')
      const commands = d.split(/(?=[LMCZ])/)
      commands.pop()

      const pointArrays = commands.map((d) => {
        const letter = d[0]
        const pointsArray = d.slice(1, d.length).split(' ')
        const points = []
        pointsArray.forEach((item) => {
          if (item !== '') {
            const coordinates = item.split(',')
            let newY = parseFloat(coordinates[1])
            const pointToPx = defaultHeight * newY
            const newPointToPx = pointToPx + difference

            if (position === 'top') {
              if (newY !== 0 && newY !== 1) {
                newY = newPointToPx / heightToPx
              }
            } else {
              if (newY !== 0 && newY !== 1) {
                newY = pointToPx / heightToPx
              }
            }
            points.push(coordinates[0] + ',' + newY)
          }
        })

        return letter + points.join(' ')
      })
      path.setAttribute('d', `${pointArrays.join(' ')} Z`)
    })

    return doc.body && doc.body.innerHTML
  }

  changeHeight (height, svgContent, position, defaultHeight) {
    const parser = new window.DOMParser()
    const doc = parser.parseFromString(svgContent, 'text/html')
    height = parseFloat(height)
    let paths = doc.querySelectorAll('path')
    paths = [].slice.call(paths)
    paths.forEach((path) => {
      const d = path.getAttribute('d')
      const commands = d.split(/(?=[LMCZ])/)
      commands.pop()

      const pointArrays = commands.map((d) => {
        const letter = d[0]
        const pointsArray = d.slice(1, d.length).split(' ')
        const points = []
        pointsArray.forEach((item) => {
          if (item !== '') {
            const coordinates = item.split(',')
            let newX = parseFloat(coordinates[1])
            if (position === 'top') {
              if (newX !== 0) {
                newX = newX + height
              }
            } else {
              if (newX - defaultHeight !== 0) {
                newX = newX - height
              }
            }
            points.push(coordinates[0] + ',' + newX)
          }
        })

        return letter + points.join(' ')
      })
      path.setAttribute('d', `${pointArrays.join(' ')} Z`)
    })

    return doc.body && doc.body.innerHTML
  }

  render () {
    let { type, width, height, fill, shape, fillType, backgroundImage, deviceKey, id, videoEmbed, videoYoutube, videoVimeo, percentageHeight } = this.props
    let currentShape = shapes[shape]
    const viewBoxWidth = currentShape.viewBox && currentShape.viewBox.width
    const viewBoxHeight = currentShape.viewBox && currentShape.viewBox.height

    currentShape = currentShape && currentShape[`${type.toLowerCase()}`]

    if (!currentShape) {
      return null
    }

    let videoData = null
    let videoUrl = ''
    if (videoEmbed && videoEmbed.urls && videoEmbed.urls.length) {
      videoData = videoEmbed.urls[0]
      videoUrl = videoEmbed.urls[0].url
    }
    const svgContent = currentShape.content
    const svgUnitContent = currentShape.unitContent
    const viewBox = `0 0 ${viewBoxWidth} ${viewBoxHeight}`
    const position = type ? type.toLowerCase() : 'top'

    if (fillType === 'color' || fillType === 'gradient' || (fillType === 'image' && !backgroundImage) || (fillType === 'videoEmbed' && !videoUrl) || (fillType === 'videoYoutube' && !videoYoutube) || (fillType === 'videoVimeo' && !videoVimeo)) {
      let newHeight = height
      if (percentageHeight) {
        newHeight = viewBoxWidth * (parseFloat(percentageHeight) / 100)
      }
      const html = this.changeHeight(newHeight, svgContent, position, viewBoxHeight)
      const customAttributes = {}
      customAttributes.fill = fill

      if (fillType === 'gradient') {
        let gradientId = `gradient-${id}-${deviceKey}`

        if (type) {
          gradientId = `gradient-${id}-${deviceKey}-${type}`
        }

        customAttributes.fill = `url(#${gradientId})`
      }
      const svgProps = {
        viewBox: viewBox,
        width: width,
        preserveAspectRatio: 'none'
      }

      return (
        <svg className='vce-divider-svg' {...svgProps}>
          {this.getLinearGradient()}
          <g {...customAttributes} dangerouslySetInnerHTML={{ __html: html }} />
        </svg>
      )
    } else if (fillType === 'image') {
      const imageId = `image-el-${id}-${deviceKey}-${position}`
      let html = svgUnitContent
      const backgroundImageUrl = `url(${backgroundImage})`
      const percentage = width.replace('%', '')
      const imageProps = {}
      imageProps.style = {
        width: width
      }
      const imageBlockProps = {}
      imageBlockProps.style = {}
      const backgroundProps = {}
      backgroundProps.style = {
        backgroundImage: backgroundImageUrl,
        width: `${100 / percentage * 100}%`
      }

      if (percentageHeight) {
        percentageHeight = parseFloat(percentageHeight) + 10
        imageBlockProps.style.paddingBottom = `${percentageHeight}%`
        html = this.changePercentageHeight(percentageHeight, svgUnitContent, position, viewBoxWidth, viewBoxHeight)
      } else {
        imageProps.style.height = `${parseFloat(height)}px`
      }

      return (
        <div className='vce-divider-with-image' {...imageProps}>
          <svg className='vce-divider-svg'>
            <clipPath id={imageId} dangerouslySetInnerHTML={{ __html: html }} clipPathUnits='objectBoundingBox' />
          </svg>
          <div {...imageBlockProps} className='vce-divider-image-block'>
            <div {...backgroundProps} className='vce-divider-image-background-block' />
          </div>
        </div>
      )
    } else if (fillType === 'videoEmbed') {
      const imageId = `video-el-${id}-${deviceKey}-${position}`
      let html = svgUnitContent
      const percentage = width.replace('%', '')
      const videoProps = {}
      videoProps.style = {
        width: width
      }

      const videoBlockProps = {}
      videoBlockProps.style = {}
      const backgroundProps = {}
      backgroundProps.style = {
        width: `${100 / percentage * 100}%`
      }

      if (percentageHeight) {
        percentageHeight = parseFloat(percentageHeight) + 10
        videoBlockProps.style.paddingBottom = `${percentageHeight}%`
        html = this.changePercentageHeight(percentageHeight, svgUnitContent, position, viewBoxWidth, viewBoxHeight)
      } else {
        videoBlockProps.style.height = `${parseFloat(height)}px`
      }

      return (
        <div className='vce-divider-with-video' {...videoProps}>
          <svg className='vce-divider-svg'>
            <clipPath id={imageId} dangerouslySetInnerHTML={{ __html: html }} clipPathUnits='objectBoundingBox' />
          </svg>
          <div {...videoBlockProps} className='vce-divider-video-block'>
            <div {...backgroundProps} className='vce-divider-video-background-block'>
              <div
                className='vce-divider-video-background-inner-block'
                data-vce-assets-video-embed={videoData.id}
                data-vce-assets-video-replacer='.vce-asset-video-embed-player'
                data-vce-assets-video-orientation-class='vce-asset-video-embed--state-landscape'
              >
                <svg className='vce-asset-video-embed-sizer' />
                <video className='vce-asset-video-embed-player'>
                  <source src={videoUrl} type='video/mp4' />
                </video>
              </div>
            </div>
          </div>
        </div>
      )
    } else if (fillType === 'videoYoutube') {
      const ytrx = /^.*((youtu\.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*)(?:(\?t|&start)=(?:(\d+)h)?(?:(\d+)m)?(\d+)s)?.*/
      if (videoYoutube && videoYoutube.search(ytrx) !== -1) {
        const youtubeVideoId = `video-el-${id}-${deviceKey}-${position}`
        let html = svgUnitContent
        const percentage = width.replace('%', '')
        const videoProps = {}
        videoProps.style = {
          width: width
        }

        const videoBlockProps = {}
        videoBlockProps.style = {}
        const backgroundProps = {}
        backgroundProps.style = {
          width: `${100 / percentage * 100}%`
        }

        if (percentageHeight) {
          percentageHeight = parseFloat(percentageHeight) + 10
          videoBlockProps.style.paddingBottom = `${percentageHeight}%`
          html = this.changePercentageHeight(percentageHeight, svgUnitContent, position, viewBoxWidth, viewBoxHeight)
        } else {
          videoBlockProps.style.height = `${parseFloat(height)}px`
        }

        const videoData = videoYoutube.trim().match(ytrx)
        const videoId = videoData[7]

        const playerSettings = {
          videoId: videoId
        }

        const vcvHelperHTML = '<div class=\'vce-asset-video-yt-player\' />'

        return (
          <div className='vce-divider-with-video' {...videoProps}>
            <svg className='vce-divider-svg'>
              <clipPath
                id={youtubeVideoId} dangerouslySetInnerHTML={{ __html: html }}
                clipPathUnits='objectBoundingBox'
              />
            </svg>
            <div {...videoBlockProps} className='vce-divider-video-block'>
              <div {...backgroundProps} className='vce-divider-video-background-block'>
                <div
                  className='vce-divider-video-background-inner-block'
                  data-vce-assets-video-yt={playerSettings.videoId}
                  data-vce-assets-video-replacer='.vce-asset-video-yt-player'
                  data-vce-assets-video-orientation-class='vce-asset-video-yt--state-landscape'
                >
                  <svg className='vce-asset-video-yt-sizer' width='0' height='0' />
                  <div className='vcvhelper' data-vcvs-html={vcvHelperHTML} dangerouslySetInnerHTML={{ __html: vcvHelperHTML }} />
                </div>
              </div>
            </div>
          </div>
        )
      }

      return null
    } else if (fillType === 'videoVimeo') {
      const vrx = /https?:\/\/(?:www\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/([^/]*)\/videos\/|album\/(\d+)\/video\/|)(\d+)(?:$|\/|\?)/
      if (videoVimeo && videoVimeo.search(vrx) !== -1) {
        const vimeoVideoId = `video-el-${id}-${deviceKey}-${position}`
        let html = svgUnitContent
        const percentage = width.replace('%', '')
        const videoProps = {}
        videoProps.style = {
          width: width
        }

        const videoBlockProps = {}
        videoBlockProps.style = {}
        const backgroundProps = {}
        backgroundProps.style = {
          width: `${100 / percentage * 100}%`
        }

        if (percentageHeight) {
          percentageHeight = parseFloat(percentageHeight) + 10
          videoBlockProps.style.paddingBottom = `${percentageHeight}%`
          html = this.changePercentageHeight(percentageHeight, svgUnitContent, position, viewBoxWidth, viewBoxHeight)
        } else {
          videoBlockProps.style.height = `${parseFloat(height)}px`
        }

        const videoData = videoVimeo.trim().match(vrx)
        const videoId = videoData[3]
        const playerSettings = {
          videoId: videoId
        }
        const vcvHelperHTML = '<div class=\'vce-asset-video-vimeo-player\' />'

        return (
          <div className='vce-divider-with-video' {...videoProps}>
            <svg className='vce-divider-svg'>
              <clipPath
                id={vimeoVideoId} dangerouslySetInnerHTML={{ __html: html }}
                clipPathUnits='objectBoundingBox'
              />
            </svg>
            <div {...videoBlockProps} className='vce-divider-video-block'>
              <div {...backgroundProps} className='vce-divider-video-background-block'>
                <div
                  className='vce-divider-video-background-inner-block'
                  data-vce-assets-video-vimeo={playerSettings.videoId}
                  data-vce-assets-video-replacer='.vce-asset-video-vimeo-player'
                  data-vce-assets-video-orientation-class='vce-asset-video-vimeo--state-landscape'
                >
                  <svg className='vce-asset-video-vimeo-sizer' />
                  <div className='vcvhelper' data-vcvs-html={vcvHelperHTML} dangerouslySetInnerHTML={{ __html: vcvHelperHTML }} />
                </div>
              </div>
            </div>
          </div>
        )
      }
    }

    return null
  }
}

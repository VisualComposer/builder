import { getService } from 'vc-cake'
const { parseDynamicBlock } = getService('utils')

const parseSize = (size, isRound, naturalWidth, naturalHeight) => {
  let crop = true
  if (typeof size === 'string') {
    size = size.replace(/\s/g, '').replace(/px/g, '').toLowerCase().split('x')
  } else if (typeof size === 'object') {
    crop = size.crop
    size = [size.width, size.height]
  }

  naturalWidth = parseInt(naturalWidth)
  naturalHeight = parseInt(naturalHeight)

  const cropHorizontal = parseInt(size[0]) < naturalWidth
  const cropVertical = parseInt(size[1]) < naturalHeight

  if (crop) {
    size[0] = parseInt(size[0]) < naturalWidth ? parseInt(size[0]) : naturalWidth
    size[1] = parseInt(size[1]) < naturalHeight ? parseInt(size[1]) : naturalHeight
  } else {
    size[0] = cropHorizontal ? parseInt(size[0]) : naturalWidth
    size[1] = cropVertical ? parseInt(size[1]) : naturalHeight

    if (cropHorizontal && !cropVertical) {
      const prop = size[0] / naturalWidth
      size[1] = parseInt(naturalHeight * prop)
    }

    if (cropVertical && !cropHorizontal) {
      const prop = size[1] / naturalHeight
      size[0] = parseInt(naturalWidth * prop)
    }

    if (cropVertical && cropHorizontal) {
      if (naturalHeight < naturalWidth) {
        const prop = size[0] / naturalWidth
        size[1] = parseInt(naturalHeight * prop)
      } else {
        const prop = size[1] / naturalHeight
        size[0] = parseInt(naturalWidth * prop)
      }
    }
  }

  if (isRound) {
    const smallestSize = size[0] >= size[1] ? size[1] : size[0]
    size = {
      width: smallestSize,
      height: smallestSize
    }
  } else {
    size = {
      width: size[0],
      height: size[1]
    }
  }
  return size
}

const checkRelatedSize = (size) => {
  let relatedSize = null
  if (window.vcvImageSizes && window.vcvImageSizes[size]) {
    relatedSize = window.vcvImageSizes[size]
  }
  return relatedSize
}

export const getSizes = (atts, img) => {
  if (!img) {
    return {
      width: '',
      height: ''
    }
  }
  let { size, shape } = atts
  size = size.replace(/\s/g, '').replace(/px/g, '').toLowerCase()

  let parsedSize = ''

  if (size.match(/\d+(x)\d+/)) {
    parsedSize = parseSize(size, shape === 'round', img.width, img.height)
  } else {
    parsedSize = checkRelatedSize(size)

    if (parsedSize) {
      parsedSize = parseSize(parsedSize, shape === 'round', img.width, img.height)
    } else {
      parsedSize = parseSize({ width: img.width, height: img.height }, shape === 'round', img.width, img.height)
    }
  }

  return {
    width: parsedSize.width,
    height: parsedSize.height
  }
}

export const getImageShortcode = (options, image, state) => {
  const { props, classes, isDefaultImage, src, isDynamicImage, naturalSizes } = options

  let shortcode = `[vcvSingleImage class="${classes}" data-width="${state.parsedWidth || 0}" data-height="${state.parsedHeight || 0}" src="${src}" data-img-src="${props['data-img-src']}" data-attachment-id="${props['data-attachment-id']}" `

  let alt = props.alt
  let title = props.title
  if (isDefaultImage) {
    shortcode += ' data-default-image="true"'
  }

  if (isDynamicImage) {
    const blockInfo = parseDynamicBlock(image.full)
    shortcode += ` data-dynamic="${blockInfo.blockAtts.value}"`
    try {
      const url = new URL(blockInfo.blockAtts.currentValue)
      const urlParams = new URLSearchParams(url.search)

      if (urlParams.get('alt')) {
        alt = urlParams.get('alt')
      }

      if (urlParams.get('title')) {
        title = urlParams.get('title')
      }
    } catch (e) {
      // In case if dynamicField (noValue)
      console.warn('URL is not valid, skipping', blockInfo, blockInfo.blockAtts.currentValue)
    }

    if (naturalSizes) {
      shortcode += ' data-dynamic-natural-size="true"'
    }
  }

  shortcode += ` alt="${alt}" title="${title}" ]`

  return shortcode
}

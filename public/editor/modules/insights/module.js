import { getStorage, env, add } from 'vc-cake'
import { debounce, memoize } from 'lodash'

const insightsStorage = getStorage('insights')
const historyStorage = getStorage('history')

add('insights', () => {
  const localizations = window.VCV_I18N ? window.VCV_I18N() : {}
  let isImagesSizeLarge = false

  // VC: Insights
  class InsightsChecks {
    static checkForHeadings () {
      const headings = env('iframe').document.body.querySelectorAll('h1')
      let visibleHeadings = 0
      for (let i = 0; i < headings.length; i++) {
        const heading = headings[i]
        if (heading.offsetParent !== null) {
          // we found at least one <h1>, done!
          visibleHeadings++
          break
        }
      }
      if (visibleHeadings === 0) {
        const h1MissingTitle = localizations.insightsH1MissingTitle
        const h1MissingDescription = localizations.insightsH1MissingDescription
        insightsStorage.trigger('add', {
          state: 'critical',
          type: 'noH1',
          title: h1MissingTitle,
          groupDescription: h1MissingDescription
        })
      } else {
        const insightsH1ExistsTitle = localizations.insightsH1ExistsTitle
        const insightsH1ExistsDescription = localizations.insightsH1ExistsDescription
        insightsStorage.trigger('add', {
          state: 'success',
          type: 'existH1',
          title: insightsH1ExistsTitle,
          groupDescription: insightsH1ExistsDescription
        })
      }
    }

    static checkForAlt () {
      const images = env('iframe').document.body.querySelectorAll('img')
      let allImagesHasAlt = true
      images.forEach((image) => {
        if (!image.alt || image.alt === '') {
          const altMissingTitle = localizations.insightsImageAltAttributeMissingTitle
          const description = localizations.insightsImageAltAttributeMissingDescription
          const elementId = InsightsChecks.getElementId(image)
          const position = InsightsChecks.getNodePosition(image)
          allImagesHasAlt = false
          insightsStorage.trigger('add', {
            state: 'critical',
            type: `altMissing${position}`,
            thumbnail: image.src,
            title: position !== 'Content' ? `${position}: ${altMissingTitle}` : altMissingTitle,
            groupDescription: description,
            description: `Alt is empty for ${elementId}`,
            elementID: elementId
          })
        }
      })
      if (allImagesHasAlt) {
        const altExistsTitle = localizations.insightsImageAltAttributeExistsTitle
        const altExistsDescription = localizations.insightsImageAltAttributeExistsDescription
        insightsStorage.trigger('add', {
          state: 'success',
          type: 'altExists',
          title: altExistsTitle,
          groupDescription: altExistsDescription
        })
      }
    }

    static checkForImageSize () {
      const images = env('iframe').document.body.querySelectorAll('img')
      const promises = []
      images.forEach((image) => {
        promises.push(InsightsChecks.getImageSize(image.src, image))
      })
      return promises
    }

    static checkForBgImageSize () {
      function getBgImgs (doc) {
        const srcChecker = /url\(\s*?['"]?\s*?(\S+?)\s*?["']?\s*?\)/i
        return Array.from(
          Array.from(doc.querySelectorAll('*')).reduce((collection, node) => {
            const prop = window.getComputedStyle(node, null)
              .getPropertyValue('background-image')
            // match `url(...)`
            const match = srcChecker.exec(prop)
            if (match) {
              collection.add({ src: match[1], domNode: node })
            }
            return collection
          }, new Set())
        )
      }

      const bgImages = getBgImgs(env('iframe').document)
      const promises = []
      bgImages.forEach((data) => {
        promises.push(InsightsChecks.getImageSize(data.src, data.domNode, 'background'))
      })
      return promises
    }

    static async checkForImagesSize () {
      const promises = InsightsChecks.checkForImageSize()
      promises.concat(InsightsChecks.checkForBgImageSize())
      await Promise.all(promises)

      if (!isImagesSizeLarge) {
        const imageSizeProperTitle = localizations.insightsImagesSizeProperTitle
        const imageSizeProperDescription = localizations.insightsImagesSizeProperDescription
        insightsStorage.trigger('add', {
          state: 'success',
          type: 'imgSizeProper',
          title: imageSizeProperTitle,
          groupDescription: imageSizeProperDescription
        })
      }
    }

    static async getImageSize (src, domNode, type = '') {
      const imageSizeBytes = await InsightsChecks.getImageSizeRequest(src)
      if (imageSizeBytes && imageSizeBytes >= 1024 * 1024) {
        const imageSizeBigTitle = type === 'background' ? localizations.insightsBgImageSizeBigTitle : localizations.insightsImageSizeBigTitle
        let description = localizations.insightsImageSizeBigDescription
        const position = InsightsChecks.getNodePosition(domNode)
        const elementId = InsightsChecks.getElementId(domNode)
        const imageSizeInMB = imageSizeBytes / 1024 / 1024
        description = description.replace('%s', '1 MB')
        isImagesSizeLarge = true
        insightsStorage.trigger('add', {
          state: 'critical',
          type: `imgSize1MB${position}`,
          thumbnail: src,
          title: position !== 'Content' ? `${position}: ${imageSizeBigTitle}` : imageSizeBigTitle,
          groupDescription: description,
          description: `Image size is ${imageSizeInMB.toFixed(2)} MB`,
          elementID: elementId
        })
      } else if (imageSizeBytes && imageSizeBytes >= 500 * 1024) {
        const imageSizeBigTitle = type === 'background' ? localizations.insightsBgImageSizeBigTitle : localizations.insightsImageSizeBigTitle
        let description = localizations.insightsImageSizeBigDescription
        const position = InsightsChecks.getNodePosition(domNode)
        const elementId = InsightsChecks.getElementId(domNode)
        description = description.replace('%s', '500 KB')
        isImagesSizeLarge = true
        insightsStorage.trigger('add', {
          state: 'warning',
          type: `imgSize500KB${position}`,
          thumbnail: src,
          title: position !== 'Content' ? `${position}: ${imageSizeBigTitle}` : imageSizeBigTitle,
          groupDescription: description,
          description: `Image size is ${parseInt(imageSizeBytes / 1024)} KB`,
          elementID: elementId
        })
      }
    }

    static getImageSizeRequest = memoize((imageUrl) => {
      return new Promise((resolve, reject) => {
        const xhr = new window.XMLHttpRequest()
        xhr.open('HEAD', imageUrl, true)
        xhr.onload = function () {
          if (!(this.status >= 200 && this.status < 300)) {
            reject(new Error(`Wrong network status received: ${this.status} ${imageUrl}`))
          }
        }
        xhr.onreadystatechange = function () {
          if (xhr.readyState === 4 && xhr.status === 200) {
            resolve(xhr.getResponseHeader('Content-Length'))
          }
        }
        xhr.onerror = function (error) {
          reject(new Error(`Wrong network response received:${error}`))
        }
        xhr.send(null)
      })
    })

    static getElementId (domNode) {
      if (domNode.hasAttribute('data-vcv-element')) {
        return domNode.getAttribute('data-vcv-element')
      } else {
        const closestParent = domNode.closest('[data-vcv-element]')
        return closestParent ? closestParent.getAttribute('data-vcv-element') : false
      }
    }

    static getNodePosition (domNode) {
      const contentRoot = env('iframe').document.getElementById('vcv-editor')
      const documentPosition = domNode.compareDocumentPosition(contentRoot)
      if (documentPosition & window.Node.DOCUMENT_POSITION_CONTAINS) {
        return 'Content'
      } else if (documentPosition & window.Node.DOCUMENT_POSITION_FOLLOWING) {
        // Left Sidebar
        return domNode.closest('[data-vcv-layout-zone="sidebar"]') ? 'Left Sidebar' : 'Header'
      } else if (documentPosition & window.Node.DOCUMENT_POSITION_PRECEDING) {
        // Right Sidebar
        return domNode.closest('[data-vcv-layout-zone="sidebar"]') ? 'Right Sidebar' : 'Footer'
      }
    }
  }

  historyStorage.on('init add undo redo', debounce(() => {
    // clear previous <Insights>
    insightsStorage.trigger('reset')
    isImagesSizeLarge = false

    // Do all checks
    InsightsChecks.checkForHeadings()
    InsightsChecks.checkForAlt()
    InsightsChecks.checkForImagesSize()
  }, 5000))
})

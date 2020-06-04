import { addStorage, getStorage, getService, env } from 'vc-cake'
import TimeMachine from './lib/timeMachine'
import { debounce, memoize } from 'lodash'

const insightsStorage = getStorage('insights')

/**
 * History storage
 */
addStorage('history', (storage) => {
  const elementsStorage = getStorage('elements')
  const workspaceStorage = getStorage('workspace')
  const elementsTimeMachine = new TimeMachine('layout')
  const documentService = getService('document')
  const localizations = window.VCV_I18N ? window.VCV_I18N() : {}
  let inited = false
  let lockedReason = ''
  let isImagesSizeLarge = false
  console.log('set to false')
  const checkUndoRedo = () => {
    storage.state('canRedo').set(inited && elementsTimeMachine.canRedo())
    storage.state('canUndo').set(inited && elementsTimeMachine.canUndo())
  }
  const updateElementsStorage = () => {
    elementsStorage.trigger('updateAll', elementsTimeMachine.get())
  }
  storage.on('undo', () => {
    if (!inited) {
      return
    }
    elementsTimeMachine.undo()
    // here comes get with undo data
    updateElementsStorage()
    checkUndoRedo()
  })
  storage.on('redo', () => {
    if (!inited) {
      return
    }
    elementsTimeMachine.redo()
    // here comes get with redo data
    updateElementsStorage()
    checkUndoRedo()
  })
  storage.on('init', (data = false) => {
    if (data) {
      inited = true
      elementsTimeMachine.clear()
      elementsTimeMachine.setZeroState(data)
    }
    checkUndoRedo()
  })
  storage.on('add', (data) => {
    if (!inited) {
      return
    }
    elementsTimeMachine.add(data)
    checkUndoRedo()
  })
  workspaceStorage.state('settings').onChange((data) => {
    if (data && data.action === 'edit' && data.elementAccessPoint.id) {
      inited = false
      lockedReason = 'edit'
    } else if (!inited) {
      inited = true
      lockedReason === 'edit' && elementsTimeMachine.add(documentService.all())
      lockedReason = ''
    }
    checkUndoRedo()
  })
  // States for undo/redo
  storage.state('canUndo').set(false)
  storage.state('canRedo').set(false)

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
            type: `altMissing:${elementId}:${position}`,
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
      images.forEach(async function (image) {
        await InsightsChecks.getImageSize(image.src, image)
      })
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
      bgImages.forEach(async function (data) {
        await InsightsChecks.getImageSize(data.src, data.domNode, 'background')
      })
    }

    static checkForImagesSize () {
      InsightsChecks.checkForImageSize()
      InsightsChecks.checkForBgImageSize()
      // TODO get promise with all the parsed images and then check for isImagesSizeLarge
      // if (!isImagesSizeLarge) {
      //   const imageSizeProperTitle = localizations.insightsImagesSizeProperTitle
      //   let imageSizeProperDescription = localizations.insightsImagesSizeProperDescription
      //   insightsStorage.trigger('add', {
      //     state: 'success',
      //     type: 'imgSizeProper',
      //     title: imageSizeProperTitle,
      //     groupDescription: imageSizeProperDescription
      //   })
      // }
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
          type: `imgSize1MB:${elementId}:${position}`,
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
          type: `imgSize500KB:${elementId}:${position}`,
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
        return 'Header'
      } else if (documentPosition & window.Node.DOCUMENT_POSITION_PRECEDING) {
        return 'Footer'
      }
    }
  }

  storage.on('init add undo redo', debounce(() => {
    // clear previous <Insights>
    insightsStorage.trigger('cleanAll')

    // Do all checks
    InsightsChecks.checkForHeadings()
    InsightsChecks.checkForAlt()
    InsightsChecks.checkForImagesSize()
  }, 5000))
})

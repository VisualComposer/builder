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
  let inited = false
  let lockedReason = ''
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
      headings.forEach((heading) => {
        if (heading.offsetParent !== null) {
          visibleHeadings++
          // TODO: Maybe remove this check, because <h1> can be than one in page (it is fine)
          if (visibleHeadings > 1) {
            insightsStorage.trigger('add', {
              state: 'warning',
              type: 'multipleH1',
              title: 'There are more than one H1 tags on the page',
              description: 'Nice job!',
              elementID: InsightsChecks.getElementId(heading)
            })
          }
        }
      })
      if (visibleHeadings === 0) {
        insightsStorage.trigger('add', {
          state: 'critical',
          type: 'noH1',
          title: 'There are no H1 tags on the page',
          description: 'Nice job!'
        })
      }
    }

    static checkForAlt () {
      const images = env('iframe').document.body.querySelectorAll('img')
      images.forEach((image) => {
        if (!image.alt || image.alt === '') {
          insightsStorage.trigger('add', {
            state: 'critical',
            type: 'altMissing',
            title: 'alt tag missing',
            description: 'Not a Nice job!',
            elementID: InsightsChecks.getElementId(image)
          })
        }
      })
    }

    static checkForImageSize () {
      // Image size checker
      const images = env('iframe').document.body.querySelectorAll('img')
      images.forEach(async function (image) {
        await InsightsChecks.getImageSize(image.src, image)
      })
    }

    static checkForBgImageSize () {
      // Image size checker
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
        await InsightsChecks.getImageSize(data.src, data.domNode, 'Background')
      })
    }

    static async getImageSize (src, domNode, type = '') {
      const imageSize = await InsightsChecks.getImageSizeRequest(src)
      // if more than 500kb
      if (imageSize && imageSize >= 1024 * 1024) {
        insightsStorage.trigger('add', {
          state: 'critical',
          type: 'imgSizeBig' + InsightsChecks.getElementId(domNode),
          title: `${type} Image size is bigger than 1mb`.trim(),
          description: 'Not a Nice job!',
          elementID: InsightsChecks.getElementId(domNode)
        })
      } else if (imageSize && imageSize >= 500 * 1024) {
        insightsStorage.trigger('add', {
          state: 'warning',
          type: 'imgSizeBig' + InsightsChecks.getElementId(domNode),
          title: `${type} Image size is bigger than 500kb`,
          description: 'Not a Nice job!',
          elementID: InsightsChecks.getElementId(domNode)
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
  }

  storage.on('init add undo redo', debounce(() => {
    // clear previous <Insights>
    insightsStorage.trigger('cleanAll')

    // Do all checks
    InsightsChecks.checkForHeadings()
    InsightsChecks.checkForAlt()
    InsightsChecks.checkForImageSize()
    InsightsChecks.checkForBgImageSize()
  }, 5000))
})

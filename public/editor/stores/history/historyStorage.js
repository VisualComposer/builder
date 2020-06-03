import { addStorage, getStorage, getService, env } from 'vc-cake'
import TimeMachine from './lib/timeMachine'
import { debounce } from 'lodash'

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
  /**
   * Check all <h1> is there any available and is it visible
   */
  function checkForHeadings () {
    const headings = env('iframe').document.body.querySelectorAll('h1')
    let visibleHeadings = 0
    headings.forEach((heading) => {
      if (heading.offsetParent !== null) {
        visibleHeadings++
        if (visibleHeadings > 1) {
          console.warn('There are more than one H1 tags on the page')
          insightsStorage.trigger('add', {
            state: 'warning',
            type: 'multipleH1',
            title: 'There are more than one H1 tags on the page',
            description: 'Nice job!',
            elementID: getElementId(heading)
          })
        }
      }
    })
    if (visibleHeadings === 0) {
      console.warn('There are no H1 tags on the page')
      insightsStorage.trigger('add', {
        state: 'critical',
        type: 'noH1',
        title: 'There are no H1 tags on the page',
        description: 'Nice job!'
      })
    }
  }

  /**
   * Check all <img> on a page for missing 'alt' attribute
   */
  function checkForAlt () {
    const images = env('iframe').document.body.querySelectorAll('img')
    images.forEach((image) => {
      if (!image.alt || image.alt === '') {
        console.warn('alt tag missing', image)
        insightsStorage.trigger('add', {
          state: 'critical',
          type: 'altMissing',
          title: 'alt tag missing',
          description: 'Not a Nice job!',
          elementID: getElementId(image)
        })
      }
    })
  }

  // function checkForImageSize () {
  //   // Image size checker
  //   const images = env('iframe').document.body.querySelectorAll('img')
  //   images.forEach(async function (image) {
  //     const imageSize = await getImageSizeRequest(image.src)
  //     // if more than 500kb
  //     if (imageSize && imageSize >= 1024 * 1024) {
  //       console.warn('image size more than 1mb', imageSize, image, image.src)
  //     } else if (imageSize && imageSize >= 500 * 1024) {
  //       console.warn('image size more than 500kb', imageSize, image, image.src)
  //     }
  //   })
  //
  //   function getImageSizeRequest (imageUrl) {
  //     return new Promise((resolve, reject) => {
  //       const xhr = new XMLHttpRequest()
  //       xhr.open('HEAD', imageUrl, true)
  //       xhr.onload = function () {
  //         if (!(this.status >= 200 && this.status < 300)) {
  //           reject(false)
  //         }
  //       }
  //       xhr.onreadystatechange = function () {
  //         if (xhr.readyState === 4 && xhr.status === 200) {
  //           resolve(xhr.getResponseHeader('Content-Length'))
  //         }
  //       }
  //       xhr.onerror = function (error) {
  //         reject(false)
  //       }
  //       xhr.send(null)
  //     })
  //   }
  // }

  function getElementId (domNode) {
    if (domNode.hasAttribute('data-vcv-element')) {
      return domNode.getAttribute('data-vcv-element')
    } else {
      const closestParent = domNode.closest('[data-vcv-element]')
      return closestParent ? closestParent.getAttribute('data-vcv-element') : false
    }
  }

  storage.on('init add undo redo', debounce(() => {
    // clear previous <Insights>
    insightsStorage.trigger('cleanAll')

    // Do all checks
    checkForHeadings()
    checkForAlt()
    // checkForImageSize()
  }, 5000))
})

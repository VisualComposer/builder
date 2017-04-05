import { addStorage, getService } from 'vc-cake'

import CssBuilder from './lib/cssBuilder'

addStorage('assets', (storage) => {
  const documentManager = getService('document')
  // const assetsManager = getService('assetsManager')
  const stylesManager = getService('stylesManager')
  const elementAssetsLibrary = getService('elementAssetsLibrary')
  const assetsStorage = getService('modernAssetsStorage')
  const utils = getService('utils')
  const globalAssetsStorage = assetsStorage.getGlobalInstance()
  const assetsWindow = window.document.querySelector('.vcv-layout-iframe').contentWindow
  const builder = new CssBuilder(storage, globalAssetsStorage, elementAssetsLibrary, stylesManager, assetsWindow, utils.slugify)
  const data = { elements: {} }

  storage.on('addElement', (id) => {
    let ids = Array.isArray(id) ? id : [ id ]
    ids.forEach((id) => {
      const element = documentManager.get(id)
      data.elements[ id ] = element
      builder.add(element)
    })
  })
  storage.on('updateElement', (id) => {
    let ids = Array.isArray(id) ? id : [ id ]
    ids.forEach((id) => {
      const element = documentManager.get(id)
      data.elements[ id ] = element
      builder.update(element)
    })
  })
  storage.on('removeElement', (id) => {
    let ids = Array.isArray(id) ? id : [ id ]
    ids.forEach((id) => {
      let tag = data.elements[ id ] ? data.elements[ id ].tag : null
      delete data.elements[ id ]
      builder.destroy(id, tag)
    })
  })
  storage.on('resetElements', () => {
    globalAssetsStorage.resetElements(Object.keys(documentManager.all()))
  })

  let assetsFilesUsageCounter = {}
  let incrementAssetsFiles = (filesToAdd) => {
    const add = (file) => {
      let slug = utils.slugify(file)
      if (typeof assetsFilesUsageCounter[ slug ] === 'undefined') {
        assetsFilesUsageCounter[ slug ] = 1
      } else {
        assetsFilesUsageCounter[ slug ]++
      }
    }
    filesToAdd.forEach(add)
  }
  let decrementAssetsFiles = (filesToRemove) => {
    const remove = (file) => {
      let slug = utils.slugify(file)
      if (typeof assetsFilesUsageCounter[ slug ] === 'undefined') {
        window.console && window.console.warn && window.console.warn('File was not added before', slug, file)
        assetsFilesUsageCounter[ slug ] = 0
      } else {
        assetsFilesUsageCounter[ slug ]--
        if (assetsFilesUsageCounter[ slug ] < 0) {
          window.console && window.console.warn && window.console.warn('Attempt to decrement assets file more than needed', slug, file, assetsFilesUsageCounter[ slug ])
        }
      }
    }
    filesToRemove.forEach(remove)
  }
  let removeStaleFiles = () => {
    let files = storage.state('assetsFiles').get()
    let filesSet = new Set(files)
    filesSet.forEach((file) => {
      let slug = utils.slugify(file)
      if (typeof assetsFilesUsageCounter[ slug ] === 'undefined' || assetsFilesUsageCounter[ slug ] === 0) {
        filesSet.delete(file)
      }
    })
    storage.state('assetsFiles').set([ ...filesSet ])
  }
  storage.on('addAssetsFiles', (filesToAdd) => {
    let filesToAddSet = new Set([].concat(filesToAdd))
    incrementAssetsFiles([ ...filesToAddSet ])
    let assetsFiles = storage.state('assetsFiles').get()
    let mergedUniqueFiles = [ ...new Set(assetsFiles.concat(filesToAdd)) ]
    storage.state('assetsFiles').set(mergedUniqueFiles)
  })
  storage.on('removeAssetsFiles', (filesToRemove) => {
    let filesToRemoveSet = new Set([].concat(filesToRemove))
    decrementAssetsFiles([ ...filesToRemoveSet ])
    removeStaleFiles()
  })
  storage.state('assetsFiles').set([])
})

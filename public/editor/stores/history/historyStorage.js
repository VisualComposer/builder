import { addStorage, getStorage, getService } from 'vc-cake'
import TimeMachine from './lib/timeMachine'
import debounce from 'lodash/debounce'
/**
 * History storage
 */
addStorage('history', (storage) => {
  const elementsStorage = getStorage('elements')
  const workspaceStorage = getStorage('workspace')
  const assetsStorage = getStorage('assets')
  const cacheStorage = getStorage('cache')
  const elementsTimeMachine = new TimeMachine('layout')
  const documentService = getService('document')
  let inited = false
  let lockedReason = ''
  const checkUndoRedo = () => {
    storage.state('canRedo').set(inited && elementsTimeMachine.canRedo())
    storage.state('canUndo').set(inited && elementsTimeMachine.canUndo())
  }
  const updateAllElements = debounce(() => {
    const allElements = elementsTimeMachine.get()
    elementsStorage.trigger('updateAll', allElements)
    cacheStorage.trigger('clear', 'elementsCssCache')
    assetsStorage.trigger('updateAllElements', allElements)
  }, 300)
  storage.on('undo', () => {
    if (!inited) {
      return
    }
    elementsTimeMachine.undo()
    // here comes get with undo data
    updateAllElements()
    checkUndoRedo()
  })
  storage.on('redo', () => {
    if (!inited) {
      return
    }
    elementsTimeMachine.redo()
    // here comes get with redo data
    updateAllElements()
    checkUndoRedo()
  })
  storage.on('reset', () => {
    elementsTimeMachine.reset()
    updateAllElements()
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
})

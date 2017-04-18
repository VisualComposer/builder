import {addStorage, getStorage, getService} from 'vc-cake'
import TimeMachine from './lib/timeMachine'
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
    elementsTimeMachine.undo()
    // here comes get with undo data
    updateElementsStorage()
    checkUndoRedo()
  })
  storage.on('redo', () => {
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
    if (data.action === 'edit' && data.element.id) {
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

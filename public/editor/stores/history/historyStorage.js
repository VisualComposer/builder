import {addStorage, getStorage} from 'vc-cake'
import TimeMachine from './lib/timeMachine'
/**
 * History storage
 */

addStorage('history', (storage) => {
  const elementsStorage = getStorage('elements')
  const elementsTimeMachine = new TimeMachine('elements')
  const checkUndoRedo = () => {
    storage.state('canRedo').set(elementsTimeMachine.canRedo())
    storage.state('canUndo').set(elementsTimeMachine.canUndo())
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
      elementsTimeMachine.clear()
      elementsTimeMachine.setZeroState(data)
    }
    checkUndoRedo()
  })
  storage.on('add', (data) => {
    elementsTimeMachine.add(data)
    checkUndoRedo()
  })
  // States for undo/redo
  storage.state('canUndo').set(false)
  storage.state('canRedo').set(false)
})

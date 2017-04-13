import {addStorage, getStorage} from 'vc-cake'
import TimeMachine from './lib/timeMachine'
/**
 * Element History storage
 */

addStorage('elementHistory', (storage) => {
  const elementsStorage = getStorage('elements')
  const elementTimeMachine = new TimeMachine('element')
  let inited = false
  const checkUndoRedo = () => {
    storage.state('canRedo').set(elementTimeMachine.canRedo())
    storage.state('canUndo').set(elementTimeMachine.canUndo())
  }
  const updateElementsStorage = () => {
    const data = elementTimeMachine.get()
    data && elementsStorage.trigger('update', data.id, data)
  }
  storage.on('undo', () => {
    elementTimeMachine.undo()
    // here comes get with undo data
    updateElementsStorage()
    checkUndoRedo()
  })
  storage.on('redo', () => {
    elementTimeMachine.redo()
    // here comes get with redo data
    updateElementsStorage()
    checkUndoRedo()
  })
  storage.on('init', (data = false) => {
    if (data) {
      inited = true
      elementTimeMachine.clear()
      elementTimeMachine.setZeroState(data)
    }
    checkUndoRedo()
  })
  storage.on('disable', () => {
    inited = false
    elementTimeMachine.clear()
    checkUndoRedo()
  })
  storage.on('add', (data) => {
    if (!inited) {
      return
    }
    elementTimeMachine.add(data)
    checkUndoRedo()
  })
  // States for undo/redo
  storage.state('canUndo').set(false)
  storage.state('canRedo').set(false)
})

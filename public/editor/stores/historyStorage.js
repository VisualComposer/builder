import {addStorage, getStorage} from 'vc-cake'
import TimeMachine from '../../resources/timeMachine'
addStorage('history', (storage) => {
  const elementsStorage = getStorage('elements')
  const branches = {
    elements: new TimeMachine('elements'),
    editForm: new TimeMachine('editForm')
  }
  const isValidBranch = (branch) => {
    return branch && Object.keys(branches).indexOf(branch) > -1
  }
  const checkUndoRedo = () => {
    storage.state('canRedo').set(branches[activeBranch].canRedo())
    storage.state('canUndo').set(branches[activeBranch].canUndo())
  }
  const updateElementsStorage = () => {
    elementsStorage.trigger('updateAll', branches[ activeBranch ].get())
  }
  let activeBranch = ''
  storage.on('undo', () => {
    if (activeBranch) {
      branches[ activeBranch ].undo()
      // here comes get with undo data
      updateElementsStorage()
      checkUndoRedo()
    }
  })
  storage.on('redo', () => {
    if (activeBranch) {
      branches[activeBranch].redo()
      // here comes get with redo data
      updateElementsStorage()
      checkUndoRedo()
    }
  })
  storage.on('initEditForm', () => {
    activeBranch = 'editForm'
    branches[activeBranch].clear()
    branches[activeBranch].setZeroState(branches.elements.get())
    checkUndoRedo()
  })
  storage.on('initElements', (data = false) => {
    activeBranch = 'elements'
    if (data) {
      branches[activeBranch].clear()
      branches[activeBranch].setZeroState(data)
    }
    checkUndoRedo()
  })
  storage.on('add', (data) => {
    if (isValidBranch(activeBranch)) {
      branches[activeBranch].add(data)
      checkUndoRedo()
    }
  })
  // States for undo/redo
  storage.state('canUndo').set(false)
  storage.state('canRedo').set(false)
})

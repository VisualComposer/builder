import {addStorage} from 'vc-cake'
import TimeMachine from '../../resources/timeMachine'
addStorage('history', (storage) => {
  const branches = {
    elements: new TimeMachine('elements'),
    editForm: new TimeMachine('editForm')
  }
  const isValidBranch = (branch) => {
    return branch && Object.keys(branches).indexOf(branch) > -1
  }
  let activeBranch = ''
  storage.on('undo', () => {
    activeBranch && branches[activeBranch].undo()
  })
  storage.on('redo', () => {
    activeBranch && branches[activeBranch].redo()
  })
  storage.on('init', (branch = '', data = false) => {
    if (isValidBranch(branch)) {
      activeBranch = branch
    }
    if (activeBranch && data) {
      branches[activeBranch].setZeroState(data)
    }
    console.log(branches[activeBranch].zeroState)
  })
  storage.on('update', (branch, data) => {
    if (isValidBranch(branch)) {
      branches[branch].add(data)
    }
  })
  // States for undo/redo
  storage.state('allowUndo').set(false)
  storage.state('allowRedo').set(false)
})

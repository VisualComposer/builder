import Combokeys from 'combokeys'
import { getStorage, getService } from 'vc-cake'

const dataManager = getService('dataManager')

export function bindEditorKeys (document) {
  const workspaceStorage = getStorage('workspace')
  const wordpressDataStorage = getStorage('wordpressData')
  const historyStorage = getStorage('history')

  let combokeysInstance = new Combokeys(document)

  combokeysInstance.stopCallback = function (e, element) {
    const workspaceState = workspaceStorage.state('settings').get()
    const closestParent = element.closest('.vcv-layout-bar-content') || element.closest('.vcvhelper.mce-content-body')
    return (!workspaceState && e.which === 27) || (closestParent && e.which !== 27)
  }
  combokeysInstance.bind([ 'command+z', 'ctrl+z' ], (e) => {
    e.preventDefault()
    historyStorage.state('canUndo').get() && historyStorage.trigger('undo')
    return false
  })
  combokeysInstance.bind([ 'command+shift+z', 'ctrl+shift+z' ], (e) => {
    e.preventDefault()
    historyStorage.state('canRedo').get() && historyStorage.trigger('redo')
    return false
  })
  combokeysInstance.bind('shift+a', (e) => {
    e.preventDefault()
    let settings = workspaceStorage.state('settings').get()
    if (settings && settings.action === 'add') {
      workspaceStorage.state('settings').set(false)
    } else {
      workspaceStorage.trigger('add')
    }
  })
  combokeysInstance.bind('shift+t', (e) => {
    e.preventDefault()
    let settings = workspaceStorage.state('content').get()
    if (settings === 'treeView') {
      workspaceStorage.state('content').set(false)
    } else {
      workspaceStorage.state('content').set('treeView')
    }
  })
  combokeysInstance.bind([ 'command+s', 'ctrl+s' ], (e) => {
    e.preventDefault()
    if (dataManager.get('editorType') !== 'vcv_tutorials') {
      wordpressDataStorage.trigger('save', {
        options: {}
      }, '')
    }
    return false
  })
  combokeysInstance.bind([ 'command+shift+p', 'ctrl+shift+p' ], () => {
    workspaceStorage.state('shortcutPreview').set(true)
    return false
  })
  combokeysInstance.bind('esc', (e) => {
    e.preventDefault()
    if(workspaceStorage.state('hasModal')?.get()){
      return
    }
    workspaceStorage.state('settings').set(false)
  }, 'keyup')
  combokeysInstance.bind('shift+s', (e) => {
    e.preventDefault()
    workspaceStorage.state('content').set('settings')
    workspaceStorage.state('settings').set({ action: 'settings' })
  })
  // Override Elementor combo
  combokeysInstance.bind([ 'command+e', 'ctrl+e' ], (e) => {
    e.preventDefault()
  })
}

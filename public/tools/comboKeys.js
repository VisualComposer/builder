import Combokeys from 'combokeys'
import { getStorage, getService } from 'vc-cake'

const dataManager = getService('dataManager')

export function bindEditorKeys (document) {
  const workspaceStorage = getStorage('workspace')
  const wordpressDataStorage = getStorage('wordpressData')
  const historyStorage = getStorage('history')

  const combokeysInstance = new Combokeys(document)

  combokeysInstance.stopCallback = function (e, element) {
    const workspaceState = workspaceStorage.state('settings').get()
    const hasModal = workspaceStorage.state('hasModal').get()

    if (!workspaceState && e.which === 27) { // Skip panel closing when panels is not opened
      return true
    }

    if (hasModal) { // Skip any action when modal is opened (no panel opening and closing)
      return true
    }

    if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA' || element.hasAttribute('contenteditable')) { // Skip any action when focus on input types
      return true
    }

    return false
  }
  combokeysInstance.bind(['command+z', 'ctrl+z'], (e) => {
    e.preventDefault()
    historyStorage.state('canUndo').get() && historyStorage.trigger('undo')
    return false
  })
  combokeysInstance.bind(['command+shift+z', 'ctrl+shift+z'], (e) => {
    e.preventDefault()
    historyStorage.state('canRedo').get() && historyStorage.trigger('redo')
    return false
  })
  combokeysInstance.bind('shift+a', (e) => {
    e.preventDefault()
    const settings = workspaceStorage.state('settings').get()
    if (settings && settings.action === 'add') {
      workspaceStorage.state('settings').set(false)
    } else {
      workspaceStorage.trigger('add')
    }
  })
  combokeysInstance.bind('shift+t', (e) => {
    e.preventDefault()
    const settings = workspaceStorage.state('content').get()
    if (settings === 'treeView') {
      workspaceStorage.state('content').set(false)
    } else {
      workspaceStorage.state('content').set('treeView')
    }
  })
  combokeysInstance.bind(['command+s', 'ctrl+s'], (e) => {
    e.preventDefault()
    if (dataManager.get('editorType') !== 'vcv_tutorials') {
      wordpressDataStorage.trigger('save', {
        options: {}
      }, '')
    }
    return false
  })
  combokeysInstance.bind(['command+shift+p', 'ctrl+shift+p'], () => {
    workspaceStorage.state('shortcutPreview').set(true)
    return false
  })
  combokeysInstance.bind('esc', (e) => {
    e.preventDefault()
    workspaceStorage.state('settings').set(false)
  }, 'keyup')
  combokeysInstance.bind('shift+s', (e) => {
    e.preventDefault()
    workspaceStorage.state('content').set('settings')
    workspaceStorage.state('settings').set({ action: 'settings' })
  })
  // Override Elementor combo
  combokeysInstance.bind(['command+e', 'ctrl+e'], (e) => {
    e.preventDefault()
  })
}

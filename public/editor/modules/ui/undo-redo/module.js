import vcCake from 'vc-cake'
import UndoRedoControl from './lib/navbar-controls'

vcCake.add('ui-undo-redo', (api) => {
  let timeMachine = vcCake.getService('time-machine')
  let doc = vcCake.getService('document')
  api.reply('data:changed', (data, action) => {
    if (action !== 'reset') {
      timeMachine.add(doc.all())
    }
    api.notify('added', data)
  })

  api.module('ui-navbar').do('addElement', 'Undo/Redo', UndoRedoControl, {
    api: api
  })
})

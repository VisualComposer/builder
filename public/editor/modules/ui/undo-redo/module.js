import vcCake from 'vc-cake'
import UndoRedoControl from './lib/navbar-controls'

vcCake.add('ui-undo-redo', (api) => {
  const TimeMachine = vcCake.getService('time-machine')
  const DocumentData = vcCake.getService('document')
  api.reply('data:changed', (data, action) => {
    if (action !== 'reset') {
      TimeMachine.add(DocumentData.all())
    }
  })

  api.module('ui-navbar').do('addElement', 'Undo/Redo', UndoRedoControl, {
    api: api
  })
})

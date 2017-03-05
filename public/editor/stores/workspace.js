import {addStorage} from 'vc-cake'

addStorage('workspace', (storage) => {
  storage.on('add', (parent) => {
    storage.state('contentEnd', 'addElement')
  })
})

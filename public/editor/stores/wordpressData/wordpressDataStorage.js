import {addStorage, getService} from 'vc-cake'
import SaveController from './lib/saveController'
addStorage('wordpressData', (storage) => {
  const controller = new SaveController()
  const documentManager = getService('document')
  storage.on('start', () => {
    // Here we call data load
  })
  storage.on('save', (options) => {
    const documentData = documentManager.all()
    storage.trigger('wordpress:beforeSave', {
      pageElements: documentData
    })
    options = Object.assign({}, {
      elements: documentData
    }, options)
    controller.save(options)
  })
  storage.on('loaded', (data) => {
    controller.load(data)
  })
})

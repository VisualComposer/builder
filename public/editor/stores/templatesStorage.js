import { addStorage } from 'vc-cake'

addStorage('templates', (storage) => {
  storage.on('start', () => {
    console.log('start', window.VCV_TEMPLATES())
    storage.state('templates').set(window.VCV_TEMPLATES())
  })

  storage.on('add', (type, templateData) => {
    console.log('add', type, templateData)
    // let templates = storage.state('templates').get() || {}
    // templates[ templateData.id ] = templateData
    // storage.state('templates').set(templates)
  })
  storage.on('remove', (type, templateData) => {
    console.log('remove', type, templateData)
    // let templates = storage.state('templates').get() || {}
    // templates[ templateData.id ] = templateData
    // storage.state('templates').set(templates)
  })
})

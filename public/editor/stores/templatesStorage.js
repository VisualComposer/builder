import { addStorage } from 'vc-cake'

addStorage('templates', (storage) => {
  storage.on('start', () => {
    console.log('start', window.VCV_TEMPLATES())
    storage.state('templates').set(window.VCV_TEMPLATES())
  })

  storage.on('add', (type, templateData) => {
    console.log('add', type, templateData)
    let all = storage.state('templates').get()
    if (!all[ type ]) {
      all[ type ] = {
        'name': type,
        'type': type,
        'templates': []
      }
    }
    all[ type ].templates.unshift(templateData)
    storage.state('templates').set(all)
  })
  storage.on('remove', (type, id) => {
    console.log('remove', type, id)
    let all = storage.state('templates').get()
    if (all[ type ]) {
      let removeIndex = all[ type ].templates.findIndex((template) => {
        return template.id === id
      })
      all[ type ].templates.splice(removeIndex, 1)
      storage.state('templates').set(all)
    }
  })
})

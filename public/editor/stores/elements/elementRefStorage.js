import { addStorage } from 'vc-cake'

addStorage('elementRefStorage', (storage) => {
  storage.on('add', (id, ref) => {
    const elementRefState = storage.state('elementRefs').get() || {}
    elementRefState[id] = ref
    storage.state('elementRefs').set(elementRefState)
  })

  storage.on('remove', (id) => {
    const elementRefState = storage.state('elementRefs').get() || {}
    delete elementRefState[id]
    storage.state('elementRefs').set(elementRefState)
  })

  storage.on('update', (id, ref) => {
    const elementRefState = storage.state('elementRefs').get() || {}
    elementRefState[id] = ref
    storage.state('elementRefs').set(elementRefState)
  })
})

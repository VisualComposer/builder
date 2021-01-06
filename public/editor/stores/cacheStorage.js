import { addStorage } from 'vc-cake'

addStorage('cache', (storage) => {
  storage.state('controls').set({})
  storage.state('elementsCssCache').set({})

  storage.on('set', (type, id, value) => {
    const cache = storage.state(type).get()
    cache[id] = value
    storage.state(type).set(cache)
  })

  storage.on('clear', (type) => {
    storage.state(type).set({})
  })
})

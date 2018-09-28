import { addStorage } from 'vc-cake'

addStorage('cache', (storage) => {
  storage.state('controls').set({})

  storage.on('set', (type, id, value) => {
    let cache = storage.state(type).get()
    cache[id] = value
    storage.state(type).set(cache)
  })

  storage.on('clear', (type) => {
    storage.state(type).set({})
  })
})

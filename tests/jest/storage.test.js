import {addStorage, getStorage} from 'vc-cake'

test('Test testJestStorage', () => {
  addStorage('testJestStorage', (storage) => {
    storage.state('app').set(true)
  })

  expect(getStorage('testJestStorage').state('app').get()).toBe(true)
})

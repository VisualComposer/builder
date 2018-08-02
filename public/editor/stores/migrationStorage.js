import { addStorage, getStorage, getService } from 'vc-cake'

addStorage('migration', (storage) => {
  const cook = getService('cook')
  const utils = getService('utils')
  const elementsStorage = getStorage('elements')

  storage.on('migrateContent', (contentData) => {
    window.setTimeout(() => {
      if (!contentData._migrated) {
        const textElement = cook.get({ tag: 'textBlock', output: utils.wpAutoP(contentData.content, '__VCVID__') })
        if (textElement) {
          elementsStorage.trigger('add', textElement.toJS())
        }
      }
    }, 15)
    // Timeout needed to be last in the call-stack
  })
})

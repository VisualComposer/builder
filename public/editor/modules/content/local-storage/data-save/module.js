import vcCake from 'vc-cake'
const assetsManager = vcCake.getService('assets-manager')

vcCake.add('content-local-storage-data-save', (api) => {
  api.reply('node:save', () => {
    const LocalStorage = vcCake.getService('local-storage')
    const DocumentData = vcCake.getService('document')
    LocalStorage.save({
      data: DocumentData.all(),
      elements: assetsManager.get()
    })
  })
})

import vcCake from 'vc-cake'

vcCake.add('content-local-storage-data-save', (api) => {
  api.reply('node:save', () => {
    const LocalStorage = vcCake.getService('local-storage')
    const DocumentData = vcCake.getService('document')
    LocalStorage.save(DocumentData.all())
  })
})

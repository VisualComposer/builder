import vcCake from 'vc-cake'

vcCake.add('content-local-storage-data-save', (api) => {
  api.reply('node:save', () => {
    let localStorage = vcCake.getService('local-storage')
    let documentData = vcCake.getService('document')
    localStorage.save(documentData.all())
  })
})

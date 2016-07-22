import vcCake from 'vc-cake'

const storage = vcCake.getService('wordpress-storage')
const documentData = vcCake.getService('document')

vcCake.add('content-wordpress-data-save', (api) => {
  api.reply('wordpress:save', () => {
    storage.save(documentData.all())
  })
})

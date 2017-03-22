import vcCake from 'vc-cake'
const myTemplates = vcCake.getService('myTemplates')
const DocumentData = vcCake.getService('document')
const LocalStorage = vcCake.getService('local-storage')

vcCake.add('content-local-storage-data-save', (api) => {
  api.reply('node:save', () => {
    api.request('node:beforeSave', {
      pageElements: DocumentData.all()
    })
    LocalStorage.save({
      data: DocumentData.all(),
      elements: vcCake.getData('globalAssetsStorage').getElements(),
      cssSettings: {
        custom: vcCake.getData('globalAssetsStorage').getCustomCss(),
        global: vcCake.getData('globalAssetsStorage').getGlobalCss()
      }
    })
  })
  api.reply('templates:save', () => {
    LocalStorage.save({
      myTemplates: myTemplates.all()
    })
  })
  api.reply('templates:remove', () => {
    LocalStorage.save({
      myTemplates: myTemplates.all()
    })
  })
})

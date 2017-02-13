import vcCake from 'vc-cake'
const wipAssetsStorage = vcCake.getService('wipAssetsStorage')
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
      elements: wipAssetsStorage.getElements(),
      cssSettings: {
        custom: wipAssetsStorage.getCustomCss(),
        global: wipAssetsStorage.getGlobalCss()
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

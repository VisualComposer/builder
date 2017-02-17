import vcCake from 'vc-cake'
const assetsStorage = vcCake.getService('assetsStorage')
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
      elements: assetsStorage.getElements(),
      cssSettings: {
        custom: assetsStorage.getCustomCss(),
        global: assetsStorage.getGlobalCss()
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

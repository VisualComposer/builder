import vcCake from 'vc-cake'
const assetsManager = vcCake.getService('assets-manager')
const wipAssetsStorage = vcCake.getService('wipAssetsStorage')

vcCake.add('content-local-storage-data-save', (api) => {
  api.reply('node:save', () => {
    const DocumentData = vcCake.getService('document')
    const LocalStorage = vcCake.getService('local-storage')
    api.request('node:beforeSave', {
      pageElements: DocumentData.all()
    })
    LocalStorage.save({
      data: DocumentData.all(),
      elements: assetsManager.get(),
      cssSettings: {
        custom: vcCake.env('FEATURE_ASSETS_MANAGER') ? wipAssetsStorage.getCustomCss() : assetsManager.getCustomCss(),
        global: vcCake.env('FEATURE_ASSETS_MANAGER') ? wipAssetsStorage.getGlobalCss() : assetsManager.getGlobalCss()
      }
    })
  })
})

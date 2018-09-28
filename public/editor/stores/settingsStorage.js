import { addStorage, getService } from 'vc-cake'
addStorage('settings', (storage) => {
  const modernAssetsStorage = getService('modernAssetsStorage')
  storage.state('globalCss').onChange((data) => {
    const globalAssetsStorage = modernAssetsStorage.getGlobalInstance()
    globalAssetsStorage.setGlobalCss(data)
    storage.state('status').set({ status: 'changed' })
  })
  storage.state('customCss').onChange((data) => {
    const globalAssetsStorage = modernAssetsStorage.getGlobalInstance()
    globalAssetsStorage.setCustomCss(data)
    storage.state('status').set({ status: 'changed' })
  })
  storage.on('start', () => {
    !storage.state('pageTemplate').get() && storage.state('pageTemplate').set(
      (window.VCV_PAGE_TEMPLATES_LAYOUTS_CURRENT && window.VCV_PAGE_TEMPLATES_LAYOUTS_CURRENT()) ||
      { type: 'theme', value: 'default' }
    )
    !storage.state('headerTemplate').get() && storage.state('headerTemplate').set(
      window.VCV_HEADER_TEMPLATES && window.VCV_HEADER_TEMPLATES() && window.VCV_HEADER_TEMPLATES().current
    )
    !storage.state('sidebarTemplate').get() && storage.state('sidebarTemplate').set(
      window.VCV_SIDEBAR_TEMPLATES && window.VCV_SIDEBAR_TEMPLATES() && window.VCV_SIDEBAR_TEMPLATES().current
    )
    !storage.state('footerTemplate').get() && storage.state('footerTemplate').set(
      window.VCV_FOOTER_TEMPLATES && window.VCV_FOOTER_TEMPLATES() && window.VCV_FOOTER_TEMPLATES().current
    )
  })
})

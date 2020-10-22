const vcCake = require('vc-cake')

const data = {
  sourceID: window.vcvSourceID,
  pageTemplates: window.VCV_PAGE_TEMPLATES ? window.VCV_PAGE_TEMPLATES() : '',
  showFeedbackForm: window.VCV_SHOW_FEEDBACK_FORM && window.VCV_SHOW_FEEDBACK_FORM(),
  showInitialHelpers: window.VCV_SHOW_INITIAL_HELPERS && window.VCV_SHOW_INITIAL_HELPERS(),
  showDataCollectionPopup: window.VCV_SHOW_DATA_COLLECTION_POPUP && window.VCV_SHOW_DATA_COLLECTION_POPUP(),
  hubGetElements: window.VCV_HUB_GET_ELEMENTS ? window.VCV_HUB_GET_ELEMENTS() : {},
  editorType: window.VCV_EDITOR_TYPE ? window.VCV_EDITOR_TYPE() : 'default',
  elementsGlobalsUrl: window.vcvElementsGlobalsUrl,
  nonce: window.vcvNonce,
  activationType: window.vcvActivationType,
  activationFinishedUrl: window.vcvActivationFinishedUrl,
  errorReportUrl: window.vcvErrorReportUrl,
  localizations: window.VCV_I18N ? window.VCV_I18N() : {},
  hubGetAddonTeaser: window.VCV_HUB_GET_ADDON_TEASER ? window.VCV_HUB_GET_ADDON_TEASER() : {},
  hubGetAddons: window.VCV_HUB_GET_ADDONS ? window.VCV_HUB_GET_ADDONS() : {},
  addonElementPresets: window.VCV_ADDON_ELEMENT_PRESETS ? window.VCV_ADDON_ELEMENT_PRESETS() : [],
  hubGetCategories: window.VCV_HUB_GET_CATEGORIES ? window.VCV_HUB_GET_CATEGORIES() : {},
  hubGetTeaser: window.VCV_HUB_GET_TEASER ? window.VCV_HUB_GET_TEASER() : {},
  hubGetTemplatesTeaser: window.VCV_HUB_GET_TEMPLATES_TEASER ? window.VCV_HUB_GET_TEMPLATES_TEASER() : {},
  getSharedAssets: window.VCV_GET_SHARED_ASSETS ? window.VCV_GET_SHARED_ASSETS() : {},
  dataCollectionEnabled: window.VCV_DATA_COLLECTION_ENABLED,
  isAnyActivated: window.vcvIsAnyActivated,
  isPremiumActivated: window.vcvIsPremiumActivated,
  vcvIsFreeActivated: window.vcvIsFreeActivated,
  pageTemplatesLayoutsCurrent: window.VCV_PAGE_TEMPLATES_LAYOUTS_CURRENT && window.VCV_PAGE_TEMPLATES_LAYOUTS_CURRENT(),
  headerTemplates: window.VCV_HEADER_TEMPLATES && window.VCV_HEADER_TEMPLATES(),
  sidebarTemplates: window.VCV_SIDEBAR_TEMPLATES && window.VCV_SIDEBAR_TEMPLATES(),
  footerTemplates: window.VCV_FOOTER_TEMPLATES && window.VCV_FOOTER_TEMPLATES(),
  showPremiumPromoPopup: window.VCV_SHOW_PREMIUM_PROMO_POPUP && window.VCV_SHOW_PREMIUM_PROMO_POPUP(),
  tutorialPageUrl: window.VCV_TUTORIAL_PAGE_URL && window.VCV_TUTORIAL_PAGE_URL(),
  createNewUrl: window.VCV_CREATE_NEW_URL && window.VCV_CREATE_NEW_URL(),
  manageOptions: window.VCV_MANAGE_OPTIONS && window.VCV_MANAGE_OPTIONS(),
  vcvGoPremiumUrl: window.vcvGoPremiumUrl
}

const dataManager = {
  get: (dataKey) => {
    if (Object.prototype.hasOwnProperty.call(data, dataKey)) {
      return data[dataKey]
    }
    return null
  }
}

vcCake.addService('dataManager', dataManager)

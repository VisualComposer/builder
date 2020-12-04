const vcCake = require('vc-cake')

let data
const dataManager = {
  get: (dataKey) => {
    if (Object.prototype.hasOwnProperty.call(data, dataKey)) {
      return data[dataKey]
    }
    return null
  },
  set: (dataKey, value) => {
    data[dataKey] = value
  },
  reset () {
    data = {
      sourceID: window.vcvSourceID,
      nonce: window.vcvNonce,
      localizations: window.VCV_I18N ? window.VCV_I18N() : {},
      adminAjaxUrl: window.vcvAdminAjaxUrl,
      editorType: window.VCV_EDITOR_TYPE ? window.VCV_EDITOR_TYPE() : 'default',
      pageTemplates: window.VCV_PAGE_TEMPLATES ? window.VCV_PAGE_TEMPLATES() : '',
      showFeedbackForm: window.VCV_SHOW_FEEDBACK_FORM && window.VCV_SHOW_FEEDBACK_FORM(),
      showInitialHelpers: window.VCV_SHOW_INITIAL_HELPERS && window.VCV_SHOW_INITIAL_HELPERS(),
      showDataCollectionPopup: window.VCV_SHOW_DATA_COLLECTION_POPUP && window.VCV_SHOW_DATA_COLLECTION_POPUP(),
      hubGetElements: window.VCV_HUB_GET_ELEMENTS ? window.VCV_HUB_GET_ELEMENTS() : {},
      elementsGlobalsUrl: window.vcvElementsGlobalsUrl,
      activationType: window.vcvActivationType,
      activationFinishedUrl: window.vcvActivationFinishedUrl,
      hubGetAddonTeaser: window.VCV_HUB_GET_ADDON_TEASER ? window.VCV_HUB_GET_ADDON_TEASER() : {},
      hubGetAddons: window.VCV_HUB_GET_ADDONS ? window.VCV_HUB_GET_ADDONS() : {},
      addonElementPresets: window.VCV_ADDON_ELEMENT_PRESETS ? window.VCV_ADDON_ELEMENT_PRESETS() : [],
      hubGetGroups: window.VCV_HUB_GET_GROUPS ? window.VCV_HUB_GET_GROUPS() : {},
      hubGetCategories: window.VCV_HUB_GET_CATEGORIES ? window.VCV_HUB_GET_CATEGORIES() : {},
      hubGetTeaser: window.VCV_HUB_GET_TEASER ? window.VCV_HUB_GET_TEASER() : {},
      hubGetTemplatesTeaser: window.VCV_HUB_GET_TEMPLATES_TEASER ? window.VCV_HUB_GET_TEMPLATES_TEASER() : {},
      getSharedAssets: window.VCV_GET_SHARED_ASSETS ? window.VCV_GET_SHARED_ASSETS() : {},
      isAnyActivated: window.vcvIsAnyActivated,
      isPremiumActivated: window.vcvIsPremiumActivated,
      isFreeActivated: window.vcvIsFreeActivated,
      pageTemplatesLayoutsCurrent: window.VCV_PAGE_TEMPLATES_LAYOUTS_CURRENT && window.VCV_PAGE_TEMPLATES_LAYOUTS_CURRENT(),
      pageTemplatesLayouts: window.VCV_PAGE_TEMPLATES_LAYOUTS && window.VCV_PAGE_TEMPLATES_LAYOUTS(),
      headerTemplates: window.VCV_HEADER_TEMPLATES && window.VCV_HEADER_TEMPLATES(),
      sidebarTemplates: window.VCV_SIDEBAR_TEMPLATES && window.VCV_SIDEBAR_TEMPLATES(),
      footerTemplates: window.VCV_FOOTER_TEMPLATES && window.VCV_FOOTER_TEMPLATES(),
      showPremiumPromoPopup: window.VCV_SHOW_PREMIUM_PROMO_POPUP && window.VCV_SHOW_PREMIUM_PROMO_POPUP(),
      tutorialPageUrl: window.VCV_TUTORIAL_PAGE_URL && window.VCV_TUTORIAL_PAGE_URL(),
      createNewUrl: window.VCV_CREATE_NEW_URL && window.VCV_CREATE_NEW_URL(),
      manageOptions: window.VCV_MANAGE_OPTIONS && window.VCV_MANAGE_OPTIONS(),
      vcvManageOptions: window.vcvManageOptions, // vcv prefix added to avoid duplicating
      updateUrl: window.VCV_UPDATE_URL && window.VCV_UPDATE_URL(),
      goPremiumUrlWithRef: window.vcvGoPremiumUrlWithRef, // used only in wp-admin/ license pages components
      goPremiumUrl: window.vcvGoPremiumUrl,
      gettingStartedUrl: window.vcvGettingStartedUrl,
      goFreeUrlWithRef: window.vcvGoFreeUrlWithRef,
      authorApiKey: window.VCV_AUTHOR_API_KEY && window.VCV_AUTHOR_API_KEY(),
      updateActions: window.VCV_UPDATE_ACTIONS && window.VCV_UPDATE_ACTIONS(),
      slug: window.VCV_SLUG && window.VCV_SLUG(),
      updateProcessActionUrl: window.VCV_UPDATE_PROCESS_ACTION_URL && window.VCV_UPDATE_PROCESS_ACTION_URL(),
      updateGlobalVariablesUrl: window.VCV_UPDATE_GLOBAL_VARIABLES_URL && window.VCV_UPDATE_GLOBAL_VARIABLES_URL(),
      updateVendorUrl: window.VCV_UPDATE_VENDOR_URL && window.VCV_UPDATE_VENDOR_URL(),
      updateWPBundleUrl: window.VCV_UPDATE_WP_BUNDLE_URL && window.VCV_UPDATE_WP_BUNDLE_URL(),
      licenseType: window.VCV_LICENSE_TYPE && window.VCV_LICENSE_TYPE(),
      rebuildPostSkipPost: window.vcvRebuildPostSkipPost,
      errorReportUrl: window.VCV_ERROR_REPORT_URL && window.VCV_ERROR_REPORT_URL(),
      supportUrl: window.VCV_SUPPORT_URL && window.VCV_SUPPORT_URL(),
      licenseKey: window.VCV_LICENSE_KEY && window.VCV_LICENSE_KEY(),
      apiUrl: window.VCV_API_URL && window.VCV_API_URL(),
      pluginUrl: window.VCV_PLUGIN_URL && window.VCV_PLUGIN_URL(),
      licenseUnsplashAuthorApiKey: window.VCV_LICENSE_UNSPLASH_AUTHOR_API_KEY && window.VCV_LICENSE_UNSPLASH_AUTHOR_API_KEY(),
      createMenuUrl: window.vcvCreateMenuUrl,
      utm: window.VCV_UTM && window.VCV_UTM(),
      hubServerTime: window.VCV_HUB_SERVER_TIME && window.VCV_HUB_SERVER_TIME(),
      pageList: window.VCV_PAGE_LIST,
      excerpt: window.VCV_EXCERPT,
      authorList: window.VCV_AUTHOR_LIST,
      commentStatus: window.VCV_COMMENT_STATUS,
      pingStatus: window.VCV_PING_STATUS,
      manageMenuUrl: window.vcvManageMenuUrl,
      featuredImage: window.VCV_FEATURED_IMAGE && window.VCV_FEATURED_IMAGE(),
      postData: window.vcvPostData || {},
      hubTeaserShowBadge: window.vcvHubTeaserShowBadge,
      categories: window.VCV_CATEGORIES || {"used":["tv","xs","mtv","ltv","md","bj"],"categories":[{"label":"Old Monitor","value":"old-monitor","id":13,"parent":1},{"label":"Desktop","value":"xl","id":1,"parent":0},{"label":"Mobile","value":"xs","id":2,"parent":0},{"label":"Tablet","value":"md","id":3,"parent":0},{"label":"Laptop","value":"lg","id":4,"parent":0},{"label":"TV","value":"tv","id":5,"parent":0},{"label":"MV","value":"mv","id":6,"parent":0},{"label":"MTV","value":"mtv","id":7,"parent":5},{"label":"CD","value":"cd","id":8,"parent":0},{"label":"BJ","value":"bj","id":9,"parent":7},{"label":"OCD","value":"ocd","id":10,"parent":0},{"label":"LTV","value":"ltv","id":11,"parent":5},{"label":"WWW","value":"www","id":12,"parent":0}]}
    }
  }
}
// Initialize
dataManager.reset()

vcCake.addService('dataManager', dataManager)

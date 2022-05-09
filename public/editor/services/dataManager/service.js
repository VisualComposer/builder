const vcCake = require('vc-cake')

let data
const dataManager = {
  get: (dataKey) => {
    if (Object.prototype.hasOwnProperty.call(data, dataKey)) {
      return data[dataKey]()
    }
    return null
  },
  set: (dataKey, value) => {
    data[dataKey] = () => { return value }
  },
  reset () {
    data = {
      sourceID: () => { return window.vcvSourceID },
      nonce: () => { return window.vcvNonce },
      localizations: () => { return window.VCV_I18N ? window.VCV_I18N() : {} },
      adminAjaxUrl: () => { return window.vcvAdminAjaxUrl },
      editorType: () => { return window.VCV_EDITOR_TYPE ? window.VCV_EDITOR_TYPE() : 'default' },
      pageTemplates: () => { return window.VCV_PAGE_TEMPLATES ? window.VCV_PAGE_TEMPLATES() : '' },
      showFeedbackForm: () => { return window.VCV_SHOW_FEEDBACK_FORM && window.VCV_SHOW_FEEDBACK_FORM() },
      showInitialHelpers: () => { return window.VCV_SHOW_INITIAL_HELPERS && window.VCV_SHOW_INITIAL_HELPERS() },
      showDataCollectionPopup: () => { return window.VCV_SHOW_DATA_COLLECTION_POPUP && window.VCV_SHOW_DATA_COLLECTION_POPUP() },
      hubGetElements: () => { return window.VCV_HUB_GET_ELEMENTS ? window.VCV_HUB_GET_ELEMENTS() : {} },
      elementsGlobalsUrl: () => { return window.vcvElementsGlobalsUrl },
      activationType: () => { return window.vcvActivationType },
      activationFinishedUrl: () => { return window.vcvActivationFinishedUrl },
      hubGetAddonTeaser: () => { return window.VCV_HUB_GET_ADDON_TEASER ? window.VCV_HUB_GET_ADDON_TEASER() : {} },
      hubGetAddons: () => { return window.VCV_HUB_GET_ADDONS ? window.VCV_HUB_GET_ADDONS() : {} },
      addonElementPresets: () => { return window.VCV_ADDON_ELEMENT_PRESETS ? window.VCV_ADDON_ELEMENT_PRESETS() : [] },
      hubGetGroups: () => { return window.VCV_HUB_GET_GROUPS ? window.VCV_HUB_GET_GROUPS() : {} },
      hubGetCategories: () => { return window.VCV_HUB_GET_CATEGORIES ? window.VCV_HUB_GET_CATEGORIES() : {} },
      hubGetTeaser: () => { return window.VCV_HUB_GET_TEASER ? window.VCV_HUB_GET_TEASER() : {} },
      hubGetTemplatesTeaser: () => { return window.VCV_HUB_GET_TEMPLATES_TEASER ? window.VCV_HUB_GET_TEMPLATES_TEASER() : {} },
      getSharedAssets: () => { return window.VCV_GET_SHARED_ASSETS ? window.VCV_GET_SHARED_ASSETS() : {} },
      isPremiumActivated: () => { return window.vcvIsPremiumActivated },
      pageTemplatesLayoutsCurrent: () => { return window.VCV_PAGE_TEMPLATES_LAYOUTS_CURRENT && window.VCV_PAGE_TEMPLATES_LAYOUTS_CURRENT() },
      pageTemplatesLayouts: () => { return window.VCV_PAGE_TEMPLATES_LAYOUTS && window.VCV_PAGE_TEMPLATES_LAYOUTS() },
      headerTemplates: () => { return window.VCV_HEADER_TEMPLATES && window.VCV_HEADER_TEMPLATES() },
      sidebarTemplates: () => { return window.VCV_SIDEBAR_TEMPLATES && window.VCV_SIDEBAR_TEMPLATES() },
      footerTemplates: () => { return window.VCV_FOOTER_TEMPLATES && window.VCV_FOOTER_TEMPLATES() },
      showPremiumPromoPopup: () => { return window.VCV_SHOW_PREMIUM_PROMO_POPUP && window.VCV_SHOW_PREMIUM_PROMO_POPUP() },
      tutorialPageUrl: () => { return window.VCV_TUTORIAL_PAGE_URL && window.VCV_TUTORIAL_PAGE_URL() },
      tutorialPageCapability: () => { return window.VCV_TUTORIAL_PAGE_CAPABILITY && window.VCV_TUTORIAL_PAGE_CAPABILITY() },
      createNewUrl: () => { return window.VCV_CREATE_NEW_URL && window.VCV_CREATE_NEW_URL() },
      createNewText: () => { return window.VCV_CREATE_NEW_TEXT && window.VCV_CREATE_NEW_TEXT() },
      manageOptions: () => { return window.VCV_MANAGE_OPTIONS && window.VCV_MANAGE_OPTIONS() },
      vcvManageOptions: () => { return window.vcvManageOptions }, // vcv prefix added to avoid duplicating
      updateUrl: () => { return window.VCV_UPDATE_URL && window.VCV_UPDATE_URL() },
      goPremiumUrlWithRef: () => { return window.vcvGoPremiumUrlWithRef }, // used only in wp-admin/ license pages components
      goPremiumUrl: () => { return window.vcvGoPremiumUrl },
      gettingStartedUrl: () => { return window.vcvGettingStartedUrl },
      authorApiKey: () => { return window.VCV_AUTHOR_API_KEY && window.VCV_AUTHOR_API_KEY() },
      updateActions: () => { return window.VCV_UPDATE_ACTIONS && window.VCV_UPDATE_ACTIONS() },
      slug: () => { return window.VCV_SLUG && window.VCV_SLUG() },
      updateProcessActionUrl: () => { return window.VCV_UPDATE_PROCESS_ACTION_URL && window.VCV_UPDATE_PROCESS_ACTION_URL() },
      updateGlobalVariablesUrl: () => { return window.VCV_UPDATE_GLOBAL_VARIABLES_URL && window.VCV_UPDATE_GLOBAL_VARIABLES_URL() },
      updateVendorUrl: () => { return window.VCV_UPDATE_VENDOR_URL && window.VCV_UPDATE_VENDOR_URL() },
      updateWPBundleUrl: () => { return window.VCV_UPDATE_WP_BUNDLE_URL && window.VCV_UPDATE_WP_BUNDLE_URL() },
      licenseType: () => { return window.VCV_LICENSE_TYPE && window.VCV_LICENSE_TYPE() },
      rebuildPostSkipPost: () => { return window.vcvRebuildPostSkipPost },
      errorReportUrl: () => { return window.VCV_ERROR_REPORT_URL && window.VCV_ERROR_REPORT_URL() },
      supportUrl: () => { return window.VCV_SUPPORT_URL && window.VCV_SUPPORT_URL() },
      licenseKey: () => { return window.VCV_LICENSE_KEY && window.VCV_LICENSE_KEY() },
      apiUrl: () => { return window.VCV_API_URL && window.VCV_API_URL() },
      pluginUrl: () => { return window.VCV_PLUGIN_URL && window.VCV_PLUGIN_URL() },
      licenseUnsplashAuthorApiKey: () => { return window.VCV_LICENSE_UNSPLASH_AUTHOR_API_KEY && window.VCV_LICENSE_UNSPLASH_AUTHOR_API_KEY() },
      createMenuUrl: () => { return window.vcvCreateMenuUrl },
      utm: () => { return window.VCV_UTM ? window.VCV_UTM() : {} },
      hubServerTime: () => { return window.VCV_HUB_SERVER_TIME && window.VCV_HUB_SERVER_TIME() },
      pageList: () => { return window.VCV_PAGE_LIST },
      excerpt: () => { return window.VCV_EXCERPT },
      authorList: () => { return window.VCV_AUTHOR_LIST },
      commentStatus: () => { return window.VCV_COMMENT_STATUS },
      pingStatus: () => { return window.VCV_PING_STATUS },
      manageMenuUrl: () => { return window.vcvManageMenuUrl },
      featuredImage: () => { return window.VCV_FEATURED_IMAGE && window.VCV_FEATURED_IMAGE() },
      postData: () => { return window.vcvPostData || {} },
      hubTeaserShowBadge: () => { return window.vcvHubTeaserShowBadge },
      tags: () => { return window.VCV_TAGS },
      categories: () => { return window.VCV_CATEGORIES },
      pluginVersion: () => { return window.VCV_PLUGIN_VERSION && window.VCV_PLUGIN_VERSION() },
      frontEndError: () => { return window.vcvFeError || 'default' },
      pageEditableNonce: () => { return window.vcvPageEditableNonce },
      freezeReady: () => { return window.vcvFreezeReady },
      ajaxUrl: () => { return window.vcvAjaxUrl },
      pluginSourceUrl: () => { return window.vcvPluginSourceUrl },
      gutenbergEditorUrl: () => { return window.vcvGutenbergEditorUrl ? window.vcvGutenbergEditorUrl : '/wp-admin/post-new.php?post_type=vcv_gutenberg_attr' },
      hubGetTemplates: () => { return window.VCV_HUB_GET_TEMPLATES && window.VCV_HUB_GET_TEMPLATES() },
      agreeHubTerms: () => { return window.vcvAgreeHubTerms },
      showPricingPopup: () => { return window.vcvShowPricingPopup },
      isWpNativeLazyLoadExist: () => { return window.VCV_IS_WP_NATIVE_LAZY_LOAD_EXIST && window.VCV_IS_WP_NATIVE_LAZY_LOAD_EXIST() },
      globalSettings: () => { return window.VCV_GLOBAL_DATA && window.VCV_GLOBAL_DATA() },
      contentZipType: () => { return window.VCV_CONTENT_ZIP_TYPE && window.VCV_CONTENT_ZIP_TYPE() }
    }
  }
}
// Initialize
dataManager.reset()

vcCake.addService('dataManager', dataManager)

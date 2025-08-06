export interface HubElements {
  [item:string]: {
    assetsPath: string,
    bundlePath: string,
    elementPath: string,
    settings: {
      metaDescription: string,
      metaPreviewUrl?: string,
      metaThumbnailUrl?: string,
      name: string
    },
    usageCount: number,
    key?: string,
    metaIsDefaultElement?: boolean
  }
}

export interface HubAddonTeasers {
  [index: number]: {
    allowDownload: boolean,
    bundle: string,
    metaAddonImageUrl: string,
    metaDescription: string,
    metaPreviewUrl: string,
    metaThumbnailUrl: string,
    name: string,
    tag: string,
    type: string,
    update: boolean
  }
}

export interface HubAddons {
  [item:string]: {
    bundlePath?: string,
    dependencies?: {
      [item:string]: string
    },
    settings: {
      metaAddonImageUrl?: string,
      metaDescription?: string,
      metaPreviewUrl?: string,
      metaThumbnailUr?: string,
      name: string,
    }
  }
}

export interface MigratedAddons {
  [item:string]: string
}

export interface ElementPresets {
  [index:number]: {
    id: number,
    name: string,
    presetData: string,
    tag: string,
    type: string,
    usageCount: number
  }
}

export interface HubGroups {
  [index:number]: {
    categories: string[],
    elements: string[],
    title: string
  }
}

export interface HubCategories {
  [item:string]: {
    elements: string[],
    icon: string
    iconDark: string,
    title: string
  }
}

export interface HubTeasers {
  [index:number]: {
    elements: {
      [index:number]: {
        allowDownload: boolean,
        bundle: string,
        bundleType: string[]
        description: string
        group: string,
        name: string
        previewUrl: string,
        tag: string,
        thumbnailUrl: string,
        update: false
      }
    },
    id: string
    index: number,
    title: string
  }
}

export interface HubTemplateTeasers {
  [index:number]: {
    allowDownload: boolean,
    bundle: string,
    bundleType: string[],
    id: string,
    introPageImageUrl: string,
    isPageIntro: boolean,
    metaDescription: string,
    metaPreviewUrl: string,
    metaThumbnailUrl: string,
    name: string,
    templateType: string,
    type: string,
    update: boolean
  }
}

export interface SharedAssets {
  [item:string]: {
    cssBundle: string,
    dependencies: string[],
    jsBundle: string
  }
}

export interface TemplateLayoutsCurrent {
  type: string,
  value: string,
  stretchedContent?: number
}

export interface TemplateLayouts {
  [index:number]: {
    title: string,
    type: string
    values: {
      [index:number]: {
        label: string,
        value: string | number,
        header?: boolean
        footer?: boolean
        sidebar?: boolean
      }
    }
  }
}

export interface HFSTemplates {
  current: string,
  all: {
    [item:string]: string
  }
}

export interface UpdateActions {
  actions: [],
  posts: []
}

export interface Utm {
  [item:string]: string
}

export interface PageList {
  current: string,
  all: {
    [index:number]: {
      id: number,
      label: string,
      parent: number,
      value: string
    }
  }
}

export interface AuthorList {
  current: string,
  all: {
    [index:number]: {
      label: string,
      value: string
    }
  }
}

export interface FeaturedImage {
  ids: number[],
  urls: {
    [index:number]: {
      alt: string
      caption: string,
      full: string,
      id: number
      link: [],
      medium: string,
      shop_catalog?: string,
      shop_thumbnail?: string,
      thumbnail: string,
      title: string,
      woocommerce_gallery_thumbnail?: string,
      woocommerce_thumbnail?: string
    }
  }
}

export interface PostData {
  adminDashboardPostTypeListUrl: string,
  adminDashboardUrl: string,
  backendEditorUrl: string,
  canPublish: boolean
  id: number
  permalink: string,
  previewUrl: string,
  status: string,
  vcvCustomPostType: number
  viewText: string,
  viewable: boolean
}

export interface Tags {
  [index:number]: {
    count: number,
    description: string,
    filter: string,
    name: string,
    parent: number
    slug: string,
    taxonomy: string,
    term_group: number,
    term_id: number,
    term_taxonomy_id: number,
  }
}

export interface Categories {
  used: string[],
  categories: {
    [index:number]: {
      id: number
      label: string
      parent: number
      value: number
    }
  }
}

export interface HubTemplates {
  [item:string]: {
    name: string,
    type: string,
    templates: {
      [index:number]: {
        bundle?: string,
        description?: string,
        id: string,
        name: string,
        preview?: string,
        thumbnail?: string,
        type: string,
        usageCount: number
      }
    }
  }
}

export interface GlobalData {
  footer: {
    pageFound: boolean,
    replaceTemplate: boolean,
    sourceId: boolean
  },
  header: {
    pageFound: boolean,
    replaceTemplate: boolean,
    sourceId: boolean
  },
  sidebar: string[]
}

export interface GlobalTemplatesList {
  [index:number]: {
    label?: string,
    value?: string,
    group?: {
      label: string,
      values: {
        [index:number]: {
          label: string,
          value: number,
        }
      }
    }
  }
}

declare global {
  interface Window {
    vcvSourceID: string,
    vcvNonce: string,
    VCV_I18N: () => void,
    vcvAdminAjaxUrl: string,
    VCV_EDITOR_TYPE: () => string,
    VCV_PAGE_TEMPLATES: () => string,
    VCV_SHOW_INITIAL_HELPERS: () => string,
    VCV_SHOW_DATA_COLLECTION_POPUP: () => boolean,
    VCV_HUB_GET_ELEMENTS: () => HubElements,
    vcvElementsGlobalsUrl: string,
    vcvActivationType: string,
    vcvActivationFinishedUrl: string,
    VCV_HUB_GET_ADDON_TEASER: () => HubAddonTeasers,
    VCV_HUB_GET_ADDONS: () => HubAddons,
    VCV_HUB_GET_MIGRATED_TO_FREE_ADDONS: () => MigratedAddons,
    VCV_ADDON_ELEMENT_PRESETS: () => ElementPresets,
    VCV_HUB_GET_GROUPS: () => HubGroups,
    VCV_HUB_GET_CATEGORIES: () => HubCategories,
    VCV_HUB_GET_TEASER: () => HubTeasers,
    VCV_HUB_GET_TEMPLATES_TEASER: () => HubTemplateTeasers,
    VCV_GET_SHARED_ASSETS: () => SharedAssets,
    vcvIsPremiumActivated: boolean,
    VCV_PAGE_TEMPLATES_LAYOUTS_CURRENT: () => TemplateLayoutsCurrent,
    VCV_PAGE_TEMPLATES_LAYOUTS: () => TemplateLayouts,
    VCV_PAGE_TEMPLATES_LAYOUTS_ALL: () => TemplateLayouts,
    VCV_HEADER_TEMPLATES: () => HFSTemplates,
    VCV_SIDEBAR_TEMPLATES: () => HFSTemplates,
    VCV_FOOTER_TEMPLATES: () => HFSTemplates,
    VCV_SHOW_PREMIUM_PROMO_POPUP: () => boolean,
    VCV_TUTORIAL_PAGE_URL: () => string,
    VCV_TUTORIAL_PAGE_CAPABILITY: () => boolean,
    VCV_CREATE_NEW_URL: () => string,
    VCV_CREATE_NEW_TEXT: () => string,
    VCV_MANAGE_OPTIONS: () => boolean,
    vcvManageOptions: boolean,
    VCV_UPDATE_URL: () => boolean,
    vcvGoPremiumUrlWithRef: string,
    vcvGoPremiumUrl: string,
    vcvGettingStartedUrl: string,
    VCV_AUTHOR_API_KEY: () => string,
    VCV_UPDATE_ACTIONS: () => UpdateActions,
    VCV_SLUG: () => string,
    VCV_UPDATE_PROCESS_ACTION_URL: () => string,
    VCV_UPDATE_GLOBAL_VARIABLES_URL: () => string,
    VCV_UPDATE_VENDOR_URL: () => string,
    VCV_UPDATE_WP_BUNDLE_URL: () => string,
    VCV_LICENSE_TYPE: () => string,
    vcvRebuildPostSkipPost: (id:string) => void,
    VCV_ERROR_REPORT_URL: () => string,
    VCV_SUPPORT_URL: () => string,
    VCV_LICENSE_KEY: () => string,
    VCV_API_URL: () => string,
    VCV_PLUGIN_URL: () => string,
    VCV_LICENSE_UNSPLASH_AUTHOR_API_KEY: () => string,
    vcvCreateMenuUrl: string,
    VCV_UTM: () => Utm,
    VCV_HUB_SERVER_TIME: () => number,
    VCV_PAGE_LIST: PageList,
    VCV_EXCERPT: string,
    VCV_AUTHOR_LIST: AuthorList,
    VCV_COMMENT_STATUS: string,
    VCV_PING_STATUS: string,
    vcvManageMenuUrl: string,
    VCV_FEATURED_IMAGE: () => FeaturedImage,
    vcvPostData: PostData,
    vcvHubTeaserShowBadge: boolean,
    VCV_TAGS: Tags,
    VCV_CATEGORIES: Categories,
    VCV_PLUGIN_VERSION: () => string,
    vcvFeError: string|boolean,
    vcvPageEditableNonce: string,
    vcvFreezeReady: (id:string, value:boolean) => void,
    vcvAjaxUrl: string,
    vcvPluginSourceUrl: string,
    vcvGutenbergEditorUrl: string,
    VCV_HUB_GET_TEMPLATES: () => HubTemplates,
    vcvAgreeHubTerms: boolean,
    vcvShowPricingPopup: boolean,
    VCV_IS_WP_NATIVE_LAZY_LOAD_EXIST: () => boolean,
    VCV_GLOBAL_DATA: () => GlobalData,
    VCV_IS_BINARY_CONTENT: () => boolean,
    VCV_JS_SAVE_ZIP: () => boolean,
    vcvGlobalTemplatesList: GlobalTemplatesList,
  }
}

import vcCake from 'vc-cake'
import Group from './lib/group'
import {sortingTool, getCategoriesList} from './lib/tools'
let tempData = {
  groups: [
    {
      'name': 'Basic',
      'categories': [ 'Row', 'Column', 'Section', 'Text block', 'Single image', 'Basic video', 'Button' ]
    },
    {
      'name': 'Media',
      'categories': [ 'Image galleries', 'Image sliders', 'Single Images', 'Videos' ]
    },
    {
      'name': 'Containers',
      'categories': [ 'Tabs', 'Tours', 'Accordions', 'Row', 'Section' ]
    },
    {
      'name': 'Social',
      'categories': [ 'Social' ]
    },
    {
      'name': 'Wordpress',
      'categories': [ 'Wordpress' ]
    },
    {
      'name': 'Content',
      'categories': [ 'Hero section', 'Icon', 'Single image', 'Text Block' ]
    },
    {
      'name': 'WooCommerce',
      'categories': [ 'WooCommerce' ]
    },
    {
      'name': 'WP Widgets',
      'categories': [ 'WP Widgets' ]
    },
    {
      'name': 'All',
      'metaOrder': 1,
      'categories': true
    }
  ],
  categories: {
    'Button': {
      'name': 'Simple Button',
      'elements': [ 'basicButton' ],
      'icon': 'categories/icons/Button.svg'
    },
    'Row': {
      'name': 'Row/Column',
      'elements': [ 'row' ],
      'icon': 'categories/icons/Row.svg'
    },
    'Column': {
      'name': 'Column',
      'elements': [ 'column' ],
      'icon': 'categories/icons/Column.svg'
    },
    'Section': {
      'name': 'Section',
      'elements': [],
      'icon': 'categories/icons/Section.svg'
    },
    'Hero section': {
      'name': 'Hero Section',
      'elements': [ 'heroSection' ],
      'icon': 'categories/icons/Hero-Section.svg'
    },
    'Icon': {
      'name': 'Icon',
      'elements': [ 'icon' ],
      'icon': 'categories/icons/Icon.svg'
    },
    'Single image': {
      'name': 'Single Image',
      'elements': [],
      'icon': 'categories/icons/Single-Image.svg'
    },
    'Image gallery': {
      'name': 'Image Gallery',
      'elements': [],
      'icon': 'categories/icons/Image-Gallery.svg'
    },
    'Text block': {
      'name': 'Text Block',
      'elements': [ 'textBlock' ],
      'icon': 'categories/icons/Text-Block.svg'
    },
    'Misc': {
      'name': 'Misc',
      'elements': [ 'rawHtml', 'rawJs' ],
      'icon': 'categories/icons/Misc.svg'
    },
    'Social': {
      'name': 'Social',
      'elements': [ 'twitterGrid', 'twitterTweet', 'twitterTimeline', 'googleMaps', 'twitterButton', 'flickrImage', 'instagramImage', 'googlePlusButton', 'pinterestPinit' ],
      'icon': 'categories/icons/Social.svg'
    },
    'Videos': {
      'name': 'Videos',
      'elements': [ 'youtubePlayer', 'vimeoPlayer' ],
      'icon': 'categories/icons/Video.svg'
    },
    'WooCommerce': {
      'name': 'WooCommerce',
      'elements': [],
      'icon': 'categories/icons/Misc.svg'
    },
    'WP Widgets': {
      'name': 'WP Widgets',
      'elements': [ 'WpWidgetsDefault', 'WpWidgetsCustom' ],
      'icon': 'categories/icons/WordPress.svg'
    }
  }
}
if (vcCake.env('FEATURE_XO_WORK')) {
  tempData.categories[ 'Button' ].elements.push('xoButton')
}
if (vcCake.env('FEATURE_ADVANCED_DESIGN_OPTIONS')) {
  tempData.categories[ 'Section' ].elements.push('section')
}
if (vcCake.env('FEATURE_SINGLE_IMAGE')) {
  tempData.categories[ 'Single image' ].elements.push('singleImage')
}
if (vcCake.env('FEATURE_GOOGLE_FONTS_HEADING')) {
  tempData.categories[ 'Misc' ].elements.push('googleFontsHeading')
}
if (vcCake.env('FEATURE_IMAGE_GALLERY')) {
  tempData.categories[ 'Image gallery' ].elements.push('imageGallery')
}
if (vcCake.env('FEATURE_FACEBOOK_LIKE')) {
  tempData.categories[ 'Social' ].elements.push('facebookLike')
}
if (vcCake.env('FEATURE_WOOCOMMERCE')) {
  tempData.categories[ 'WooCommerce' ].elements.push('woocommerceCart')
  tempData.categories[ 'WooCommerce' ].elements.push('woocommerceCheckout')
  tempData.categories[ 'WooCommerce' ].elements.push('woocommerceOrderTracking')
  tempData.categories[ 'WooCommerce' ].elements.push('woocommerceMyAccount')
  tempData.categories[ 'WooCommerce' ].elements.push('woocommerceRecentProducts')
  tempData.categories[ 'WooCommerce' ].elements.push('woocommerceFeaturedProducts')
  tempData.categories[ 'WooCommerce' ].elements.push('woocommerceProduct')
  tempData.categories[ 'WooCommerce' ].elements.push('woocommerceProducts')
  tempData.categories[ 'WooCommerce' ].elements.push('woocommerceAddToCart')
  tempData.categories[ 'WooCommerce' ].elements.push('woocommerceAddToCartUrl')
  tempData.categories[ 'WooCommerce' ].elements.push('woocommerceProductCategory')
  tempData.categories[ 'WooCommerce' ].elements.push('woocommerceProductCategories')
  tempData.categories[ 'WooCommerce' ].elements.push('woocommerceProductPage')
  tempData.categories[ 'WooCommerce' ].elements.push('woocommerceSaleProducts')
  tempData.categories[ 'WooCommerce' ].elements.push('woocommerceBestSellingProducts')
  tempData.categories[ 'WooCommerce' ].elements.push('woocommerceRelatedProducts')
  tempData.categories[ 'WooCommerce' ].elements.push('woocommerceTopRatedProducts')
  tempData.categories[ 'WooCommerce' ].elements.push('woocommerceProductAttribute')
}
const data = tempData

const service = {
  getAssetsManager: () => {
    return vcCake.getService('assets-manager')
  },
  getWipAssetsManager: () => {
    return vcCake.getService('wipAssetsManager')
  },
  set groups (groups) {
    data.groups = groups
  },
  get groups () {
    return data.groups.sort(sortingTool).map((group) => {
      return new Group(group.name, getCategoriesList(group.categories, data.categories))
    })
  },
  category (key) {
    return data.categories[ key ]
  },
  set categories (categories) {
    data.categories = categories
    data.categoriesObjects = null
  },
  categoryByTag (tag) {
    let key = Object.keys(data.categories).find((cat) => {
      let category = data.categories[ cat ]
      return category.elements.indexOf(tag) > -1
    })
    return data.categories[ key ]
  },
  getElementIcon (tag) {
    let category = this.categoryByTag(tag)
    if (vcCake.env('FEATURE_ASSETS_MANAGER')) {
      return category && category.icon ? this.getWipAssetsManager().getSourcePath(category.icon) : this.getWipAssetsManager().getSourcePath('categories/icons/Misc.svg')
    } else {
      return category && category.icon ? this.getAssetsManager().getSourcePath(category.icon) : this.getAssetsManager().getSourcePath('categories/icons/Misc.svg')
    }
  }
}
vcCake.addService('categories', service)

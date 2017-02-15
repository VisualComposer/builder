import vcCake from 'vc-cake'
import Group from './lib/group'
import { sortingTool, getCategoriesList } from './lib/tools'
let tempData = {
  groups: [
    {
      'name': 'Basic',
      'categories': [ 'Row', 'Column', 'Section', 'Text block', 'Single image', 'Basic video', 'Button' ]
    },
    {
      'name': 'Media',
      'categories': [ 'Image gallery', 'Image sliders', 'Single image', 'Videos' ]
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
      'categories': [ 'Hero section', 'Icon', 'Single image', 'Text Block', 'Feature', 'Maps', 'Separators', 'Grids', 'Feature section' ]
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
      'elements': [ 'basicButton', 'outlineButton', 'gradientButton', 'animatedOutlineButton', 'doubleOutlineButton' ],
      'icon': 'categories/icons/Button.svg',
      'iconDark': 'categories/iconsDark/Button.svg'
    },
    'Row': {
      'name': 'Row/Column',
      'elements': [ 'row' ],
      'icon': 'categories/icons/Row.svg',
      'iconDark': 'categories/iconsDark/Row.svg'
    },
    'Column': {
      'name': 'Column',
      'elements': [ 'column' ],
      'icon': 'categories/icons/Column.svg',
      'iconDark': 'categories/iconsDark/Column.svg'
    },
    'Feature': {
      'name': 'Feature',
      'elements': [ 'feature' ],
      'icon': 'categories/icons/Feature.svg',
      'iconDark': 'categories/iconsDark/Feature.svg'
    },
    'Feature section': {
      'name': 'Feature Section',
      'elements': [],
      'icon': 'categories/icons/Feature.svg',
      'iconDark': 'categories/iconsDark/Feature.svg'
    },
    'Section': {
      'name': 'Section',
      'elements': [],
      'icon': 'categories/icons/Section.svg',
      'iconDark': 'categories/iconsDark/Section.svg'
    },
    'Hero section': {
      'name': 'Hero Section',
      'elements': [ 'heroSection' ],
      'icon': 'categories/icons/Hero-Section.svg',
      'iconDark': 'categories/iconsDark/Hero-Section.svg'
    },
    'Icon': {
      'name': 'Icon',
      'elements': [ 'icon' ],
      'icon': 'categories/icons/Icon.svg',
      'iconDark': 'categories/iconsDark/Icon.svg'
    },
    'Single image': {
      'name': 'Single Image',
      'elements': [ 'singleImage' ],
      'icon': 'categories/icons/Single-Image.svg',
      'iconDark': 'categories/iconsDark/Single-Image.svg'
    },
    'Image gallery': {
      'name': 'Image Gallery',
      'elements': [ 'imageMasonryGallery', 'imageGallery' ],
      'icon': 'categories/icons/Image-Gallery.svg',
      'iconDark': 'categories/iconsDark/Image-Gallery.svg'
    },
    'Text block': {
      'name': 'Text Block',
      'elements': [ 'textBlock', 'googleFontsHeading' ],
      'icon': 'categories/icons/Text-Block.svg',
      'iconDark': 'categories/iconsDark/Text-Block.svg'
    },
    'Misc': {
      'name': 'Misc',
      'elements': [ 'rawHtml', 'rawJs' ],
      'icon': 'categories/icons/Misc.svg',
      'iconDark': 'categories/iconsDark/Misc.svg'
    },
    'Social': {
      'name': 'Social',
      'elements': [ 'twitterGrid', 'twitterTweet', 'twitterTimeline', 'twitterButton', 'flickrImage', 'instagramImage', 'googlePlusButton', 'pinterestPinit', 'facebookLike' ],
      'icon': 'categories/icons/Social.svg',
      'iconDark': 'categories/iconsDark/Social.svg'
    },
    'Videos': {
      'name': 'Videos',
      'elements': [ 'youtubePlayer', 'vimeoPlayer' ],
      'icon': 'categories/icons/Video.svg',
      'iconDark': 'categories/iconsDark/Video.svg'
    },
    'WooCommerce': {
      'name': 'WooCommerce',
      'elements': [],
      'icon': 'categories/icons/Misc.svg',
      'iconDark': 'categories/iconsDark/Misc.svg'
    },
    'WP Widgets': {
      'name': 'WP Widgets',
      'elements': [],
      'icon': 'categories/icons/WordPress.svg',
      'iconDark': 'categories/iconsDark/WordPress.svg'
    },
    'Separators': {
      'name': 'Separators',
      'elements': [ 'separator' ],
      'icon': 'categories/icons/Separator.svg',
      'iconDark': 'categories/iconsDark/Separator.svg'
    },
    'Maps': {
      'name': 'Maps',
      'elements': [ 'googleMaps' ],
      'icon': 'categories/icons/Map.svg',
      'iconDark': 'categories/iconsDark/Map.svg'
    },
    'Grids': {
      'name': 'Grids',
      'elements': [],
      'icon': 'categories/icons/Post-Grid.svg',
      'iconDark': 'categories/iconsDark/Post-Grid.svg'
    },
    '_postsGridSources': {
      'name': 'Post Grid Data Sources',
      'elements': [ 'postsGridDataSourcePost', 'postsGridDataSourcePage', 'postsGridDataSourceCustomPostType' ],
      'icon': 'categories/icons/Post-Grid.svg',
      'iconDark': 'categories/iconsDark/Post-Grid.svg'
    }
  }
}
if (vcCake.env('FEATURE_XO_WORK')) {
  tempData.categories[ 'Button' ].elements.push('xoButton')
}
// if (window.vcvCustomWidgets && window.vcvCustomWidgets.length) {
tempData.categories[ 'WP Widgets' ].elements.push('wpWidgetsCustom')
// }
// if (window.vcvDefaultWidgets && window.vcvDefaultWidgets.length) {
tempData.categories[ 'WP Widgets' ].elements.push('wpWidgetsDefault')
// }
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
  tempData.categories[ 'WooCommerce' ].elements.push('woocommerceProductCategory')
  tempData.categories[ 'WooCommerce' ].elements.push('woocommerceProductCategories')
  tempData.categories[ 'WooCommerce' ].elements.push('woocommerceProductPage')
  tempData.categories[ 'WooCommerce' ].elements.push('woocommerceSaleProducts')
  tempData.categories[ 'WooCommerce' ].elements.push('woocommerceBestSellingProducts')
  tempData.categories[ 'WooCommerce' ].elements.push('woocommerceRelatedProducts')
  tempData.categories[ 'WooCommerce' ].elements.push('woocommerceTopRatedProducts')
  tempData.categories[ 'WooCommerce' ].elements.push('woocommerceProductAttribute')
}

if (vcCake.env('FEATURE_POSTS_GRID')) {
  tempData.categories[ 'Grids' ].elements.push('postsGrid')
}
if (vcCake.env('FEATURE_FEATURE_SECTION')) {
  tempData.categories[ 'Feature section' ].elements.push('featureSection')
}
const data = tempData

const service = {
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
  getElementIcon (tag, dark = false) {
    let category = this.categoryByTag(tag)
    if (dark) {
      return category && category.iconDark ? this.getWipAssetsManager().getSourcePath(category.iconDark) : this.getWipAssetsManager().getSourcePath('categories/iconsDark/Misc.svg')
    } else {
      return category && category.icon ? this.getWipAssetsManager().getSourcePath(category.icon) : this.getWipAssetsManager().getSourcePath('categories/icons/Misc.svg')
    }
  }
}
vcCake.addService('categories', service)

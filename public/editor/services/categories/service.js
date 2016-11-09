import vcCake from 'vc-cake'
import Group from './lib/group'
import {sortingTool, getCategoriesList} from './lib/tools'
let tempData = {
  groups: [
    {
      'name': 'Basic',
      'categories': ['Row', 'Column', 'Section', 'Text block', 'Single image', 'Basic video', 'Button']
    },
    {
      'name': 'Media',
      'categories': ['Image galleries', 'Image sliders', 'Single Images', 'Videos']
    },
    {
      'name': 'Containers',
      'categories': ['Tabs', 'Tours', 'Accordions', 'Row', 'Section']
    },
    {
      'name': 'Social',
      'categories': ['Social']
    },
    {
      'name': 'Wordpress',
      'categories': ['Wordpress']
    },
    {
      'name': 'Content',
      'categories': ['Hero section', 'Icon', 'Single image', 'Text Block']
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
      'elements': ['button', 'basicButton'],
      'icon': 'categories/icons/Button.svg'
    },
    'Row': {
      'name': 'Row/Column',
      'elements': ['row'],
      'icon': 'categories/icons/Row.svg'
    },
    'Column': {
      'name': 'Column',
      'elements': ['column'],
      'icon': 'categories/icons/Column.svg'
    },
    'Hero section': {
      'name': 'Hero Section',
      'elements': ['heroSection'],
      'icon': 'categories/icons/Hero-Section.svg'
    },
    'Icon': {
      'name': 'Icon',
      'elements': ['icon'],
      'icon': 'categories/icons/Icon.svg'
    },
    'Single image': {
      'name': 'Single Image',
      'elements': [],
      'icon': 'categories/icons/Single-Image.svg'
    },
    'Text block': {
      'name': 'Text Block',
      'elements': ['textBlock'],
      'icon': 'categories/icons/Text-Block.svg'
    },
    'Misc': {
      'name': 'Misc',
      'elements': ['rawHtml', 'rawJs'],
      'icon': 'categories/icons/Misc.svg'
    },
    'Social': {
      'name': 'Social',
      'elements': ['twitterGrid', 'twitterTweet', 'twitterTimeline', 'googleMaps'],
      'icon': 'categories/icons/Social.svg'
    },
    'Video': {
      'name': 'Video',
      'elements': [],
      'icon': 'categories/icons/Video.svg'
    }
  }
}
if (vcCake.env('FEATURE_XO_WORK')) {
  tempData.categories['Button'].elements.push('xoButton')
}
if (vcCake.env('ELEMENT_FEATURE_ICON')) {
  tempData.categories['Icon'].elements.push('featureIcon')
}
if (vcCake.env('FEATURE_FLICKR_IMAGE')) {
  tempData.categories['Social'].elements.push('flickrImage')
}
if (vcCake.env('FEATURE_INSTAGRAM_IMAGE')) {
  tempData.categories['Social'].elements.push('instagramImage')
}
if (vcCake.env('FEATURE_TWEET_BUTTON')) {
  tempData.categories['Social'].elements.push('tweetButton')
}
if (vcCake.env('FEATURE_TWITTER_BUTTON')) {
  tempData.categories['Social'].elements.push('twitterButton')
}
if (vcCake.env('FEATURE_TWITTER_PUBLISHER')) {
  tempData.categories['Social'].elements.push('twitterPublisher')
}
if (vcCake.env('FEATURE_SINGLE_IMAGE')) {
  tempData.categories['Single image'].elements.push('singleImage')
}
if (vcCake.env('FEATURE_VIDEO_PLAYER')) {
  tempData.categories['Video'].elements.push('videoPlayer')
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
    return data.categories[key]
  },
  set categories (categories) {
    data.categories = categories
    data.categoriesObjects = null
  },
  categoryByTag (tag) {
    let key = Object.keys(data.categories).find((cat) => {
      let category = data.categories[cat]
      return category.elements.indexOf(tag) > -1
    })
    return data.categories[key]
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

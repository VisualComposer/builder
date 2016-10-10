import vcCake from 'vc-cake'
import Group from './lib/group'
import {sortingTool, getCategoriesList} from './lib/tools'
const assetsManager = vcCake.getService('assets-manager')
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
      'elements': ['button'],
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
      'elements': ['singleImage'],
      'icon': 'categories/icons/Single-Image.svg'
    },
    'Text block': {
      'name': 'Text Block',
      'elements': ['textBlock'],
      'icon': 'categories/icons/Text-Block.svg'
    }
  }
}
if (vcCake.env('FEATURE_ASSET_MANAGER')) {
  tempData.categories['XoButton'] = {
    'name': 'Simple Button',
    'elements': ['xoButton'],
    'icon': 'categories/icons/Button.svg'
  }
}
if (vcCake.env('ELEMENT_FEATURE_ICON')) {
  tempData.categories['Feature icon'] = {
    'name': 'Feature Icon',
    'elements': ['featureIcon'],
    'icon': 'categories/icons/Misc.svg'
  }
}

const data = tempData

const service = {
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
    return category && category.icon ? assetsManager.getSourcePath(category.icon) : assetsManager.getSourcePath('categories/icons/Misc.svg')
  }
}
vcCake.addService('categories', service)

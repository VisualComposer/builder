import React from 'react'
import Attribute from '../attribute'
import classNames from 'classnames'
import './css/styles.less'

let autobind = [
  'iconSet',
  'search',
  'category',
  'togglePopup'
]

let iconsSets = {
  fontawesome: require('./lib/font-awesome-4.6.3'),
  lineicons: require('./lib/lineicons-13.07-48'),
  entypo: require('./lib/entypo-13.07-411'),
  monosocial: require('./lib/monosocial-1.10-101'),
  typicons: require('./lib/typicons-2.0.7'),
  openiconic: require('./lib/openiconic-1.1.1'),
  material: require('./lib/material-845')
}

class Iconpicker extends Attribute {
  constructor (props) {
    super(props)
    this.state = {
      search: '',
      category: '',
      iconSet: 'fontawesome',
      popupOpen: false,
      value: props.value
    }

    autobind.forEach((key) => {
      this[ key ] = this[ key ].bind(this)
    })
  }

  filteredIcons () {
    let { category, search, iconSet } = this.state
    let icons = []
    let iconsIds = []

    let addIcons = (categoryIcons) => {
      categoryIcons.forEach((icon) => {
        if (iconsIds.indexOf(icon.id) > -1) {
          return
        }
        iconsIds.push(icon.id)
        icons.push(icon)
      })
    }
    if (category) {
      addIcons(iconsSets[ iconSet ][ category ])
    } else {
      if (Array.isArray(iconsSets[ iconSet ])) {
        addIcons(iconsSets[ iconSet ])
      } else {
        Object.keys(iconsSets[ iconSet ]).forEach((category) => {
          addIcons(iconsSets[ iconSet ][ category ])
        })
      }
    }

    if (search) {
      icons = icons.filter(icon => {
        return icon.title.toLowerCase().indexOf(search) > -1
      })
    }
    return icons
  }

  iconsContent () {
    let { value } = this.state
    let iconsContent = []
    this.filteredIcons().forEach((icon) => {
      let iconClasses = classNames({
        'vcv-ui-param-iconpicker-icon-box': true,
        'vcv-ui-param-iconpicker-icon-active': icon.id === value
      })
      iconsContent.push(
        <span
          key={icon.id}
          className={iconClasses}
          value={icon.id}
          onClick={this.handleChange}
          title={icon.title}
        >
          <i className={icon.id} />
        </span>
      )
    })
    return iconsContent
  }

  categoriesContent () {
    let categories = []
    let { iconSet } = this.state
    if (iconSet && typeof iconsSets[ iconSet ] !== 'undefined' && !Array.isArray(iconsSets[ iconSet ])) {
      Object.keys(iconsSets[ iconSet ]).forEach((category) => {
        categories.push(<option key={'innerCategory' + category} value={category}>{category}</option>)
      })
    }
    return categories
  }

  popupContent () {
    let { search, category, iconSet } = this.state
    let content
    let categories = this.categoriesContent()
    let iconsContent = this.iconsContent()
    if (!iconsContent.length) {
      iconsContent.push(<div className='vcv-ui-param-iconpicker-error'><span>No icons round</span></div>)
    }

    let popupClasses = classNames({
      'vcv-ui-param-iconpicker-popup': true
    })

    let categoriesContent = ''
    if (categories.length) {
      categoriesContent = (
        <div className='vcv-ui-param-iconpicker-category'>
          <select onChange={this.category} value={category}
            className='vcv-ui-param-iconpicker-icon-dropdown-select'>
            <option key='all' value=''>From all categories</option>
            {categories}
          </select>
        </div>
      )
    }

    let iconsSetContent = ''
    if (Object.keys(iconsSets).length) {
      let innerSetContent = []
      Object.keys(iconsSets).forEach((i) => {
        let name = i.charAt(0).toUpperCase() + i.slice(1)
        innerSetContent.push(<option key={'inner' + i} value={i}>{name}</option>)
      })
      iconsSetContent = (
        <div className='vcv-ui-param-iconpicker-set'>
          <select onChange={this.iconSet} value={iconSet}
            className='vcv-ui-param-iconpicker-icon-dropdown-select'>
            {innerSetContent}
          </select>
        </div>
      )
    }

    content = (
      <div className={popupClasses}>
        {iconsSetContent}
        <div className='vcv-ui-param-iconpicker-search'>
          <input type='text' value={search} onChange={this.search} placeholder='Search Icon'
            className='vcv-ui-param-iconpicker-icons-search-input' /><i className='fa fa-search' />
        </div>
        {categoriesContent}
        <div className='vcv-ui-param-iconpicker-icons-container'>
          {iconsContent}
        </div>
      </div>
    )

    return content
  }

  togglePopup (e) {
    e && e.preventDefault && e.preventDefault()
    this.setState({
      popupOpen: !this.state.popupOpen,
      search: '',
      category: ''
    })
  }

  search (e) {
    this.setState({
      search: e.currentTarget.value,
      category: ''
    })
  }

  category (e) {
    this.setState({
      category: e.currentTarget.value,
      search: ''
    })
  }

  iconSet (e) {
    this.setState({
      iconSet: e.currentTarget.value,
      category: '',
      search: ''
    })
  }

  handleChange (e) {
    this.togglePopup()
    super.handleChange(e)
  }

  render () {
    let { value, popupOpen } = this.state

    let selectedIconClasses = classNames({
      'vcv-ui-param-iconpicker-icon-empty': !value
    }, value)

    let selectorToggleClasses = classNames({
      'fa': true,
      'fa-arrow-up': popupOpen,
      'fa-arrow-down': !popupOpen
    })

    let selectorClasses = classNames({
      'vcv-ui-param-iconpicker-selector': true
    })

    let popupContent = ''
    if (popupOpen) {
      popupContent = this.popupContent()
    }

    let wrapperClasses = classNames({
      'vcv-ui-param-iconpicker-wrapper': true,
      'vcv-ui-param-iconpicker-popup--hidden': !popupOpen
    })
    return (
      <div className={wrapperClasses}>
        <div className='vcv-ui-param-iconpicker-selector-wrapper'>
          <div className={selectorClasses}>
            <span className='vcv-ui-param-iconpicker-selected-icon'><i className={selectedIconClasses} /></span>
            <span className='vcv-ui-param-iconpicker-selector-button' onClick={this.togglePopup}><i
              className={selectorToggleClasses} /></span>
          </div>
          {popupContent}
        </div>
      </div>
    )
  }
}

Iconpicker.DEFAULT_ICON_SET = 'fontawesome'

module.exports = Iconpicker

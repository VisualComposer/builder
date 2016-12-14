import React from 'react'
import Attribute from '../attribute'
import classNames from 'classnames'
import './css/styles.less'

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
      popupOpen: false,
      value: {
        icon: props.value.icon,
        iconSet: props.value.iconSet
      }
    }
  }

  filteredIcons () {
    let { category, search, value } = this.state
    let { iconSet } = value
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
    let value = this.state.value.icon
    let iconsContent = []
    this.filteredIcons().forEach((icon) => {
      let iconClasses = classNames({
        'vcv-ui-form-iconpicker-option': true,
        'vcv-ui-form-state--active': icon.id === value
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
    let { iconSet } = this.state.value
    if (iconSet && typeof iconsSets[ iconSet ] !== 'undefined' && !Array.isArray(iconsSets[ iconSet ])) {
      Object.keys(iconsSets[ iconSet ]).forEach((category) => {
        categories.push(<option key={'innerCategory' + category} value={category}>{category}</option>)
      })
    }
    return categories
  }

  popupContent () {
    let { search, category, value } = this.state
    let { iconSet } = value
    let content
    let categories = this.categoriesContent()
    let iconsContent = this.iconsContent()
    if (!iconsContent.length) {
      iconsContent.push(<div className='vcv-ui-form-iconpicker-error'>No icons found</div>)
    }

    let popupClasses = classNames({
      'vcv-ui-form-iconpicker-content': true,
      'vcv-ui-form-state--active': this.state.popupOpen
    })

    let categoriesContent = ''
    if (categories.length) {
      categoriesContent = (
        <select onChange={this.category} value={category} className='vcv-ui-form-dropdown'>
          <option key='all' value=''>From all categories</option>
          {categories}
        </select>
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
        <select onChange={this.iconSet} value={iconSet} className='vcv-ui-form-dropdown'>
          {innerSetContent}
        </select>
      )
    }

    content = (
      <div className={popupClasses}>
        <div className='vcv-ui-form-iconpicker-content-heading'>
          {iconsSetContent}
          <div className='vcv-ui-input-search'>
            <input type='search' value={search} onChange={this.search} placeholder='Search Icon'
              className='vcv-ui-form-input' />
            <label className='vcv-ui-form-input-search-addon'>
              <i className='vcv-ui-icon vcv-ui-icon-search' />
            </label>
          </div>
          {categoriesContent}
        </div>
        <div className='vcv-ui-form-iconpicker-options'>
          {iconsContent}
        </div>
      </div>
    )

    return content
  }

  togglePopup = (e) => {
    e && e.preventDefault && e.preventDefault()
    this.setState({
      popupOpen: !this.state.popupOpen,
      search: '',
      category: ''
    })
  }

  search = (e) => {
    this.setState({
      search: e.currentTarget.value,
      category: ''
    })
  }

  category = (e) => {
    this.setState({
      category: e.currentTarget.value,
      search: ''
    })
  }

  iconSet = (e) => {
    const newValue = Object.assign({}, this.state.value)
    newValue.iconSet = e.currentTarget.value
    this.setState({
      value: newValue,
      category: '',
      search: ''
    })
  }

  handleChange (event) {
    this.togglePopup()
    const newValue = Object.assign({}, this.state.value)
    newValue.icon = event.currentTarget.attributes.value.textContent
    this.setFieldValue(newValue)
  }

  render () {
    let { popupOpen } = this.state
    let value = this.state.value.icon

    let selectedIconClasses = classNames({
      'vcv-ui-param-iconpicker-icon-empty': !value
    }, value)

    let selectorClasses = classNames({
      'vcv-ui-form-dropdown': true,
      'vcv-ui-form-dropdown-style--inline': true,
      'vcv-ui-form-state--focus': popupOpen
    })

    let popupContent = ''
    if (popupOpen) {
      popupContent = this.popupContent()
    }

    let wrapperClasses = classNames({
      'vcv-ui-form-iconpicker': true
    })
    return (
      <div className={wrapperClasses}>
        <div className='vcv-ui-form-iconpicker'>
          <div className={selectorClasses} onClick={this.togglePopup}>
            <i className={selectedIconClasses} />
          </div>
          {popupContent}
        </div>
      </div>
    )
  }
}

Iconpicker.DEFAULT_ICON_SET = 'fontawesome'

export default Iconpicker

import React from 'react'
import Attribute from '../attribute'
import classNames from 'classnames'
import { getStorage, getService } from 'vc-cake'

const attributesStorage = getStorage('attributes')
const dataManager = getService('dataManager')

class Iconpicker extends Attribute {
  static defaultProps = {
    fieldType: 'iconpicker'
  }

  static localizations = dataManager.get('localizations')

  constructor (props) {
    super(props)
    const setList = attributesStorage.state('iconpicker:iconSet').get()
    const iconSetList = setList[props.options.iconType] || setList.icons
    let iconSet = props.value.iconSet
    if (!iconSetList[iconSet]) {
      const keys = Object.keys(iconSetList)
      // In case if not set available
      iconSet = keys[0]
    }
    this.state = {
      search: '',
      category: '',
      popupOpen: false,
      value: {
        icon: props.value.icon,
        iconSet: iconSet
      },
      showSearch: 'search' in props.options ? props.options.search : true,
      iconSetList: iconSetList
    }
  }

  componentWillUnmount () {
    document.body.removeEventListener('click', this.closeIfNotInside)
  }

  filteredIcons () {
    const { category, search, value, iconSetList } = this.state
    let { iconSet } = value
    let icons = []
    const iconsIds = []

    if (!iconSetList[iconSet]) {
      const keys = Object.keys(iconSetList)
      // In case if not set available
      iconSet = keys[0]
    }
    const addIcons = (categoryIcons, isDisabled) => {
      categoryIcons.forEach((icon) => {
        if (iconsIds.indexOf(icon.id) > -1) {
          return
        }
        if (isDisabled) {
          icon.disabled = true
        }
        iconsIds.push(icon.id)
        icons.push(icon)
      })
    }
    if (category) {
      addIcons(iconSetList[iconSet].iconData[category], iconSetList[iconSet].iconData[category].disabled)
    } else {
      if (Array.isArray(iconSetList[iconSet].iconData)) {
        addIcons(iconSetList[iconSet].iconData, iconSetList[iconSet].disabled)
      } else {
        Object.keys(iconSetList[iconSet].iconData).forEach((cat) => {
          addIcons(iconSetList[iconSet].iconData[cat], iconSetList[iconSet].disabled)
        })
      }
    }

    if (search) {
      icons = icons.filter(icon => {
        return icon.title.toLowerCase().indexOf(search.toLowerCase()) > -1
      })
    }
    return icons
  }

  iconsContent () {
    const value = this.state.value.icon
    const iconsContent = []
    this.filteredIcons().forEach((icon) => {
      const iconClasses = classNames({
        'vcv-ui-form-iconpicker-option': true,
        'vcv-ui-form-state--active': icon.id === value,
        'vcv-ui-form-iconpicker--disabled': icon.disabled
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
    const categories = []
    const { iconSetList } = this.state
    let { iconSet } = this.state.value
    if (!iconSetList[iconSet]) {
      const keys = Object.keys(iconSetList)
      // In case if not set available
      iconSet = keys[0]
    }
    if (iconSet && typeof iconSetList[iconSet] !== 'undefined' && typeof iconSetList[iconSet].iconData !== 'undefined' && !Array.isArray(iconSetList[iconSet].iconData)) {
      Object.keys(iconSetList[iconSet].iconData).forEach((category) => {
        categories.push(<option key={'innerCategory' + category} value={category}>{category}</option>)
      })
    }
    return categories
  }

  popupContent () {
    const { search, category, value, showSearch, iconSetList } = this.state
    const { iconSet } = value

    const categories = this.categoriesContent()
    const iconsContent = this.iconsContent()
    if (!iconsContent.length) {
      iconsContent.push(<div className='vcv-ui-form-iconpicker-error' key='no-icon-found'>No icons found</div>)
    }

    const popupClasses = classNames({
      'vcv-ui-form-iconpicker-content': true,
      'vcv-ui-form-state--active': this.state.popupOpen
    })

    let categoriesContent = ''
    const iconSetLength = Object.keys(iconSetList).length

    if (categories.length && iconSetLength > 1) {
      categoriesContent = (
        <select onChange={this.handleCategoryChange} value={category} className='vcv-ui-form-dropdown'>
          <option key='all' value=''>From all categories</option>
          {categories}
        </select>
      )
    }

    const innerSetContent = []
    if (iconSetLength > 1) {
      const sortedIconSetList = Object.keys(iconSetList).filter(item => item !== 'fontawesome').sort()
      sortedIconSetList.unshift('fontawesome')
      sortedIconSetList.forEach((iconSet) => {
        const name = iconSet.charAt(0).toUpperCase() + iconSet.slice(1)
        innerSetContent.push(<option key={'inner' + iconSet} value={iconSet}>{name}</option>)
      })
    } else {
      const downloadPremiumIconLibraries = Iconpicker.localizations ? Iconpicker.localizations.downloadPremiumIconLibraries : 'Download Premium Icon Libraries'
      const availableInPremiumText = Iconpicker.localizations ? Iconpicker.localizations.availableInPremiumText : 'Available in Premium'

      const labelPostFix = dataManager.get('isPremiumActivated') ? `(${downloadPremiumIconLibraries})` : `(${availableInPremiumText})`
      const premiumOptions = [
        {
          label: 'Fontawesome',
          value: 'fontawesome',
          disabled: false
        },
        {
          label: `Batch ${labelPostFix}`,
          value: 'batch',
          disabled: true
        },
        {
          label: `Dripicons ${labelPostFix}`,
          value: 'dripicons',
          disabled: true
        },
        {
          label: `Entypo ${labelPostFix}`,
          value: 'entypo',
          disabled: true
        },
        {
          label: `Evil ${labelPostFix}`,
          value: 'evil',
          disabled: true
        },
        {
          label: `Feater ${labelPostFix}`,
          value: 'feather',
          disabled: true
        },
        {
          label: `Jam ${labelPostFix}`,
          value: 'jam',
          disabled: true
        },
        {
          label: `Linearicons ${labelPostFix}`,
          value: 'linearicons',
          disabled: true
        },
        {
          label: `Lineicons ${labelPostFix}`,
          value: 'lineicons',
          disabled: true
        },
        {
          label: `Material ${labelPostFix}`,
          value: 'material',
          disabled: true
        },
        {
          label: `Metrize ${labelPostFix}`,
          value: 'metrize',
          disabled: true
        },
        {
          label: `Mfglabs ${labelPostFix}`,
          value: 'mfglabs',
          disabled: true
        },
        {
          label: `Monosocial ${labelPostFix}`,
          value: 'monosocial',
          disabled: true
        },
        {
          label: `Openiconic ${labelPostFix}`,
          value: 'openiconic',
          disabled: true
        },
        {
          label: `Socialicons ${labelPostFix}`,
          value: 'socialicons',
          disabled: true
        },
        {
          label: `Typicons ${labelPostFix}`,
          value: 'typicons',
          disabled: true
        },
        {
          label: `Zondicons ${labelPostFix}`,
          value: 'zondicons',
          disabled: true
        }
      ]
      premiumOptions.forEach((iconSet) => {
        innerSetContent.push(<option key={iconSet.value} value={iconSet.value} disabled={!!iconSet.disabled}>{iconSet.label}</option>)
      })
    }

    let renderSearch = null
    if (showSearch) {
      renderSearch = (
        <div className='vcv-ui-input-search'>
          <input
            type='search' value={search} onChange={this.handleSearchChange} placeholder='Search Icon'
            className='vcv-ui-form-input'
          />
          <label className='vcv-ui-form-input-search-addon'>
            <i className='vcv-ui-icon vcv-ui-icon-search' />
          </label>
        </div>
      )
    }

    return (
      <div className={popupClasses}>
        <div className='vcv-ui-form-iconpicker-content-heading'>
          <select onChange={this.handleIconSetChange} value={iconSet} className='vcv-ui-form-dropdown'>
            {innerSetContent}
          </select>
          {renderSearch}
          {categoriesContent}
        </div>
        <div className='vcv-ui-form-iconpicker-options'>
          {iconsContent}
        </div>
      </div>
    )
  }

  handlePopupToggle = (e) => {
    e && e.preventDefault && e.preventDefault()

    if (this.state.popupOpen) {
      document.body.removeEventListener('click', this.closeIfNotInside)
    } else {
      document.body.addEventListener('click', this.closeIfNotInside)
    }

    this.setState({
      popupOpen: !this.state.popupOpen,
      search: '',
      category: ''
    })
  }

  handleSearchChange = (e) => {
    this.setState({
      search: e.currentTarget.value,
      category: ''
    })
  }

  handleCategoryChange = (e) => {
    this.setState({
      category: e.currentTarget.value,
      search: ''
    })
  }

  handleIconSetChange = (e) => {
    const newValue = Object.assign({}, this.state.value)
    newValue.iconSet = e.currentTarget.value
    this.setState({
      value: newValue,
      category: '',
      search: ''
    })
  }

  handleChange (event) {
    const newValue = Object.assign({}, this.state.value)
    newValue.icon = event.currentTarget.attributes.value.textContent
    this.setFieldValue(newValue)
  }

  getClosest (el, selector) {
    let matchesFn;
    // find vendor prefix
    ['matches', 'webkitMatchesSelector', 'mozMatchesSelector', 'msMatchesSelector', 'oMatchesSelector'].some(function (fn) {
      if (typeof document.body[fn] === 'function') {
        matchesFn = fn

        return true
      }

      return false
    })
    let parent
    // traverse parents
    while (el) {
      parent = el.parentElement
      if (parent && parent[matchesFn](selector)) {
        return parent
      }
      el = parent
    }

    return null
  }

  closeIfNotInside = (e) => {
    e && e.preventDefault()
    const $el = e.target

    const $dropDown = '.vcv-ui-form-iconpicker-content'
    const $openingButton = '.vcv-ui-iconpicker-picker-dropdown'
    let container = null

    if ($el.closest === undefined) {
      container = this.getClosest($el, $dropDown) || this.getClosest($el, $openingButton)
    } else {
      container = $el.closest($dropDown) || $el.closest($openingButton)
    }
    if (container) {
      return
    }

    this.handlePopupToggle()
  }

  render () {
    const { popupOpen } = this.state
    const value = this.state.value.icon

    const selectedIconClasses = classNames({
      'vcv-ui-param-iconpicker-icon-empty': !value
    }, value)

    const selectorClasses = classNames({
      'vcv-ui-form-dropdown': true,
      'vcv-ui-form-dropdown-style--inline': true,
      'vcv-ui-iconpicker-picker-dropdown': true,
      'vcv-ui-form-state--focus': popupOpen
    })

    let popupContent = ''
    if (popupOpen) {
      popupContent = this.popupContent()
    }

    const wrapperClasses = classNames({
      'vcv-ui-form-iconpicker': true
    })
    return (
      <div className={wrapperClasses}>
        <div className='vcv-ui-form-iconpicker'>
          <div className={selectorClasses} onClick={this.handlePopupToggle}>
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

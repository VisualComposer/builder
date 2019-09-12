import React from 'react'
import Attribute from '../attribute'
import classNames from 'classnames'

let setList = {
  icons: {
    fontawesome: require('./lib/fontawesome-5.10.2'), // v5.10.2 https://fontawesome.com/how-to-use/on-the-web/setup/hosting-font-awesome-yourself
    lineicons: require('./lib/lineicons-13.07-48'), // NA https://designmodo.com/linecons-free/
    entypo: require('./lib/entypo-13.07-411'), // NA http://www.entypo.com/
    monosocial: require('./lib/monosocial-1.10-303'), // v1.10 https://drinchev.github.io/monosocialiconsfont/
    typicons: require('./lib/typicons-2.0.7'), // v2.0.7, v2.0.9 available, but not needed https://www.s-ings.com/typicons/
    openiconic: require('./lib/openiconic-1.1.1'), // v1.1.1 https://useiconic.com/open
    material: require('./lib/material-845'), // ??? https://material.io/resources/icons/?style=baseline
    batch: require('./lib/batch-1.3'), // v1.3 http://adamwhitcroft.com/batch/
    mfglabs: require('./lib/mfglabs'), // NA https://mfglabs.github.io/mfglabs-iconset/
    metrize: require('./lib/metrize-1.0'), // v1.0 http://www.alessioatzeni.com/metrize-icons/
    dripicons: require('./lib/dripicons-2.0'), // v2.0 http://demo.amitjakhu.com/dripicons/
    feather: require('./lib/feather-163'), // ??? https://feathericons.com
    linearicons: require('./lib/linearicons-1.0-170') // v1.0 https://linearicons.com/free
  },
  socials: {
    socials: require('./lib/socials')
  }, 
  cart: {
    cart: require('./lib/cart')
  }
}

class Iconpicker extends Attribute {
  static defaultProps = {
    fieldType: 'iconpicker'
  }

  constructor (props) {
    super(props)
    this.state = {
      search: '',
      category: '',
      popupOpen: false,
      value: {
        icon: props.value.icon,
        iconSet: props.value.iconSet
      },
      showSearch: 'search' in props.options ? props.options.search : true,
      iconSetList: setList[ props.options.iconType ] || setList[ 'icons' ]
    }
  }

  componentWillUnmount () {
    document.body.removeEventListener('click', this.closeIfNotInside)
  }

  filteredIcons () {
    let { category, search, value, iconSetList } = this.state
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
      addIcons(iconSetList[ iconSet ][ category ])
    } else {
      if (Array.isArray(iconSetList[ iconSet ])) {
        addIcons(iconSetList[ iconSet ])
      } else {
        Object.keys(iconSetList[ iconSet ]).forEach((category) => {
          addIcons(iconSetList[ iconSet ][ category ])
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
    let { iconSetList } = this.state
    let { iconSet } = this.state.value
    if (iconSet && typeof iconSetList[ iconSet ] !== 'undefined' && !Array.isArray(iconSetList[ iconSet ])) {
      Object.keys(iconSetList[ iconSet ]).forEach((category) => {
        categories.push(<option key={'innerCategory' + category} value={category}>{category}</option>)
      })
    }
    return categories
  }

  popupContent () {
    let { search, category, value, showSearch, iconSetList } = this.state
    let { iconSet } = value
    let content
    let categories = this.categoriesContent()
    let iconsContent = this.iconsContent()
    if (!iconsContent.length) {
      iconsContent.push(<div className='vcv-ui-form-iconpicker-error' key='no-icon-found'>No icons found</div>)
    }

    let popupClasses = classNames({
      'vcv-ui-form-iconpicker-content': true,
      'vcv-ui-form-state--active': this.state.popupOpen
    })

    let categoriesContent = ''
    let iconSetLength = Object.keys(iconSetList).length

    if (categories.length && iconSetLength > 1) {
      categoriesContent = (
        <select onChange={this.category} value={category} className='vcv-ui-form-dropdown'>
          <option key='all' value=''>From all categories</option>
          {categories}
        </select>
      )
    }

    let iconsSetContent = ''
    if (iconSetLength > 1) {
      let innerSetContent = []
      Object.keys(iconSetList).forEach((i) => {
        let name = i.charAt(0).toUpperCase() + i.slice(1)
        innerSetContent.push(<option key={'inner' + i} value={i}>{name}</option>)
      })
      iconsSetContent = (
        <select onChange={this.iconSet} value={iconSet} className='vcv-ui-form-dropdown'>
          {innerSetContent}
        </select>
      )
    }

    let renderSearch = null

    if (showSearch) {
      renderSearch = (
        <div className='vcv-ui-input-search'>
          <input type='search' value={search} onChange={this.search} placeholder='Search Icon'
            className='vcv-ui-form-input' />
          <label className='vcv-ui-form-input-search-addon'>
            <i className='vcv-ui-icon vcv-ui-icon-search' />
          </label>
        </div>
      )
    }

    content = (
      <div className={popupClasses}>
        <div className='vcv-ui-form-iconpicker-content-heading'>
          {iconsSetContent}
          {renderSearch}
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
    const newValue = Object.assign({}, this.state.value)
    newValue.icon = event.currentTarget.attributes.value.textContent
    this.setFieldValue(newValue)
  }

  getClosest (el, selector) {
    let matchesFn;
    // find vendor prefix
    [ 'matches', 'webkitMatchesSelector', 'mozMatchesSelector', 'msMatchesSelector', 'oMatchesSelector' ].some(function (fn) {
      if (typeof document.body[ fn ] === 'function') {
        matchesFn = fn

        return true
      }

      return false
    })
    let parent
    // traverse parents
    while (el) {
      parent = el.parentElement
      if (parent && parent[ matchesFn ](selector)) {
        return parent
      }
      el = parent
    }

    return null
  }

  closeIfNotInside = (e) => {
    e && e.preventDefault()
    let $el = e.target

    let $dropDown = '.vcv-ui-form-iconpicker-content'
    let $openingButton = '.vcv-ui-iconpicker-picker-dropdown'
    let container = null

    if ($el.closest === undefined) {
      container = this.getClosest($el, $dropDown) || this.getClosest($el, $openingButton)
    } else {
      container = $el.closest($dropDown) || $el.closest($openingButton)
    }
    if (container) {
      return
    }

    this.togglePopup()
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
      'vcv-ui-iconpicker-picker-dropdown': true,
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

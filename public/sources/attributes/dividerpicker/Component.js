import React from 'react'
import Attribute from '../attribute'
import classNames from 'classnames'

const setList = {
  dividers: require('./lib/dividerShapes-2.0')
}

export default class Dividerpicker extends Attribute {
  static defaultProps = {
    fieldType: 'dividerpicker'
  }

  constructor (props) {
    super(props)
    this.state = {
      search: '',
      popupOpen: false,
      value: {
        icon: props.value.icon
      },
      showSearch: true,
      iconSetList: setList.dividers
    }
  }

  componentWillUnmount () {
    document.body.removeEventListener('click', this.closeIfNotInside)
  }

  filteredIcons () {
    const { search, iconSetList } = this.state
    let icons = []
    const iconsIds = []

    iconSetList.forEach((icon) => {
      if (iconsIds.indexOf(icon.id) > -1) {
        return
      }
      iconsIds.push(icon.id)
      icons.push(icon)
    })

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

  popupContent () {
    const { search, showSearch } = this.state
    let content
    const iconsContent = this.iconsContent()
    if (!iconsContent.length) {
      iconsContent.push(<div className='vcv-ui-form-iconpicker-error' key='no-icon-found'>No icons found</div>)
    }

    const popupClasses = classNames({
      'vcv-ui-form-iconpicker-content': true,
      'vcv-ui-form-state--active': this.state.popupOpen
    })

    let renderSearch = null

    if (showSearch) {
      renderSearch = (
        <div className='vcv-ui-input-search'>
          <input
            type='search' value={search} onChange={this.search} placeholder='Search Icon'
            className='vcv-ui-form-input'
          />
          <label className='vcv-ui-form-input-search-addon'>
            <i className='vcv-ui-icon vcv-ui-icon-search' />
          </label>
        </div>
      )
    }

    content = (
      <div className={popupClasses}>
        <div className='vcv-ui-form-iconpicker-content-heading'>
          {renderSearch}
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
      search: ''
    })
  }

  search = (e) => {
    this.setState({
      search: e.currentTarget.value
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

    this.togglePopup()
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
          <div className={selectorClasses} onClick={this.togglePopup}>
            <i className={selectedIconClasses} />
          </div>
          {popupContent}
        </div>
      </div>
    )
  }
}

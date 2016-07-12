import React from 'react'
import Attribute from '../attribute'
import lodash from 'lodash'
import './css/styles.less'
import classNames from 'classnames'
import fontawesomeIcons from './lib/font-awesome-4.6.3'

let allIcons = Symbol('all icons')
let allCategories = Symbol('all categories')
export default class Component extends Attribute {
  constructor (props) {
    super(props)
    this.state = {
      search: '',
      category: '',
      popupOpen: false,
      value: props.value
    }

    this.search = this.search.bind(this)
    this.category = this.category.bind(this)
    this.togglePopup = this.togglePopup.bind(this)

    Object.defineProperty(this, allIcons, {
      value: {
        data: [],
        set: () => {
          let iconsIds = []
          let icons = []
          lodash.each(fontawesomeIcons, (categoryIcons, category) => {
            if (category.indexOf('New') > -1) {
              return
            }
            lodash.each(categoryIcons, (icon) => {
              if (iconsIds.indexOf(icon.id) > -1) {
                return
              }
              iconsIds.push(icon.id)
              icons.push(icon)
            })
          })
          this[ allIcons ].data = icons
        }
      }
    })

    Object.defineProperty(this, allCategories, {
      value: {
        data: [],
        set: () => {
          let categories = []
          lodash.each(fontawesomeIcons, (icons, category) => {
            categories.push(<option value={category}>{category}</option>)
          })
          this[ allCategories ].data = categories
        }
      }
    })
  }

  get allIcons () {
    if (this[ allIcons ].data.length) {
      return this[ allIcons ].data
    } else {
      this[ allIcons ].set()
    }

    return this[ allIcons ].data
  }

  get categories () {
    if (this[ allCategories ].data.length) {
      return this[ allCategories ].data
    } else {
      this[ allCategories ].set()
    }

    return this[ allCategories ].data
  }

  get icons () {
    let icons = this.allIcons
    if (this.state.category) {
      icons = fontawesomeIcons[ this.state.category ]
    }
    if (this.state.search) {
      icons = icons.filter(i => {
        return i.title.toLowerCase().indexOf(this.state.search) > -1
      })
    }
    return icons
  }

  get popupContent () {
    let popupContent
    let categories = this.categories
    let icons = this.icons

    let iconsContent = []
    lodash.each(icons, (icon) => {
      let iconClasses = classNames({
        'vcv-ui-param-iconpicker-icon-box': true,
        'vcv-ui-param-iconpicker-icon-active': icon.id === this.state.value
      })
      iconsContent.push(
        <span
          className={iconClasses}
          value={icon.id}
          onClick={this.handleChange}
          title={icon.title}
        >
          <i className={icon.id} />
        </span>
      )
    })
    if (!iconsContent.length) {
      iconsContent.push(<div className='vcv-ui-param-iconpicker-error'><span>No icons round</span></div>)
    }

    let popupClasses = classNames({
      'vcv-ui-param-iconpicker-popup': true,
      'vcv-ui-state--visible': this.state.popupOpen
    })

    popupContent = (
      <div className={popupClasses}>
        <div className='vcv-ui-param-iconpicker-search'>
          <input type='text' value={this.state.search} onChange={this.search} placeholder='Search Icon'
            className='vcv-ui-param-iconpicker-icons-search-input' /><i className='fa fa-search' />
        </div>
        <div className='vcv-ui-param-iconpicker-category'>
          <select onChange={this.category} value={this.state.category}
            className='vcv-ui-param-iconpicker-icon-category-select'>
            <option value=''>From all categories</option>
            {categories}
          </select>
        </div>
        <div className='vcv-ui-param-iconpicker-icons-container'>
          {iconsContent}
        </div>
      </div>
    )

    return popupContent
  }

  togglePopup (e) {
    e && e.preventDefault && e.preventDefault()
    this.setState({
      popupOpen: !this.state.popupOpen
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

  handleChange (e) {
    this.togglePopup()
    super.handleChange(e)
  }

  render () {
    let selectorToggleClasses = classNames({
      'fa': true,
      'fa-arrow-up': this.state.popupOpen,
      'fa-arrow-down': !this.state.popupOpen
    })

    let selectorClasses = classNames({
      'vcv-ui-param-iconpicker-selector': true,
      'vcv-ui-param-iconpicker-popup--hidden': !this.state.popupOpen
    })

    let popupContent = ''
    if (this.state.popupOpen) {
      popupContent = this.popupContent
    }

    let selectedIconClasses = classNames({
      'fa': true,
      'vcv-ui-param-iconpicker-icon-empty': !this.state.value
    }, this.state.value)

    return (
      <div className='vcv-ui-param-iconpicker-wrapper'>
        <div className='vcv-ui-param-iconpicker-selector-wrapper'>
          <div className={selectorClasses}>
            <span className='vcv-ui-param-iconpicker-selected-icon'> <i className={selectedIconClasses} /> </span>
            <span className='vcv-ui-param-iconpicker-selector-button' onClick={this.togglePopup}><i
              className={selectorToggleClasses} /></span>
          </div>
          {popupContent}
        </div>
      </div>
    )
  }
}

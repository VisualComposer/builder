import React from 'react'
import PropTypes from 'prop-types'
import vcCake from 'vc-cake'

const dataManager = vcCake.getService('dataManager')

export default class HubDropdown extends React.Component {
  static propTypes = {
    categories: PropTypes.object.isRequired,
    filterType: PropTypes.string.isRequired,
    setFilterType: PropTypes.func.isRequired,
    bundleType: PropTypes.string
  }

  static localizations = dataManager.get('localizations')

  constructor (props) {
    super(props)

    this.handleDropdownChange = this.handleDropdownChange.bind(this)
    this.getSelectOptions = this.getSelectOptions.bind(this)
  }

  createGroup (bundleTypes, type, index, title) {
    const optionElements = []

    optionElements.push(this.createOptions(type, index, `All ${title}`))

    bundleTypes.forEach((bundleType) => {
      let subName = HubDropdown.localizations[bundleType]

      if (!subName && bundleType === 'free') {
        subName = 'Free'
      }
      if (!subName && bundleType === 'premium') {
        subName = 'Premium'
      }

      optionElements.push(this.createOptions(type, index, subName, bundleType))
    })

    return <optgroup key={`hub-dropdown-optGroup-${type}-${index}`} label={title}>{optionElements}</optgroup>
  }

  createOptions (type, index, title, bundleType) {
    const value = bundleType ? `${type}_${index}_${bundleType}` : `${type}_${index}`
    const key = bundleType ? `hub-dropdown-option-${type}-${index}-${bundleType}` : `hub-dropdown-option-${type}-${index}`
    return <option key={key} value={value}>{title}</option>
  }

  getSelectOptions () {
    const { categories } = this.props
    const controls = Object.values(categories)

    return controls.map((control) => {
      const { type, title, bundleTypes } = control

      let index = control.index
      if (control.subIndex !== undefined) {
        index = `${control.index}-${control.subIndex}`
      }

      if (bundleTypes && bundleTypes.length) {
        return this.createGroup(bundleTypes, type, index, title)
      } else {
        return this.createOptions(type, index, title)
      }
    })
  }

  handleDropdownChange (event) {
    const value = event.target.value
    const splitValue = value.split('_')
    this.props.setFilterType(splitValue[0], splitValue[1], splitValue[2])
  }

  render () {
    const { categories, filterType, bundleType } = this.props
    const activeCategory = categories[filterType]
    const { subIndex, index, type } = activeCategory
    const newIndex = subIndex !== undefined ? `${index}-${subIndex}` : index
    const value = bundleType ? `${type}_${newIndex}_${bundleType}` : `${type}_${newIndex}`

    return (
      <select className='vcv-ui-form-dropdown' value={value} onChange={this.handleDropdownChange}>
        {this.getSelectOptions()}
      </select>
    )
  }
}

import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

const controls = [
  {
    type: 'all',
    name: 'All'
  },
  {
    type: 'element',
    name: 'Elements'
  },
  {
    type: 'template',
    name: 'Templates'
  },
  {
    type: 'header',
    name: 'Header'
  },
  {
    type: 'footer',
    name: 'Footer'
  },
  {
    type: 'sidebar',
    name: 'Sidebar'
  }
]

export default class TeaserTypeControl extends React.Component {
  static propTypes = {
    filterType: PropTypes.string.isRequired,
    setFilterType: PropTypes.func.isRequired
  }

  handleClick (type, index) {
    this.props.setFilterType(type, index)
  }

  getControls () {
    return controls.map((control, i) => {
      const { type, name } = control
      let controlClasses = classNames({
        'vcv-ui-form-button': true,
        'vcv-ui-form-button--active': type === this.props.filterType
      })
      return <button
        key={`hub-control-${type}`}
        className={controlClasses}
        type='button'
        onClick={() => this.handleClick(type, i)}
      >
        {name}
      </button>
    })
  }

  render () {
    return <div className='vcv-ui-form-buttons-group vcv-ui-form-button-group--large'>
      {this.getControls()}
    </div>
  }
}

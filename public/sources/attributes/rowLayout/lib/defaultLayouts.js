import React from 'react'
import classNames from 'classnames'
import _ from 'lodash'
import PropTypes from 'prop-types'

export default class DefaultLayouts extends React.Component {
  static propTypes = {
    layouts: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.array
  }

  findEqualDefaultProps (layout) {
    return this.props.layouts.findIndex((defaultLayout) => {
      return _.isEqual(this.convertColumns(layout), defaultLayout)
    })
  }

  convertColumns (columns) {
    return columns.map((column) => {
      const split = column.match(/(\d+)\/(\d+)/)
      if (split && split.length) {
        return `${parseFloat((split[1] / split[2] * 100).toFixed(2))}%`
      }
      return column
    })
  }

  handleClick = (e) => {
    const layout = this.props.layouts[parseInt(e.currentTarget.getAttribute('data-index'))]
    this.props.onChange(layout || [])
  }

  render () {
    let layoutsKeys = 0
    let spansKeys = 0
    const activeLayoutIndex = this.findEqualDefaultProps(this.props.value)
    const layoutsData = this.props.layouts.map((columns, index) => {
      layoutsKeys++
      const spans = []
      columns = this.convertColumns(columns)
      columns.forEach((column) => {
        spansKeys++
        spans.push(<span key={`layouts-${layoutsKeys}-span-${spansKeys}`} style={{ flex: column }} />)
      })
      const layoutClasses = classNames({
        'vcv-ui-form-layout-layouts-col': true,
        'vcv-ui-state--active': activeLayoutIndex === index
      })

      return (
        <div
          key={`layouts-${layoutsKeys}`} className={layoutClasses}
          onClick={this.handleClick} data-index={index} title={columns.join(' + ')}
        >
          {spans}
        </div>
      )
    })
    return (
      <div className='vcv-ui-form-layout-layouts'>
        {layoutsData}
      </div>
    )
  }
}

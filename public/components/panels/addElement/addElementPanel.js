import React from 'react'
import PropTypes from 'prop-types'
import Categories from './lib/categories'

export default class AddElementPanel extends React.Component {
  static propTypes = {
    options: PropTypes.object,
    searchValue: PropTypes.string,
    applyFirstElement: PropTypes.string
  }

  render () {
    let childrenOutput = this.props.children
    if (!childrenOutput) {
      childrenOutput = (
        <Categories
          parent={this.props.options.element ? this.props.options.element : {}}
          searchValue={this.props.searchValue}
          applyFirstElement={this.props.applyFirstElement}
        />
      )
    }

    return (
      <div className='vcv-ui-tree-view-content vcv-ui-add-element-content'>
        {childrenOutput}
      </div>
    )
  }
}

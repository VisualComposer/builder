import React from 'react'
import PropTypes from 'prop-types'
import Groups from './lib/groups'

export default class AddElementPanel extends React.Component {
  static propTypes = {
    options: PropTypes.object,
    searchValue: PropTypes.string,
    applyFirstElement: PropTypes.string,
    handleScrollToElement: PropTypes.func
  }

  render () {
    let childrenOutput = this.props.children
    if (!childrenOutput) {
      childrenOutput = (
        <Groups
          key='addElementGroups'
          parent={this.props.options.element ? this.props.options.element : {}}
          searchValue={this.props.searchValue}
          applyFirstElement={this.props.applyFirstElement}
          onScrollToElement={this.props.handleScrollToElement}
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

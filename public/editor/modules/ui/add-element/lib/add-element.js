/*eslint jsx-quotes: [2, "prefer-double"]*/
import vcCake from 'vc-cake'
import React from 'react'
import {default as Categories} from './categories'

var cook = vcCake.getService('cook')

class AddElement extends React.Component {
  render () {
    var elements = cook.list.settings() || []
    let content = <Categories elements={elements} api={this.props.api} />

    return (
      <div className="vcv-ui-tree-view-content vcv-ui-add-element-content">
        {content}
      </div>
    )
  }
}
AddElement.propTypes = {
  api: React.PropTypes.object.isRequired,
  parent: React.PropTypes.string
}

module.exports = AddElement


/*eslint jsx-quotes: [2, "prefer-double"]*/
import vcCake from 'vc-cake'
import React from 'react'
import lodash from 'lodash'
import classNames from 'classnames'

var cook = vcCake.getService('cook')
const ElementControl = require('./element-control')

class AddElement extends React.Component {
  render () {
    var elements = cook.list.settings() || []
    var elementsGrouped = lodash.groupBy(elements,
      (element) => {
        return element.category || 'Content'
      })

    // TODO: Remove after mvp [#133398003440855].
    var isRow = false
    if (this.props.parent) {
      isRow = cook.getById(this.props.parent).get('name') === 'Row'
    }

    var elementsGroupedOutput = []
    lodash.each(elementsGrouped, (items, key) => {
      var itemsOutput = []
      items.map((element) => {
        itemsOutput.push(<li key={''}>{element.name}</li>)
      })
      elementsGroupedOutput.push(<li><span>{key}</span>
        <ul>{itemsOutput}</ul>
      </li>)
    })

    var elementsOutput = []
    elements.map((component) => {
      // TODO: Remove after mvp [#133398003440855].
      if (!isRow && component.name === 'Column') {
        return false
      }
      if (isRow && component.name !== 'Column') {
        return false
      }

      elementsOutput.push(<ElementControl
        api={this.props.api}
        key={'vcv-element-control-' + component.tag}
        tag={component.tag}
        name={component.name}
        icon={component.icon ? component.icon.toString() : ''} />
      )
    })

    let classes = classNames({
      'vcv-ui-add-element-container': true
      // 'vcv-ui-add-element-layout-hidden': !this.state.isWindowOpen
    })

    return (<div id="vcv-ui-add-element-container">
      <div className={classes}>
        <div className="vcv-ui-add-element-content">
          <div>TODO: Search</div>
          <div>TODO: Tabs</div>
          <div className="vcv-ui-tree-content-section">
            <div className="vcv-ui-add-element-list-container">
              <ul className="vcv-ui-add-element-list">
                {elementsOutput}
              </ul>
            </div>
          </div>
        </div>
        <div className="resizer resizer-y resizer-add-element-container"></div>
        <div className="resizer resizer-xy resizer-add-element"></div>
      </div>
    </div>)
  }
}
AddElement.propTypes = {
  api: React.PropTypes.object.isRequired,
  parent: React.PropTypes.string
}

module.exports = AddElement


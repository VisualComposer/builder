/*eslint jsx-quotes: [2, "prefer-double"]*/
import vcCake from 'vc-cake'
import React from 'react'
import classNames from 'classnames'
import {default as Categories} from './categories'

var cook = vcCake.getService('cook')

class AddElement extends React.Component {
  render () {
    var elements = cook.list.settings() || []
/*    this.props.api.actions.setParent(this.state.parent)
    if (this.state.isWindowOpen) {
      this.props.api.actions.setParent(this.state.parent)
    }*/
    let classes = classNames({
      'vcv-ui-add-element-container': true
    })

    let content = <Categories elements={elements} api={this.props.api} />

    return (<div id="vcv-ui-add-element-container">
      <div className={classes}>
        <div className="vcv-ui-add-element-content">
          <div>TODO: Search</div>
          {content}
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


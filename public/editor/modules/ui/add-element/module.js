/*eslint jsx-quotes: [2, "prefer-double"]*/
var vcCake = require('vc-cake')
var classNames = require('classnames')

require('./lib/navbar-control')

import lodash from 'lodash'
vcCake.add('ui-add-element', function (api) {
  var React = require('react')
  var ReactDOM = require('react-dom')
  var cook = vcCake.getService('cook')
  var ElementControl = require('./lib/element-control')

  require('./css/init.less')

  var currentParentElement = false
  api.addAction('setParent', function (parent) {
    currentParentElement = parent
  })
  api.addAction('getParent', function () {
    return currentParentElement
  })
  var Component = React.createClass({
    getInitialState: function () {
      return {
        isWindowOpen: false,
        parent: false
      }
    },
    componentWillMount: function () {
      api
        .on('show', function (parent) {
          this.setState({ isWindowOpen: true, parent: parent })
        }.bind(this))
        .on('hide', () => {
          this.setState({ isWindowOpen: false })
        })
        .reply('app:add', function (parent) {
          this.setState({ isWindowOpen: true, parent: parent })
        }.bind(this))
    },
    render: function () {
      var elements = this.state.isWindowOpen ? cook.list.settings() : []
      var elementsGrouped = lodash.groupBy(elements,
        (element) => {
          return element.category || 'Content'
        })
      api.actions.setParent(this.state.parent)
      if (this.state.isWindowOpen) {
        api.actions.setParent(this.state.parent)
      }
      // TODO: Remove after mvp [#133398003440855].
      var isRow = false
      if (api.actions.getParent()) {
        isRow = cook.getById(api.actions.getParent()).get('name') === 'Row'
      }

      var elementsGroupedOutput = []
      lodash.each(elementsGrouped, (items, key) => {
        var itemsOutput = []
        items.map((element) => {
          itemsOutput.push(<li>{element.name}</li>)
        })
        elementsGroupedOutput.push(<li><span>{key}</span>
          <ul>{itemsOutput}</ul>
        </li>)
      })

      var elementsOutput = []
      elements.map(function (component) {
        // TODO: Remove after mvp [#133398003440855].
        if (!isRow && component.name === 'Column') {
          return false
        }
        if (isRow && component.name !== 'Column') {
          return false
        }

        elementsOutput.push(<ElementControl
          api={api}
          key={'vcv-element-control-' + component.tag}
          tag={component.tag}
          name={component.name}
          icon={component.icon ? component.icon.toString() : ''} />
        )
      })

      let classes = classNames({
        'vcv-ui-add-element-container': true,
        'vcv-ui-add-element-layout-hidden': !this.state.isWindowOpen
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
  })

  // Here comes wrapper for navbar
  var wrapper = document.createElement('div')
  wrapper.setAttribute('id', 'vcv-ui-add-element-wrapper')
  document.body.appendChild(wrapper)
  ReactDOM.render(
    <Component />,
    wrapper
  )
})

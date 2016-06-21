/*eslint jsx-quotes: [2, "prefer-double"]*/
var vcCake = require('vc-cake')
var classNames = require('classnames')

require('./lib/navbar-control')

vcCake.add('ui-add-element', function (api) {
  var React = require('react')
  var ReactDOM = require('react-dom')
  var cook = vcCake.getService('cook')
  var Categories = require('./lib/categories')

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

      api.actions.setParent(this.state.parent)
      if (this.state.isWindowOpen) {
        api.actions.setParent(this.state.parent)
      }

      let classes = classNames({
        'vcv-ui-add-element-container': true,
        'vcv-ui-add-element-layout-hidden': !this.state.isWindowOpen
      })

      let content = <Categories elements={elements} api={api} />

      return (<div id="vcv-ui-add-element-container">
        <div className={classes}>
          <div className="vcv-ui-add-element-content">
            <div>TODO: Search</div>

            {content}

            <div>Footer</div>
          </div>
          <div className="resizer resizer-y resizer-add-element-container"></div>
          <div className="resizer resizer-xy resizer-add-element"></div>
        </div>
      </div>)
    }
  })

  // Wrapper for navbar.
  var wrapper = document.createElement('div')
  wrapper.setAttribute('id', 'vcv-ui-add-element-wrapper')
  document.body.appendChild(wrapper)
  ReactDOM.render(
    <Component />,
    wrapper
  )
})

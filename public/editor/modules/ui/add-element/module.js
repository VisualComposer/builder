/*eslint jsx-quotes: ["error", "prefer-double"]*/
var vcCake = require('vc-cake')
require('./lib/navbar-control')

vcCake.add('ui-add-element', function (api) {
  var React = require('react')
  var ReactDOM = require('react-dom')
  var Modal = require('react-modal')
  var cook = vcCake.getService('cook')
  var ElementControl = require('./lib/element-control')
  require('./css/module.less')
  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      border: 0,
      background: 'transparent'
    }
  }
  var currentParentElement = false
  api.addAction('setParent', function (parent) {
    currentParentElement = parent
  })
  api.addAction('getParent', function () {
    return currentParentElement
  })
  var Component = React.createClass({
    getInitialState: function () {
      return { modalIsOpen: false, parent: false }
    },
    componentWillMount: function () {
      api
        .on('show', function (parent) {
          this.setState({ modalIsOpen: true, parent: parent })
        }.bind(this))
        .reply('app:add', function (parent) {
          this.setState({ modalIsOpen: true, parent: parent })
        }.bind(this))
    },
    openModal: function (e) {
      e && e.preventDefault()
      this.setState({ modalIsOpen: true })
    },
    closeModal: function (e) {
      e && e.preventDefault()
      this.setState({ modalIsOpen: false })
    },
    render: function () {
      var elements = this.state.modalIsOpen ? cook.list.settings() : []
      api.actions.setParent(this.state.parent)
      if (this.state.modalIsOpen) {
        api.actions.setParent(this.state.parent)
      }

      return (<Modal
        isOpen={this.state.modalIsOpen}
        onRequestClose={this.closeModal}
        style={customStyles}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" onClick={this.closeModal}><span
                aria-hidden="true">&times</span></button>
              <h4 className="modal-title">Add element</h4>
            </div>
            <div className="modal-body">
              <ul className="vc_v-modal-content">
                {elements.map(function (component) {
                  return (function () {
                    return <ElementControl
                      api={api}
                      key={'vc-element-control-' + component.tag}
                      tag={component.tag}
                      name={component.name}
                      icon={component.icon ? component.icon.toString() : ''} />
                  })()
                })}
              </ul>
            </div>
          </div>
        </div>
      </Modal>)
    }
  })

  // Here comes wrapper for navbar
  var wrapper = document.createElement('div')
  wrapper.setAttribute('id', 'vc-ui-add-element-wrapper')
  document.body.appendChild(wrapper)
  ReactDOM.render(
    <Component />,
    wrapper
  )
})

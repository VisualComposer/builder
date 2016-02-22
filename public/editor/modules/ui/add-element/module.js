var vcCake = require('vc-cake');
require('./lib/navbar-control');

vcCake.add('ui-add-element', function(api){
  var React = require('react');
  var ReactDOM = require('react-dom');
  var Modal = require('react-modal');
  var ElementComponents = vcCake.getService('element').components;
  var ElementControl = require('./lib/element-control');
  require('./css/module.less');
  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      border: '0',
      background: 'transparent'
    }
  };

  var Component = React.createClass({
    componentWillMount: function() {
      api.on('show', function(){
        this.setState({modalIsOpen: true});
      }.bind(this));
    },
    getInitialState: function() {
      return {modalIsOpen: false};
    },
    openModal: function(e) {
      e && e.preventDefault();
      this.setState({modalIsOpen: true});
    },
    closeModal: function(e) {
      e && e.preventDefault();
      this.setState({modalIsOpen: false});
    },
    render: function() {
      var components = this.state.modalIsOpen ? ElementComponents.getElementsList() : {};
      var dependencies = "*";

      // get dependencies
      if (this.state.modalIsOpen) {
        let activeNode = vcCake.getService('data').activeNode;
        let nodeData = activeNode ? ElementComponents.get(activeNode) : {};

        if (Object.getOwnPropertyNames(nodeData).length && nodeData.children) {
          dependencies = nodeData.children.toString();
        }
      }

      return (<Modal
        isOpen={this.state.modalIsOpen}
        onRequestClose={this.closeModal}
        style={customStyles}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" onClick={this.closeModal}><span
                aria-hidden="true">&times;</span></button>
              <h4 className="modal-title">Add element</h4>
            </div>
            <div className="modal-body">
              <ul className="vc_v-modal-content">
                { Object.keys(components).map(function(key) {
                    var component = components[key];
                    // check relations
                    if ("*" === dependencies) {
                      if (component.strongRelation && component.strongRelation.toString()) {
                        return false;
                      }
                    } else if (dependencies.length) {
                      let allowed = false;
                      // check by tag name
                      if (dependencies.indexOf(component.tag.toString()) > -1) {
                        allowed = true;
                      }
                      // check by relatedTo
                      if (component.relatedTo) {
                        component.relatedTo.toString().map(function(relation) {
                          if (dependencies.indexOf(relation) > -1) {
                            allowed = true;
                          }
                        })
                      }
                      if (!allowed) {
                        return false;
                      }
                    }

                    return (function() {
                      if (undefined === component.manageable || true == component.manageable) {
                        return <ElementControl
                          key={'vc-element-control-' + component.tag.toString()}
                          tag={component.tag.toString()}
                          name={component.name.toString()}
                          icon={component.icon ? component.icon.toString() : ''}/>;
                      }
                    })()
                  }
                )}
              </ul>
            </div>
          </div>
        </div>
      </Modal>);
    }
  });

  // Here comes wrapper for navbar
  var wrapper = document.createElement('div');
  wrapper.setAttribute('id', 'vc-ui-add-element-wrapper');
  document.body.appendChild(wrapper);
  ReactDOM.render(
    <Component/>,
    wrapper
  );
});

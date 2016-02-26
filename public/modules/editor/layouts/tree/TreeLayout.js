var React = require('react');
require('./less/tree/init.less');
var Mediator = require('../../../../helpers/Mediator'); // need to remove too

var Utils = require('../../../../helpers/Utils');
var Element = require('./Element.js');
var DataChanged = {
    componentDidMount: function(){
        this.subscribe('data:changed', function(document) {
            this.setState({data: document});
        }.bind(this));
    },
    getInitialState: function() {
        return {
            data: {}
        }
    }
};
var Layout = React.createClass(Mediator.installTo({
    mixins: [DataChanged],
    render: function () {
        let elementsList;
        if (this.state.data.childNodes) {
            let data = Array.prototype.slice.call(this.state.data.childNodes);
            let rootElement = data[0];
            elementsList = Array.prototype.slice.call(rootElement.childNodes).map(function (element) {
                let data = Array.prototype.slice.call(element.childNodes);
                return <Element element={element} data={data} key={element.getAttribute('id')} level={1}/>
            });
        }
        return (
          <div className="vc-ui-tree-layout-container">
              <div className="vc-ui-tree-layout">
                {elementsList}
              </div>
              <div className="vc-ui-tree-layout-actions">
                  <a className="vc-ui-tree-layout-action" href="#" title="Add Element"><span className="vc-ui-tree-layout-action-content"><i className="vc-ui-tree-layout-action-icon vc-ui-icon vc-ui-icon-add"></i></span></a>
                  <a className="vc-ui-tree-layout-action" href="#" title="Template"><span className="vc-ui-tree-layout-action-content"><i className="vc-ui-tree-layout-action-icon vc-ui-icon vc-ui-icon-template"></i></span></a>
              </div>
          </div>
        );
    }
}));
module.exports = Layout;
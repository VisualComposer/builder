var React = require('react');
require('./HtmlLayout.less');
var Element = require('./Element.js');
var Mediator = require('../../../../helpers/Mediator'); // need to remove too

var DataChanged = {
    componentDidMount: function(){
        this.subscribe('data:changed', function(document) {
            this.setState({data: document});
        }.bind(this));
    },
    getInitialState: function() {
        return {
            data: {},
            menuExpand: false
        }
    }
};
var SortableMixin = {
    shouldComponentUpdate: function(nextProps, nextState) {
        return true;
    }
};

var Layout = React.createClass(Mediator.installTo({
    mixins: [DataChanged],
    render: function() {
        let elementsList;
        if (this.state.data.childNodes) {
            let data = Array.prototype.slice.call(this.state.data.childNodes);
            let rootElement = data[0];
            elementsList = Array.prototype.slice.call(rootElement.childNodes).map(function (element) {
                let data = Array.prototype.slice.call(element.childNodes);
                return <Element element={element} data={data} key={element.getAttribute('id')} level={1}/>
            });
        }
        return (<div className="vc-v-layouts-html">
            {elementsList}
        </div>);
    }
}));
module.exports = Layout;
var React = require('react');
var Mediator = require('../../../helpers/Mediator'); // need to remove too
var TreeElement = require('../layouts/tree/TreeLayout');
var AddElementModal = require('./add-element/AddElement.js');
var InlineEditor = require('./InlineEditor');

require('./less/navbar/navbar-init.less');
module.exports = React.createClass(Mediator.installTo({
    openAddElement: function (e) {
        e && e.preventDefault();
        this.publish('data:activeNode', 'vc-v-root-element');
        this.publish('app:add', true);
    },
    render: function () {
        return (
            <nav className="navbar navbar-vc navbar-fixed-top">
                <div className="navbar-header">
                    <a className="navbar-brand"><img src="sources/images/logo.png" height="100%"/></a>
                </div>
                <ul className="nav navbar-nav">
                    <li><a className="as_btn" onClick={this.openAddElement}><span
                        className="glyphicon glyphicon-plus"></span></a></li>
                    <li role="presentation" className="dropdown">
                        <a className="dropdown-toggle as_btn" data-toggle="dropdown" href="#" role="button"
                           aria-haspopup="true" aria-expanded="false">
                            <span className="glyphicon glyphicon-align-justify"></span> <span className="caret"></span>
                        </a>
                        <TreeElement data={this.props.data}/>
                    </li>
                </ul>
				<div className="vc_ui-inline-editor-container">
					<InlineEditor />
				</div>
                <AddElementModal/>
            </nav>
        );
    }
}));
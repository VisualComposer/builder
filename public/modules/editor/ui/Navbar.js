var React = require('react');
var Mediator = require('../../../helpers/Mediator'); // need to remove too
var TreeElement = require('../layouts/tree/TreeLayout');
var AddElementModal = require('./add-element/AddElement.js');
var InlineEditor = require('./InlineEditor');
var classNames = require('classnames');

require('./less/navbar/navbar-init.less');
module.exports = React.createClass(Mediator.installTo({
	getInitialState: function() {
		return {
			menuExpand: false
		}
	},
    openAddElement: function (e) {
        e && e.preventDefault();
        this.publish('data:activeNode', 'vc-v-root-element');
        this.publish('app:add', true);
    },
	clickMenuExpand: function() {
		this.setState({menuExpand: !this.state.menuExpand});
	},
    render: function () {
		var menuExpandClass = classNames({
			'dropdown': true,
			'open': this.state.menuExpand
		});
        return (
            <nav className="navbar navbar-vc navbar-fixed-top">
                <div className="navbar-header">
                    <a className="navbar-brand"><img src="sources/images/logo.png" height="100%"/></a>
                </div>
                <ul className="nav navbar-nav">
                    <li><a className="as_btn" onClick={this.openAddElement}><span className="glyphicon glyphicon-plus"></span></a></li>
                    <li role="presentation" className={menuExpandClass}>
                        <a className="dropdown-toggle as_btn" href="#" onClick={this.clickMenuExpand}>
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
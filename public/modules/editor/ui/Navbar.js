var React = require('react');
var Modal = require('react-modal');
var ElementControl = require('./ElementControl');
var Mediator = require( '../../../helpers/Mediator' ); // need to remove too
var Elements = require( '../../../helpers/Elements' ); // need to remove too
var TreeElement = require('../layouts/tree/TreeLayout');
require('./less/navbar/navbar-init.less');
const customStyles = {
	content : {
		top                   : '50%',
		left                  : '50%',
		right                 : 'auto',
		bottom                : 'auto',
		marginRight           : '-50%',
		transform             : 'translate(-50%, -50%)',
		border				  : '0',
		background			  : 'transparent'
	}
};

var Navbar = React.createClass({
	componentWillMount: function() {
		Navbar.subscribe('app:add', function(){
			this.setState({modalIsOpen: true});;
		}.bind(this));
	},
	getInitialState: function() {
		return { modalIsOpen: false };
	},
	openModal: function(e) {
		e && e.preventDefault();
		Navbar.publish('data:activeNode', 'vc-v-root-element');
		this.setState({modalIsOpen: true});
	},
	closeModal: function(e) {
		e && e.preventDefault();
		this.setState({modalIsOpen: false});
	},
	render: function() {
		var elements = Elements.getElementsList();
		return (
			<nav className="navbar navbar-vc navbar-fixed-top">
				<div className="navbar-header">
					<a className="navbar-brand"><img src="sources/images/logo.png" height="100%"/></a>
				</div>
				<ul className="nav navbar-nav">
					<li><a className="as_btn" onClick={this.openModal}><span className="glyphicon glyphicon-plus"></span></a></li>
					<li role="presentation" className="dropdown">
						<a className="dropdown-toggle as_btn" data-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false">
							<span className="glyphicon glyphicon-align-justify"></span> <span className="caret"></span>
						</a>
						<TreeElement data={this.props.data}/>
					</li>
				</ul>
				<Modal
					isOpen={this.state.modalIsOpen}
					onRequestClose={this.closeModal}
					style={customStyles} >
					<div className="modal-dialog">
						<div className="modal-content">
							<div className="modal-header">
								<button type="button" className="close" onClick={this.closeModal}><span aria-hidden="true">&times;</span></button>
								<h4 className="modal-title">Add element</h4>
							</div>
							<div className="modal-body">
								<ul className="vc_v-modal-content">
									{elements.map(function(element) {
										return <ElementControl key={element.element} {...element}/>;
									}.bind(this))}
								</ul>
							</div>
						</div>
					</div>
				</Modal>
			</nav>
		);
	}
});
Mediator.installTo(Navbar);
module.exports = Navbar;
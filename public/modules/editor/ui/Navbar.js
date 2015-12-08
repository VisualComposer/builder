var React = require('react');
var Modal = require('react-modal');
var ElementControl = require('./ElementControl');
var Mediator = require( '../../../helpers/Mediator' ); // need to remove too
var Elements = require( '../../../helpers/Elements' ); // need to remove too

require('./Navbar.less');
const customStyles = {
	content : {
		top                   : '50%',
		left                  : '50%',
		right                 : 'auto',
		bottom                : 'auto',
		marginRight           : '-50%',
		transform             : 'translate(-50%, -50%)'
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
			<nav className="navbar navbar-default">
				<ul className="nav navbar-nav">
					<li><button onClick={this.openModal}>+ Add</button></li>
				</ul>
				<Modal
					isOpen={this.state.modalIsOpen}
					onRequestClose={this.closeModal}
					style={customStyles} >

					<h2>Add element</h2>
					<button onClick={this.closeModal}>close</button>
					<ul className="vc_v-modal-content">
						{elements.map(function(element) {
							return <ElementControl key={element.element} {...element}/>;
						}.bind(this))}
					</ul>
				</Modal>
			</nav>
		);
	}
});
Mediator.installTo(Navbar);
module.exports = Navbar;
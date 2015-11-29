var React = require('react');
var Modal = require('react-modal');
var ElementControl = require('./ElementControl');
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
	propTypes: {
		elements: React.PropTypes.array.isRequired,
	},
	getInitialState: function() {
		return { modalIsOpen: false };
	},
	openModal: function(e) {
		e.preventDefault();
		this.setState({modalIsOpen: true});
	},
	closeModal: function(e) {
		e.preventDefault();
		this.setState({modalIsOpen: false});
	},
	render: function() {
		var elements = this.props.elements;
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
module.exports = Navbar;
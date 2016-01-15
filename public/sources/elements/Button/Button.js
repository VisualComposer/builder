let React = require('react');
let Mediator = require('../../../helpers/Mediator');

let Icon = require('../Icon/Icon');

// D&D
let PropTypes = React.PropTypes;
let DragSource = require('react-dnd').DragSource;

export const ItemTypes = {
	ELEMENT: 'element'
};

let elementSource = {
	beginDrag: function (props) {
		return {
			id: props['data-vc-element'],
			element: Mediator.getService('data').get(props['data-vc-element'])
		};
	}
};

function collect(connect, monitor) {
	return {
		connectDragSource: connect.dragSource(),
		isDragging: monitor.isDragging()
	}
}

let Button = React.createClass({
	propTypes: {
		connectDragSource: PropTypes.func.isRequired,
		isDragging: PropTypes.bool.isRequired
	},
    render: function() {
		let connectDragSource = this.props.connectDragSource;
		let isDragging = this.props.isDragging;

		let { key, content, test, icon, ...other } = this.props;
		let IconProps = JSON.parse( icon || null ) || {};
		return connectDragSource(
			<button type="button" data-dragging={isDragging} className="vc-button-block " data-vc-test={test} key={key} {...other}>
				<Icon {...IconProps} />{content}</button>
		);
    }
});
module.exports = DragSource(ItemTypes.ELEMENT, elementSource, collect)(Button);

var React = require('react');
var Mediator = require('../../../helpers/Mediator');

var Icon = require('../Icon/Icon');

// D&D
var PropTypes = React.PropTypes;
var DragSource = require('react-dnd').DragSource;

export const ItemTypes = {
	ELEMENT: 'element'
};

var elementSource = {
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

var Button = React.createClass({
	propTypes: {
		connectDragSource: PropTypes.func.isRequired,
		isDragging: PropTypes.bool.isRequired
	},
    render: function() {
		var connectDragSource = this.props.connectDragSource;
		var isDragging = this.props.isDragging;

        var { key, content, test,icon, ...other } = this.props;
		var IconProps = JSON.parse(icon);
        return connectDragSource(
			<button type="button" data-dragging={isDragging} className="vc-button-block " data-vc-test={test} key={key} {...other}><Icon {...IconProps} />{content}</button>
		);
    }
});
module.exports = DragSource(ItemTypes.ELEMENT, elementSource, collect)(Button);

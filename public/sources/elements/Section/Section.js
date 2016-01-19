var React = require('react');
require('./Section.less');

// D&D
var PropTypes = React.PropTypes;
var DragSource = require('react-dnd').DragSource;
var DropTarget = require('react-dnd').DropTarget;
var flow = require('lodash/function/flow');
var Mediator = require('../../../helpers/Mediator');
var ElementComponents = require('../../../helpers/ElementComponents');

export const ItemTypes = {
	ELEMENT: 'element'
};

var elementSource = {
	beginDrag: function (props) {
		console.log('drag');
		return {};
	}
};

var elementTarget = {
	canDrop: function (props, monitor) {
		let component = ElementComponents.get( monitor.getItem().element ),
		 	container = Mediator.getService('data').get( props['data-vc-element'] ),
			containerComponent = ElementComponents.get( container ),
			dependencies = containerComponent.children.toString();

		if ( "*" === dependencies ) {
			return ! (component.strongRelation && component.strongRelation.toString());
		} else if ( dependencies.length ) {
			let allowed = false;
			// check by tag name
			if ( dependencies.indexOf(component.tag.toString()) > -1 ) {
				return true;
			}
			// check by relatedTo
			if ( component.relatedTo ) {
				component.relatedTo.toString().map( function ( relation ) {
					if ( dependencies.indexOf(relation) > -1 ) {
						allowed = true;
					}
				})
			}
			return allowed;
		}
		return false;
	},
	drop: function (props, monitor, component) {
		let element = monitor.getItem().element,
			container = Mediator.getService('data').get( props['data-vc-element'] );

		console.log('drop');
	}
};

function collectSource(connect, monitor) {
	return {
		connectDragSource: connect.dragSource(),
		isDragging: monitor.isDragging()
	}
}
function collectTarget(connect, monitor) {
	return {
		connectDropTarget: connect.dropTarget(),
		canDrop: monitor.canDrop(),
		isOver: monitor.isOver(),
		isOverCurrent: monitor.isOver({ shallow: true })
	}
}

var Section = React.createClass({
	propTypes: {
		connectDragSource: PropTypes.func.isRequired,
		isDragging: PropTypes.bool.isRequired,
		isOver: PropTypes.bool.isRequired,
		isOverCurrent: PropTypes.bool.isRequired,
		canDrop: PropTypes.bool.isRequired
	},

	renderOverlay: function (color) {
		return (
			<div style={{
				position: 'absolute',
				top: 0,
				left: 0,
				height: '100%',
				width: '100%',
				zIndex: 1,
				opacity: 0.5,
				backgroundColor: color,
				pointerEvents: 'none',
			  }} />
		);
	},

    render: function() {
		let connectDragSource = this.props.connectDragSource,
			connectDropTarget = this.props.connectDropTarget,
			isDragging = this.props.isDragging,
			isOver = this.props.isOver,
			isOverCurrent = this.props.isOverCurrent,
			canDrop = this.props.canDrop,
			{ key, content, editor, ...other } = this.props;
        return connectDragSource(connectDropTarget(<section className="vc-v-section" key={key} {...editor}>
			{!isOverCurrent && canDrop && this.renderOverlay('yellow')}
			{isOverCurrent && canDrop && this.renderOverlay('green')}

            {content}
        </section>));
    }
});

module.exports = flow(
	DragSource(ItemTypes.ELEMENT, elementSource, collectSource),
	DropTarget(ItemTypes.ELEMENT, elementTarget, collectTarget)
)(Section);
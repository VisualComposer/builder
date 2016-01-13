var React = require('react');
var Mediator = require('../../../../helpers/Mediator');
var ReactDOM = require('react-dom');

// D&D
var PropTypes = React.PropTypes;
var DragSource = require('react-dnd').DragSource;
var DropTarget = require('react-dnd').DropTarget;
var flow = require('lodash/function/flow');
var ElementComponents = require('../../../../helpers/ElementComponents');

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

var elementTarget = {
	hover: function ( props, monitor, component ) {
		//console.log(monitor.isOver({ shallow: false }) );
		//console.log(monitor.isOver({ shallow: true }) );

		let isOverChild = monitor.isOver({ shallow: true });
		if (!isOverChild) {
			return false;
		}

		console.log('hover');
		//console.log(props);
	},
	canDrop: function (props, monitor) {
		let component = ElementComponents.get( monitor.getItem().element ),
			container = Mediator.getService('data').get(props['data-vc-element']),

			containerComponent = ElementComponents.get( container ),
			dependencies = containerComponent.children ? containerComponent.children.toString() : '';

			if (monitor.getItem().element == container) {
				return false; // todo: rewrite this
			}

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
		let hasDroppedOnChild = monitor.didDrop();
		if (hasDroppedOnChild) {
			return;
		}



		let element = monitor.getItem().element,
			container = Mediator.getService('data').get( props['data-vc-element'] );

		console.log('drop');

		//component.setState({
		//	hasDropped: true,
		//	hasDroppedOnChild: hasDroppedOnChild
		//});
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

var DndElement = React.createClass({
	propTypes: {
		connectDragSource: PropTypes.func.isRequired,
		isDragging: PropTypes.bool.isRequired,
		isOver: PropTypes.bool.isRequired,
		isOverCurrent: PropTypes.bool.isRequired,
		canDrop: PropTypes.bool.isRequired
	},


	moveElement: function ( dragIndex, hoverIndex ) {
		console.log(dragIndex);
		console.log(hoverIndex);
	},

	render: function() {
		let connectDragSource = this.props.connectDragSource,
			connectDropTarget = this.props.connectDropTarget,
			isDragging = this.props.isDragging,
			isOver = this.props.isOver,
			isOverCurrent = this.props.isOverCurrent,
			canDrop = this.props.canDrop,
			{ ElementView,  content, ...other } = this.props;


		let overlay = {};
		//if (!isOverCurrent && canDrop) {
		//	overlay['data-vc-dnd-status'] = 'allowed';
		//}
		if (isOverCurrent && canDrop) {
			overlay['data-vc-dnd-status'] = 'success';
		}

		let render = React.createElement(ElementView, {
			...other,
			...overlay,
			content: content,
			ref: function (instance) {
				connectDragSource(ReactDOM.findDOMNode(instance));
				connectDropTarget(ReactDOM.findDOMNode(instance));
			}
		});

		return render;
	}
});
module.exports = flow(
	DragSource(ItemTypes.ELEMENT, elementSource, collectSource),
	DropTarget(ItemTypes.ELEMENT, elementTarget, collectTarget)
)(DndElement);
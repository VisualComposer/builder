var React = require('react');
var Mediator = require('../../.././Mediator');
var ReactDOM = require('react-dom');

// D&D
var PropTypes = React.PropTypes;
var DragSource = require('react-dnd').DragSource;
var DropTarget = require('react-dnd').DropTarget;
var flow = require('lodash/function/flow');
var ElementComponents = require('../../.././ElementComponents');

export const ItemTypes = {
  ELEMENT: 'element'
};

var DndElementServices = Mediator.installTo({});

var elementSource = {
  beginDrag: function(props, monitor) {
    let element = Mediator.getService('data').get(props.editor['data-vc-element']),
      data = {
        hoverStack: [],
        emptyHoverStack: true,
        hoverElementId: null,
        dropTarget: null,
        dropAction: 'before',
        clientOffset: null,
        dragElement: {
          element: element,
          id: element.id
        },
        parentElement: {
          element: element.parentNode,
          id: element.parentNode.id
        },
        nextElement: {
          element: element.nextSibling,
          id: function() {
            if (element.nextSibling) {
              return element.nextSibling.id;
            }
            return null;
          }
        },
        canDropCache: {},
        changeHoverElement: function(elId) {
          this.hoverElementId = elId;
          this.clientOffset = null;
          this.dropAction = 'before';
        },
        preventDrop: function() {
          return this.hoverStack.some(elem => elem['data-vc-element'] === this.dragElement.id)
        },
        offsetDifference: function() {
          if (this.clientOffset === null) {
            this.clientOffset = monitor.getClientOffset();
            return undefined;
          }
          let newOffset = monitor.getClientOffset(),
            offsetDifference = {
              x: newOffset.x - this.clientOffset.x,
              y: newOffset.y - this.clientOffset.y
            };

          this.clientOffset = monitor.getClientOffset();
          return offsetDifference;
        }
      };

    return data;
  },
  endDrag(props, monitor) {
    // remove placeholder
    let placeholder = document.getElementById(monitor.getItem().dragElement.id + '-placeholder');
    if (placeholder) {
      placeholder.remove();
    }

    if (!monitor.didDrop()) {
      if (monitor.getItem().nextElement.id()) {
        moveElementPlaceholder(monitor.getItem().dragElement.id, monitor.getItem().nextElement.id(), 'before');
      } else {
        moveElementPlaceholder(monitor.getItem().dragElement.id, monitor.getItem().parentElement.id, 'into');
      }
    }


    //monitor.getItem().dragElement.element.remove();

  }
};

var elementTarget = {

  hover: function(props, monitor, component) {
    if (!monitor.isOver()) {
      return;
    }

    if (monitor.getItem().emptyHoverStack) {
      monitor.getItem().hoverStack = [];
      monitor.getItem().emptyHoverStack = false;
    }

    // check if it is final hover element
    if (monitor.isOver({shallow: true})) {
      monitor.getItem().emptyHoverStack = true;
    } else {
      monitor.getItem().hoverStack.push(props);
      return false;
    }

    if (monitor.getItem().dragElement.id === props.editor['data-vc-element']) {
      return false;
    }

    // no move, no other actions
    let offsetDifference = monitor.getItem().offsetDifference();
    if (!offsetDifference || offsetDifference.x == 0 && offsetDifference.y == 0) {
      return false;
    }

    // if change object no need for another action
    if (monitor.getItem().hoverElementId !== props.editor['data-vc-element']) {
      monitor.getItem().changeHoverElement(props.editor['data-vc-element']);
      return false;
    }

    // get offsets and positions
    let hoverBoundingRect = ReactDOM.findDOMNode(component).getBoundingClientRect(),
      hoverMiddleX = (hoverBoundingRect.width / 2),
      hoverMiddleY = hoverBoundingRect.height / 2,
      hoverQuadX = hoverBoundingRect.width / 4,
      hoverQuadY = hoverBoundingRect.height / 4,
      clientOffset = monitor.getClientOffset(),
      hoverClientX = clientOffset.x - hoverBoundingRect.left,
      hoverClientY = clientOffset.y - hoverBoundingRect.top;

    // calculating action
    let hoverStack = monitor.getItem().hoverStack;
    let canSort = hoverStack.length && this.canDrop(hoverStack[hoverStack.length - 1], monitor);
    let canDrop = this.canDrop(props, monitor);

    if (canSort && canDrop) { // check quad sizes
      if (offsetDifference.x < 0 && hoverClientX < hoverQuadX || offsetDifference.y < 0 && hoverClientY < hoverQuadY) {
        monitor.getItem().dropAction = 'before';
      } else if (offsetDifference.x > 0 && hoverClientX > hoverQuadX * 3 || offsetDifference.y > 0 && hoverClientY > hoverQuadY * 3) {
        monitor.getItem().dropAction = 'after';
      } else {
        monitor.getItem().dropAction = 'into';
      }
      monitor.getItem().dropTarget = props.editor['data-vc-element'];
    } else if (canSort && !canDrop) { // check half size
      if (offsetDifference.x < 0 && hoverClientX < hoverMiddleX || offsetDifference.y < 0 && hoverClientY < hoverMiddleY) {
        monitor.getItem().dropAction = 'before';
      }
      if (offsetDifference.x > 0 && hoverClientX > hoverMiddleX || offsetDifference.y > 0 && hoverClientY > hoverMiddleY) {
        monitor.getItem().dropAction = 'after';
      }
      monitor.getItem().dropTarget = props.editor['data-vc-element'];
    } else if (!canSort && canDrop) { // don't check sizes, just drop
      monitor.getItem().dropAction = 'into';
      monitor.getItem().dropTarget = props.editor['data-vc-element'];
    } else {
      return;
    }

    if (!monitor.getItem().dropTarget) {
      return false;
    }
    moveElementPlaceholder(monitor.getItem().dragElement.id, monitor.getItem().dropTarget, monitor.getItem().dropAction);
  },
  canDrop: function(props, monitor) {
    if (monitor.isOver() && monitor.getItem().preventDrop()) {
      return false;
    }

    if (!monitor.getItem().canDropCache.hasOwnProperty(props.editor['data-vc-element'])) {
      monitor.getItem().canDropCache[props.editor['data-vc-element']] = canDropByRelation(props, monitor);
    }

    return monitor.getItem().canDropCache[props.editor['data-vc-element']];
  },
  drop: function(props, monitor) {
    if (monitor.didDrop()) {
      return;
    }

    if (null === monitor.getItem().dropTarget) {
      return;
    }

    // before drop revert all changes
    if (monitor.getItem().nextElement.id()) {
      moveElementPlaceholder(monitor.getItem().dragElement.id, monitor.getItem().nextElement.id(), 'before');
    } else {
      moveElementPlaceholder(monitor.getItem().dragElement.id, monitor.getItem().parentElement.id, 'into');
    }
    DndElementServices.publish('data:moveTo',
      monitor.getItem().dragElement.id,
      monitor.getItem().dropTarget,
      monitor.getItem().dropAction
    );
  }
};

function canDropByRelation(props, monitor) {
  // no need to drop to itself
  if (monitor.getItem().dragElement.id === props.editor['data-vc-element']) {
    return false;
  }
  let dragElement = monitor.getItem().dragElement.element,
    checkElement = Mediator.getService('data').get(props.editor['data-vc-element']),
    dragComponent = ElementComponents.get(dragElement),
    checkComponent = ElementComponents.get(checkElement),
    dependencies = checkComponent.children ? checkComponent.children.toString() : '';

  if ("*" === dependencies) {
    return !(dragComponent.strongRelation && dragComponent.strongRelation.toString());
  } else if (dependencies.length) {
    let allowed = false;
    // check by tag name
    if (dependencies.indexOf(dragComponent.tag.toString()) > -1) {
      return true;
    }
    // check by relatedTo
    if (dragComponent.relatedTo) {
      dragComponent.relatedTo.toString().map(function(relation) {
        if (dependencies.indexOf(relation) > -1) {
          allowed = true;
        }
      })
    }
    return allowed;
  }
  return false;
}

function moveElementPlaceholder(dragId, targetId, action) {
  let dragEl = document.querySelector('[data-vc-element="' + dragId + '"]'),
    targetEl = document.querySelector('[data-vc-element="' + targetId + '"]');

  if (dragEl && targetEl) {
    // create placeholder
    let placeholder = document.getElementById(dragId + '-placeholder');
    //if (!placeholder) {
    //	placeholder = dragEl.cloneNode(true);
    //	placeholder.classList.add('vc_ui-drag-placeholder' );
    //	placeholder.id = dragId + '-placeholder';
    //}
    // hide element if only sorting
    //console.log(dragEl.parentNode === targetEl.parentNode, dragEl.parentNode.dataset.vcElement === targetEl.parentNode.dataset.vcElement,dragEl.parentNode.dataset.vcElement, targetEl.parentNode.dataset.vcElement);
    //if (placeholder) {
    //	if (placeholder.parentNode === targetEl.parentNode) {
    //		placeholder.setAttribute('data-vc-dnd-hidden', 'true');
    //	} else {
    //		placeholder.removeAttribute('data-vc-dnd-hidden');
    //	}
    //}
    switch (action) {
      case 'before':
        targetEl.parentNode.insertBefore(dragEl, targetEl);
        break;
      case 'after':
        if (targetEl.nextSibling) {
          targetEl.parentNode.insertBefore(dragEl, targetEl.nextSibling);
        } else {
          targetEl.parentNode.appendChild(dragEl);
        }
        break;
      case 'into':
        targetEl.appendChild(dragEl);
        break;
    }
  }
}

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
    isOverCurrent: monitor.isOver({shallow: true})
  }
}

var DndElement = React.createClass(Mediator.installTo({
  propTypes: {
    connectDragSource: PropTypes.func.isRequired,
    isDragging: PropTypes.bool.isRequired,
    isOver: PropTypes.bool.isRequired,
    isOverCurrent: PropTypes.bool.isRequired,
    canDrop: PropTypes.bool.isRequired
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
    if (isDragging) {
      overlay['data-vc-dnd-status'] = 'is-dragging';
    }

    let render = React.createElement(ElementView, {
      ...other,
      ...overlay,
      content: content,
      ref: function(instance) {
        connectDragSource(ReactDOM.findDOMNode(instance));
        connectDropTarget(ReactDOM.findDOMNode(instance));
      }
    });

    return render;
  }
}));
module.exports = flow(
  DragSource(ItemTypes.ELEMENT, elementSource, collectSource),
  DropTarget(ItemTypes.ELEMENT, elementTarget, collectTarget)
)(DndElement);
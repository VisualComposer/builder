var React = require('react');
var Utils = require('../../../../helpers/Utils');
var Mediator = require('../../../../helpers/Mediator');
var classNames = require('classnames');

var Element = React.createClass({
	getInitialState: function() {
		return {
			childExpand: true,
			hasContent: false
		}
	},
	clickChildExpand: function(e) {
		this.setState({childExpand: !this.state.childExpand});
	},
	clickAddChild: function(e) {
		e.preventDefault();
		alert('add child clicked');
	},
	clickClone: function(e) {
		e.preventDefault();
		alert('clone clicked');
	},
	clickDelete: function(e) {
		e.preventDefault();
		alert('delete clicked');
	},

    addChild: function() {
        Element.publish('data:activeNode', this.props.element.id);
        Element.publish('app:add', true);
    },
    getContent: function() {
        if(this.props.data.length) {
			let level = this.props.level + 1;
            let elementsList = this.props.data.map(function( element ) {
                let data = Array.prototype.slice.call(element.childNodes);
                return <Element element={{element: element.tagName, id: element.getAttribute('id')}} data={data}
                                key={element.getAttribute('id')} level={level} />;
            });
            return <ul className="vc_ui-tree-node">{elementsList}</ul>;
        }
        return '';
    },
    render: function() {
        var element = this.props.element;
		var treeChildClass = classNames({
			'vc_ui-tree-child': true,
			'vc_ui-expand': this.state.childExpand
		});
		var content = this.getContent();
		this.state.hasContent = !!content;

		var expandTrigger = this.state.hasContent ? <i className="vc_ui-tree-child-expand-trigger glyphicon glyphicon-triangle-right" onClick={this.clickChildExpand}></i> : '';
		var childControls =
			<span className="vc_ui-tree-child-controls">
				<a className="vc_ui-tree-child-control" onClick={this.clickAddChild}><i className="glyphicon glyphicon-plus"></i></a>
				<a className="vc_ui-tree-child-control" onClick={this.clickClone}><i className="glyphicon glyphicon-minus"></i></a>
				<a className="vc_ui-tree-child-control" onClick={this.clickDelete}><i className="glyphicon glyphicon-duplicate"></i></a>
			</span>
			;


        return <li className={treeChildClass}>
			<div className="vc_ui-tree-child-row" style={{paddingLeft: this.props.level + 0.5 + 'em'}}>
				<div className="vc_ui-tree-child-col">
					{expandTrigger}
					<span className="vc_ui-tree-child-label">
						<i className="vc_ui-tree-child-label-icon glyphicon glyphicon-th"></i>
						<span>{element.element}</span>
					</span>
					{childControls}
				</div>
			</div>
			{content}
			<div style={{display: 'none'}}>
				<i className="glyphicon glyphicon-th"></i>
				{element.element}
				<a onClick={this.addChild} style={{display: 'none'}}>
					<i className="glyphicon glyphicon-plus"></i>
				</a>
			</div>
			</li>;
    }
});
Mediator.installTo(Element);
module.exports = Element;
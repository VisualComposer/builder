var vcCake = require('vc-cake');
var React = require( 'react' );
var classNames = require( 'classnames' );
var AssetManager = vcCake.getService('asset-manager');
require( './Tour.less' );
require( 'jquery' );
require( './js/accordion.js' );
require( './js/tour.js' );

AssetManager.addScripts( 'Tour', [ './js/accordion.js', './js/tour.js' ] );
AssetManager.addStyles( 'Tour', [
	'bootstrap/less/variables.less', 'bootstrap/less/mixins/gradients.less', 'less/base-colors.less',
	'less/variables.less', 'less/core.less', 'less/colors.less', 'less/options.less', 'less/mixins.less'
] );

var Tour = React.createClass( {

	/**
	 * @returns {string}
	 */
	getGapClass: function () {
		return this.props.gap > 0 ? 'vc_tta-gap-' + this.props.gap : '';
	},

	/**
	 * @returns {string}
	 */
	getPositionClass: function () {
		return 'vc_tta-tabs-position-' + this.props.position;
	},

	/**
	 * @returns {string}
	 */
	getColorClass: function () {
		return 'vc_tta-color-' + this.props.color;
	},

	/**
	 * @returns {string}
	 */
	getShapeClass: function () {
		return 'vc_tta-shape-' + this.props.shape;
	},

	/**
	 * @returns {string}
	 */
	getSpacingClass: function () {
		return 'vc_tta-spacing-' + this.props.spacing;
	},

	/**
	 * @returns {string}
	 */
	getStyleClass: function () {
		return 'vc_tta-style-' + this.props.design;
	},

	renderTab: function ( title, id, active ) {
		var className = classNames(
			'vc_tta-tab',
			(active ? 'vc_active' : null)
		);

		return (
			<li className={className} data-vc-tab="">
				<a data-vc-use-cache="false" data-vc-tabs="" data-vc-target={'[data-vc-tab-id=' + id + ']'}
				   data-vc-container=".vc_tta" target="_blank">
					<span className="vc_tta-title-text">
						{ title }
					</span>
				</a>
			</li>
		);
	},

	renderTabContents: function ( title, id, contents, active ) {
		var className = classNames(
			'vc_element vc_vc_tta_section vc_container-block vc_tta-panel',
			(active ? 'vc_active' : null)
		);
		return (
			<div
				className={className}
				data-container="1"
				data-vc-tab-id={id}
				data-tag="vc_tta_section"
				data-vc-content=".vc_tta-panel-body">
				<div data-vc-content=".vc_tta-panel-body">
					<div className="vc_tta-panel-heading">
						<h4 className="vc_tta-panel-title">
							<a data-vc-target={'[data-vc-tab-id=' + id + ']'}
							   data-vc-use-cache="false"
							   data-vc-accordion=""
							   data-vc-container=".vc_tta-container">
								<span className="vc_tta-title-text">
									{ title }
								</span>
							</a>
						</h4>
					</div>
					<div className="vc_tta-panel-body">
						<div className="vc_element-container">
							{ contents }
						</div>
					</div>
				</div>
			</div>
		);
	},

	renderTabs: function () {
		return (
			<div className="vc_tta-tabs-container">
				<ul className="vc_tta-tabs-list">
					{ this.renderTab( 'Tab 1', 'todo-tab-1', true ) }
					{ this.renderTab( 'Tab 2', 'todo-tab-2', false ) }
				</ul>
			</div>
		);
	},

	render: function () {
		var { key, position, editor, ...other } = this.props;

		var className = classNames(
			'vc_tta',
			'vc_general',
			'vc_tta-tabs',
			this.getGapClass(),
			this.getColorClass(),
			this.getStyleClass(),
			this.getShapeClass(),
			this.getSpacingClass(),
			this.getPositionClass()
		);

		return (
			<div className="vc-tabs vc_tta-container" data-vc-action="collapse" key={key} {...editor}>
				<div className={className}>

					{ position === 'left' ? this.renderTabs() : '' }

					<div className="vc_tta-panels-container">
						<div className="vc_tta-panels">
							{ this.renderTabContents( 'Tab 1', 'todo-tab-1', 'Foo', true ) }
							{ this.renderTabContents( 'Tab 2', 'todo-tab-2', 'Bar', false ) }
						</div>
					</div>

					{ position === 'right' ? this.renderTabs() : '' }

				</div>
			</div>
		);
	}
} );

module.exports = Tour;
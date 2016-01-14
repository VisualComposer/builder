var React = require( 'react' );
require( './Tabs.less' );
require( 'jquery' );
require( './js/accordion.js' );
require( './js/tabs.js' );

var Tabs = React.createClass( {

	render: function () {
		var { key, ...other } = this.props;

		return (
			<div className="vc-tabs vc_tta-container"  data-vc-action="collapse" key={key} {...other}>
				<div className="vc_general vc_tta vc_tta-tabs vc_tta-color-grey vc_tta-style-classic vc_tta-shape-rounded vc_tta-spacing-1 vc_tta-tabs-position-top vc_tta-controls-align-left">
					<div className="vc_tta-tabs-container">
						<ul className="vc_tta-tabs-list">
							<li className="vc_tta-tab vc_active" data-vc-tab="">
								<a data-vc-use-cache="false" data-vc-tabs="" data-vc-target="[data-vc-tab-id=todo-tab1]" data-vc-container=".vc_tta" target="_blank">
									<span className="vc_tta-title-text">Tab 1</span>
								</a>
							</li>
							<li className="vc_tta-tab" data-vc-tab="">
								<a data-vc-use-cache="false" data-vc-tabs="" data-vc-target="[data-vc-tab-id=todo-tab2]" data-vc-container=".vc_tta" target="_blank">
									<span className="vc_tta-title-text">Tab 2</span>
								</a>
							</li>
						</ul>
					</div>
					<div className="vc_tta-panels-container">
						<div className="vc_tta-panels">
							<div className="vc_element vc_vc_tta_section vc_container-block vc_empty vc_tta-panel vc_active" data-container="1" data-vc-tab-id="todo-tab1" data-tag="vc_tta_section" data-vc-content=".vc_tta-panel-body">
								<div data-vc-content=".vc_tta-panel-body">
									<div className="vc_tta-panel-heading">
										<h4 className="vc_tta-panel-title">
											<a data-vc-target="[data-vc-tab-id=todo-tab1]" data-vc-use-cache="false" data-vc-accordion="" data-vc-container=".vc_tta-container">
												<span className="vc_tta-title-text">Tab 1</span>
											</a>
										</h4>
									</div>
									<div className="vc_tta-panel-body">
										<div className="vc_element-container">
											Foo
										</div>
									</div>
								</div>
							</div>
							<div className="vc_element vc_vc_tta_section vc_container-block vc_empty vc_tta-panel" data-container="1" data-vc-tab-id="todo-tab2" data-tag="vc_tta_section" data-vc-content=".vc_tta-panel-body">
								<div data-vc-content=".vc_tta-panel-body">
									<div className="vc_tta-panel-heading">
										<h4 className="vc_tta-panel-title">
											<a data-vc-target="[data-vc-tab-id=todo-tab2]" data-vc-use-cache="false" data-vc-accordion="" data-vc-container=".vc_tta-container">
												<span className="vc_tta-title-text">Tab 2</span>
											</a>
										</h4>
									</div>
									<div className="vc_tta-panel-body">
										<div className="vc_element-container">
											Bar
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
} );
module.exports = Tabs;
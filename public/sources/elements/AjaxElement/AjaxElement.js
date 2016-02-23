var React = require( 'react' );

var innerAjax = function ( data, successCallback, failureCallback ) {
	var request = new XMLHttpRequest();
	request.open( 'POST', window.vcAjaxUrl, true );
	request.setRequestHeader( "Content-type", "application/x-www-form-urlencoded" );
	request.onload = function () {
		if ( request.status >= 200 && request.status < 400 ) {
			successCallback( request );
		} else {
			if ( 'function' === typeof failureCallback ) {
				failureCallback( request );
			}
		}
	};
	request.send( jQuery.param( data ) );
	return request;
};

var AjaxElement = React.createClass( {
	getInitialState: function () {
		return { shortcodeContent: { __html: '' } };
	},
	componentDidMount: function () {
		debugger;
		this.serverRequest = innerAjax( {
			action: 'vc:v:ajaxShortcodeRender',
			shortcodeString: '[wp_test_dynamic]',
			post_id: window.vcPostID
		}, function ( result ) {
			debugger;
			this.setState( {
				shortcodeContent: { __html: result.response }
			} );
		}.bind( this ) );

	},
	componentWillUnmount: function () {
		this.serverRequest.abort();
	},
	render: function () {
		let { key, editor, ...other } = this.props;
		debugger;
		return (
			<div key={key} {...editor}>
				<div>Props:
					<div dangerouslySetInnerHTML={this.state.shortcodeContent}/>
				</div>
			</div>
		);

	}
} );

module.exports = AjaxElement;
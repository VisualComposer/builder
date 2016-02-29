var React = require( 'react' );
var ReactDOM = require( 'react-dom' );

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
var injectedScriptsInline = [];
var injectedScriptsSrc = [];

var AjaxElement = React.createClass( {
	getInitialState: function () {
		return {
			shortcodeContent: 'spinner'
		}
	},
	componentDidMount: function () {
		if ( this.serverRequest ) {
			this.serverRequest.abort();
		}
		this.serverRequest = innerAjax( {
			action: 'vc:v:ajaxShortcodeRender',
			shortcodeString: this.props.shortcodeString,
			post_id: window.vcPostID
		}, function ( result ) {
			this.setState( {
				shortcodeContent: this.initScripts( result.responseText, ReactDOM.findDOMNode( this.refs[ 'it' ] ) )
			} );
		}.bind( this ) );

	},
	initScripts: function ( html, el ) {
		var $html = jQuery( html );

		function injectScript( $script ) {
			var script;
			var src = $script.attr( 'src' );
			var srcHashIndex = src ? src.indexOf( '#' ) : - 1;
			var srcQuestionIndex = src ? src.indexOf( '?' ) : - 1;

			var srcIndex = Math.min( srcQuestionIndex > - 1 ? srcQuestionIndex : srcHashIndex,
				srcHashIndex > - 1 ? srcHashIndex : srcQuestionIndex );
			var srcCode = srcIndex > - 1 ? src.substr( 0, srcIndex ) : src;
			var text = $script.text();
			if ( src && srcCode && injectedScriptsSrc.indexOf( srcCode ) == - 1 ) {
				injectedScriptsSrc.push( srcCode );
				script = document.createElement( 'script' );
				script.setAttribute( 'type', 'text/javascript' );
				script.setAttribute( 'src', src );
				el.appendChild( script );
			} else if ( ! src && injectedScriptsInline.indexOf( text ) == - 1 ) {
				injectedScriptsInline.push( text );
				script = document.createElement( 'script' );
				script.setAttribute( 'type', 'text/javascript' );
				script.text = text;
				el.appendChild( script );
			}
		}

		$html.each( function () {
			var $el = jQuery( this );
			if ( $el.is( 'script' ) ) {
				injectScript( $el );
			} else {
				var childNodes = $el.prop( 'childNodes' );
				if ( childNodes && childNodes.length && childNodes.length > 0 ) {
					$el.find( 'script' ).each( function () {
						var $script = jQuery( this );
						injectScript( $script );
					} );
				}
			}
		} );

		return html;
	},
	componentWillReceiveProps: function ( nextProps ) {
		this.setState( {
			shortcodeContent: 'spinner'
		} );
		if ( this.serverRequest ) {
			this.serverRequest.abort();
		}
		this.serverRequest = innerAjax( {
			action: 'vc:v:ajaxShortcodeRender',
			shortcodeString: nextProps.shortcodeString,
			post_id: window.vcPostID
		}, function ( result ) {
			this.setState( {
				shortcodeContent: this.initScripts( result.responseText, ReactDOM.findDOMNode( this.refs[ 'it' ] ) )
			} );
		}.bind( this ) );

	},
	componentWillUnmount: function () {
		this.serverRequest.abort();
	},
	render: function () {
		let { key, editor, ...other } = this.props;
		return (
			<div ref="it" key={key} {...editor}>
				<div>Props:
					<div dangerouslySetInnerHTML={{__html:this.state.shortcodeContent}}/>
				</div>
			</div>
		);
	}
} );

module.exports = AjaxElement;
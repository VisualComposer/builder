var Data = require('./Storage');
var Storage = require('./PostMetaData');
var AssetManager = require( '../../helpers/AssetManager' );

// Add to app
var getData = function(document) {
    let data = Array.prototype.slice.call(document.childNodes);
    let elementsList = data.map(function(element){
        return element.innerHTML;
    });
    return elementsList.join();
};
// @todo rewrite with promises
var ajaxPost = function (data, successCallback, failureCallback) {
    var request = new XMLHttpRequest();
    request.open('POST', window.vcAjaxUrl, true);
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    request.onload = function () {
        if (request.status >= 200 && request.status < 400) {
            successCallback(request);
        } else {
            if ('function' === typeof failureCallback) {
                failureCallback(request);
            }
        }
    };
    request.send(jQuery.param(data));
};
Data.subscribe('app:init', function () {
    ajaxPost({
        action: 'vcv/getPostData',
        post_id: window.vcPostID
    }, function (request) {
        var newDocument = Data.parse('<Root id="vc-v-root-element">' + request.responseText + '</Root>');
        if (newDocument.childNodes) {
            Data.setDocument(newDocument);
            Data.publish('data:changed', Data.getDocument());
        }
    });
});
Data.subscribe( 'app:save', function () {
	var content = document.getElementsByClassName( 'vc-v-layouts-html' )[ 0 ].innerHTML.replace(/\s+data\-reactid="[^"]+"/, '' ),
		scripts = AssetManager.getAssets( 'scripts' ),
		styles = AssetManager.getAssets( 'styles' );

	ajaxPost( {
		action: 'vcv/setPostData',
		post_id: window.vcPostID,
		content: content,
		data: getData( Data.getDocument() ),
		scripts: scripts,
		styles: styles
	}, function ( request ) {
		console && console.log( 'VCV: Data saved!' );
	} );
} );
window.vcData = Data; // @todo should be removed.

module.exports = Data;
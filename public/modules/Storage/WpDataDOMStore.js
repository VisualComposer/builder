var Data = require('./Storage');
var Storage = require('./PostMetaData');
// Add to app
Data.subscribe('app:init', function () {
    var request = new XMLHttpRequest();
    request.open('POST', window.vcAjaxUrl, true);
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    request.onload = function() {
        if (request.status >= 200 && request.status < 400) {
            var newDocument = Data.parse('<Root id="vc-v-root-element">' + request.responseText + '</Root>');
            if(newDocument.childNodes) {
                Data.setDocument(newDocument);
                Data.publish('data:changed', Data.getDocument());
            }
        } else {
            // We reached our target server, but it returned an error
            console && console.error('Error on ajax request');
        }
    };
    request.send(jQuery.param({
        action: 'vcv/getPostData',
        post_id: window.vcPostID
    }));
});
Data.subscribe('app:save', function(){
    var request = new XMLHttpRequest();
    request.open('POST', window.vcPostUrl, true);
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    request.onload = function() {
        if (request.status >= 200 && request.status < 400) {
            console && console.log('VCV: Data saved!');
        } else {
            // We reached our target server, but it returned an error
            console && console.error('VCV: Error on ajax request');
        }
    };
    // Here comes spinner
    var content = document.getElementsByClassName('vc-v-layouts-html')[0].innerHTML.replace(/\s+data\-reactid="[^"]+"/, '');
    request.send(jQuery.param({
        post_ID: window.vcPostID,
        content: content
    }));
});
window.vcData = Data; // @todo should be removed.

module.exports = Data;
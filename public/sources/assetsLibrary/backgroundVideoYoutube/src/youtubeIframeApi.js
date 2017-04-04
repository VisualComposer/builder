(function (window, document) {
  var apiScript = document.getElementById('vcv-asset-youtube-iframe-api');
  if (!apiScript) {
    var tag = document.createElement('script');
    tag.id = 'vcv-asset-youtube-iframe-api';
    tag.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(tag);
  }
})(window, document);

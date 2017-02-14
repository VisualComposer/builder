(function (window, document) {
  var apiScript = document.getElementById('vcv-asset-vimeo-player-api');
  if (!apiScript) {
    var tag = document.createElement('script');
    tag.id = 'vcv-asset-vimeo-player-api';
    tag.src = "https://player.vimeo.com/api/player.js";
    document.head.appendChild(tag);
  }
})(window, document);


(function (window, document) {
  function createPlugin (element) {
    var Plugin = {
      element: null,
      player: null,
      videoId: null,
      resizer: null,
      ratio: null,
      setup: function setup (element) {
        // check for data
        if (!element.getVceEmbedVideo) {
          element.getVceEmbedVideo = this;
          this.element = element;
          this.resizer = element.querySelector('.vce-asset-video-embed-sizer');
          this.createPlayer();
          this.checkOrientation = this.checkOrientation.bind(this);
          window.addEventListener('resize', this.checkOrientation);
        } else {
          this.updatePlayer();
        }
        return element.getVceEmbedVideo;
      },
      updatePlayerData: function updatePlayerData () {
        var newVideoID = element.dataset.vceAssetsVideoEmbed || null;
        if (newVideoID !== this.videoId) {
          this.videoId = newVideoID;
          this.player = element.querySelector(element.dataset.vceAssetsVideoReplacer);
        }
      },
      createPlayer: function createPlayer () {
        var _this = this;
        this.updatePlayerData();
        this.player.load();
        this.player.onloadedmetadata = function () {
          _this.resizer.setAttribute('width', _this.player.videoWidth);
          _this.resizer.setAttribute('height', _this.player.videoHeight);
          _this.resizer.setAttribute('data-vce-assets-video-state', 'visible');
          _this.ratio = parseInt(_this.player.videoWidth) / parseInt(_this.player.videoHeight);
          _this.checkOrientation();
        };
        this.player.muted = true;
        this.player.loop = true;
        var playPromise = this.player.play();
        if (playPromise !== undefined) {
          playPromise.then(_ => {}).catch(error => {});
        }
      },
      updatePlayer: function updatePlayer () {
        this.createPlayer();
      },
      checkOrientation: function checkOrientation () {
        var orientationClass = this.element.dataset.vceAssetsVideoOrientationClass || null;
        var parentStyles = window.getComputedStyle(this.element.parentNode);
        if (orientationClass) {
          if (parseInt(parentStyles.width) / parseInt(parentStyles.height) > this.ratio) {
            this.element.classList.add(orientationClass);
          } else {
            this.element.classList.remove(orientationClass);
          }
        }
      }
    };
    return Plugin.setup(element);
  }

  var plugins = {
    init: function init (selector) {
      var elements = document.querySelectorAll(selector);
      elements = [].slice.call(elements);
      elements.forEach(function (element) {
        if (!element.getVceEmbedVideo) {
          createPlugin(element);
        } else {
          element.getVceEmbedVideo.updatePlayer();
        }
      });
      if (elements.length === 1) {
        return elements.pop();
      }
      return elements;
    }
  };
  //
  window.vceAssetsBackgroundVideoEmbed = plugins.init;
})(window, document);
'use strict';

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
        let newVideoID =
        element.dataset.vceAssetsVideoEmbed || null;
        if (newVideoID !== this.videoId) {
          this.videoId = newVideoID;
          this.player = element.querySelector(element.dataset.vceAssetsVideoReplacer);
        }
      },
      createPlayer: function createPlayer () {
        this.updatePlayerData();
        this.player.load();
        this.player.muted = true;
        this.player.loop = true;
        this.player.play();
        this.checkOrientation();
      },
      updatePlayer: function updatePlayer () {
        this.createPlayer();
      },
      checkOrientation: function checkOrientation () {
        var orientationClass = this.element.dataset.vceAssetsVideoOrientationClass || null
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
          element.getVceEmbedVideo.updatePlayer()
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

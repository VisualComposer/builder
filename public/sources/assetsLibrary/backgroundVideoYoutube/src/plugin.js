(function (window, document) {
  function createPlugin(element) {
    var Plugin = {
      element: null,
      player: null,
      ytPlayer: null,
      videoId: null,
      resizer: null,
      ratio: null,
      setup: function setup(element) {
        // check for data
        if (!element.getVceYoutubeVideo) {
          element.getVceYoutubeVideo = this;
          this.element = element;
          this.resizer = element.querySelector('svg');
          this.checkYT();
          this.checkOrientation = this.checkOrientation.bind(this);
          window.addEventListener('resize', this.checkOrientation);
        } else {
          this.updatePlayer();
        }
        return element.getVceYoutubeVideo;
      },
      updatePlayerData: function updatePlayerData() {
        this.player = element.querySelector(element.dataset.vceAssetsVideoReplacer);
        this.videoId = element.dataset.vceAssetsVideoYt || null;
      },
      checkYT: function checkYT() {
        var attempts = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];

        if (typeof YT === 'undefined' || !YT.loaded) {
          if (attempts > 100) {
            console.warn('Too many attempts to load YouTube IFrame API');
            return;
          }
          var _this = this;
          setTimeout(function () {
            attempts++;
            _this.checkYT(attempts);
          }, 100);
          return;
        }
        this.createPlayer();
      },
      createPlayer: function createPlayer() {
        var _this = this;
        this.updatePlayerData();
        this.ytPlayer = new YT.Player(this.player, {
          videoId: this.videoId,
          playerVars: {
            autoplay: 1,
            start: 0,
            modestbranding: 1,
            controls: 0,
            disablekb: 1,
            fs: 0,
            iv_load_policy: 3,
            loop: 1,
            playlist: this.videoId,
            rel: 0,
            showinfo: 0
          },
          events: {
            onReady: function onReady(event) {
              var height = event.target.a.getAttribute('height');
              var width = event.target.a.getAttribute('width');
              _this.resizer.setAttribute('height', height);
              _this.resizer.setAttribute('width', width);
              _this.resizer.setAttribute('data-vce-assets-video-state', 'visible');
              _this.ratio = parseInt(width) / parseInt(height);
              _this.checkOrientation();
              event.target.mute();
            }
          }
        });
        // this.player = element;
      },
      updatePlayer: function updatePlayer() {
        this.ytPlayer.destroy();
        this.createPlayer();
      },
      checkOrientation: function checkOrientation() {
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
    init: function init(selector) {
      var elements = document.querySelectorAll(selector);
      elements = [].slice.call(elements);
      elements.forEach(function (element) {
        if (!element.getVceYoutubeVideo) {
          createPlugin(element);
        } else {
          element.getVceYoutubeVideo.updatePlayer();
        }
      });
      if (elements.length === 1) {
        return elements.pop();
      }
      return elements;
    }
  };

  function checkYT(selector) {
    var attempts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

    if (typeof YT === 'undefined' || !YT.loaded) {
      if (attempts > 100) {
        console.warn('Too many attempts to load YouTube IFrame API');
        return;
      }
      setTimeout(function () {
        attempts++;
        checkYT(selector, attempts);
      }, 100);
      return;
    }
    plugins.init(selector);
  }

  //
  window.vceAssetsBackgroundVideoYoutube = checkYT;
})(window, document);
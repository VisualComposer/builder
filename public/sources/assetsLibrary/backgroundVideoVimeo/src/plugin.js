(function (window, document) {
  function createPlugin (element) {
    var Plugin = {
      element: null,
      player: null,
      vimeoPlayer: null,
      videoId: null,
      resizer: null,
      ratio: null,
      iframe: null,
      timeoutId: null,
      setup: function setup (element) {
        // check for data
        if (!element.getVceVimeoVideo) {
          element.getVceVimeoVideo = this;
          this.element = element;
          this.resizer = element.querySelector('.vce-asset-video-vimeo-sizer');
          this.checkVimeo();
          this.checkOrientation = this.checkOrientation.bind(this);
          window.addEventListener('resize', this.checkOrientation);
        } else {
          this.updatePlayer();
        }
        return element.getVceVimeoVideo;
      },
      updatePlayerData: function updatePlayerData () {
        this.player = element.querySelector(element.dataset.vceAssetsVideoReplacer);
        this.videoId = element.dataset.vceAssetsVideoVimeo || null;
      },
      checkVimeo: function checkVimeo () {
        var attempts = arguments.length <= 0 || arguments[ 0 ] === undefined ? 0 : arguments[ 0 ];

        if (typeof Vimeo === 'undefined' || Vimeo.Player === 'undefined') {
          if (attempts > 100) {
            console.warn('Too many attempts to load Vimeo Player API');
            return;
          }
          var _this = this;
          setTimeout(function () {
            attempts++;
            _this.checkVimeo(attempts);
          }, 100);
          return;
        }
        this.createPlayer();
      },
      createPlayer: function createPlayer () {
        var _this = this;
        this.updatePlayerData();
        this.vimeoPlayer = new Vimeo.Player(this.player, {
          id: this.videoId,
          autopause: false,
          byline: false,
          portrait: false,
          title: false,
          autoplay: true,
          loop: true
        });
        this.vimeoPlayer.setVolume(0);
        this.vimeoPlayer.on('loaded', function () {
          // get player size
          var promises = [ _this.vimeoPlayer.getVideoWidth(), _this.vimeoPlayer.getVideoHeight() ];
          // TODO: Polyfill that!
          Promise.all(promises).then(function (size) {
            _this.resizer.setAttribute('width', size[ 0 ]);
            _this.resizer.setAttribute('height', size[ 1 ]);
            _this.resizer.setAttribute('data-vce-assets-video-state', 'visible');
            _this.ratio = parseInt(size[ 0 ]) / parseInt(size[ 1 ]);
            _this.checkOrientation();
          });
        });
      },
      updatePlayer: function updatePlayer () {
        if (this.vimeoPlayer) {
          this.updatePlayerData();
          this.vimeoPlayer.loadVideo(this.videoId);
        }
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
        // Detect Firefox browser
        // Firefox's API to install add-ons: InstallTrigger
        var isFirefox = typeof window.InstallTrigger !== 'undefined';
        if (isFirefox) {
          clearTimeout(this.timeoutId);
          this.timeoutId = setTimeout(this.videoBackgroundEnlarge.bind(this), 50);
        }
      },
      videoBackgroundEnlarge: function videoBackgroundEnlarge () {
        if (!this.iframe) {
          this.iframe = this.element.querySelector('iframe');
          this.iframeAspect = parseInt(this.iframe.getAttribute('height')) / parseInt(this.iframe.getAttribute('width'))
        }

        var windowAspect = (window.innerHeight / window.innerWidth);
        if (windowAspect > this.iframeAspect) {
          this.element.style.width = ((windowAspect / this.iframeAspect) * 110 + '%');
        } else {
          this.element.style.width = (100 + '%');
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
        if (!element.getVceVimeoVideo) {
          createPlugin(element);
        } else {
          element.getVceVimeoVideo.updatePlayer();
        }
      });
      if (elements.length === 1) {
        return elements.pop();
      }
      return elements;
    }
  };
  //
  window.vceAssetsBackgroundVideoVimeo = plugins.init;
})(window, document);
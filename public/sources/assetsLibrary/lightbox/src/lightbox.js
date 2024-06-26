import './lightbox.css';

/*!
 * Lightbox v2.8.2 - custom modified by Visual Composer Team
 * by Lokesh Dhakar
 *
 * More info:
 * http://lokeshdhakar.com/projects/lightbox2/
 *
 * Copyright 2007, 2015 Lokesh Dhakar
 * Released under the MIT license
 * https://github.com/lokesh/lightbox2/blob/master/LICENSE
 */

(function () {
  if (window.lightbox01613445) {
    return false;
  }
  window.lightbox01613445 = true;

  function Lightbox (options) {
    this.album = [];
    this.currentImageIndex = void 0;
    window.jQuery(this.init.bind(this));

    // options
    this.options = window.jQuery.extend({}, this.constructor.defaults);
    this.option(options);
  }

  // Descriptions of all options available on the demo site:
  // http://lokeshdhakar.com/projects/lightbox2/index.html#options
  Lightbox.defaults = {
    albumLabel: 'Image %1 of %2',
    alwaysShowNavOnTouchDevices: false,
    fadeDuration: 500,
    fitImagesInViewport: true,
    // maxWidth: 800,
    // maxHeight: 600,
    positionFromTop: 50,
    resizeDuration: 700,
    showImageNumberLabel: true,
    wrapAround: false,
    disableScrolling: false
  };

  Lightbox.prototype.option = function (options) {
    window.jQuery.extend(this.options, options);
  };

  Lightbox.prototype.imageCountLabel = function (currentImageNum, totalImages) {
    return this.options.albumLabel.replace(/%1/g, currentImageNum).replace(/%2/g, totalImages);
  };

  Lightbox.prototype.init = function () {
    this.enable();
    this.build();
  };

  // Loop through anchors and areamaps looking for either data-lightbox attributes or rel attributes
  // that contain 'lightbox'. When these are clicked, start lightbox.
  Lightbox.prototype.enable = function () {
    var self = this;
    window.jQuery('body').on('mousedown', 'a[rel^=lightbox], area[rel^=lightbox], a[data-lightbox], area[data-lightbox]', function (event) {
      event.currentTarget.addEventListener('click', function (e) {
        e.preventDefault()
        return false
      })
    })
    window.jQuery('body').on('click', 'a[rel^=lightbox], area[rel^=lightbox], a[data-lightbox], area[data-lightbox]', function (event) {
      self.start(window.jQuery(event.currentTarget));
      return false;
    });
  };

  // Build html for the lightbox and the overlay.
  // Attach event handlers to the new DOM elements. click click click
  Lightbox.prototype.build = function () {
    var self = this;
    window.jQuery('<div id="vce-lightboxOverlay" class="vce-lightboxOverlay"></div><div id="vce-lightbox" class="vce-lightbox"><div class="vce-lb-outerContainer"><div class="vce-lb-container"><img class="vce-lb-image" alt="Lightbox library placeholder image" src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" /><div class="vce-lb-nav"><a class="vce-lb-prev" href="" aria-label="Previous image"></a><a class="vce-lb-next" href="" aria-label="Next image"></a></div><div class="vce-lb-loader"><a class="vce-lb-cancel" aria-label="Close image preview"></a></div></div></div><div class="vce-lb-dataContainer"><div class="vce-lb-data"><div class="vce-lb-details"><span class="vce-lb-caption"></span><span class="vce-lb-number"></span></div><div class="vce-lb-closeContainer"><a class="vce-lb-close" aria-label="Close image preview"></a></div></div></div></div>').appendTo(window.jQuery('body'));

    // Cache jQuery objects
    this.$lightbox = window.jQuery('#vce-lightbox');
    this.$overlay = window.jQuery('#vce-lightboxOverlay');
    this.$outerContainer = this.$lightbox.find('.vce-lb-outerContainer');
    this.$container = this.$lightbox.find('.vce-lb-container');

    // Store css values for future lookup
    this.containerTopPadding = parseInt(this.$container.css('padding-top'), 10);
    this.containerRightPadding = parseInt(this.$container.css('padding-right'), 10);
    this.containerBottomPadding = parseInt(this.$container.css('padding-bottom'), 10);
    this.containerLeftPadding = parseInt(this.$container.css('padding-left'), 10);

    // Attach event handlers to the newly minted DOM elements
    this.$overlay.hide().on('click', function () {
      self.end();
      return false;
    });

    this.$lightbox.hide().on('click', function (event) {
      if (window.jQuery(event.target).attr('id') === 'vce-lightbox') {
        self.end();
      }
      return false;
    });

    this.$outerContainer.on('click', function (event) {
      if (window.jQuery(event.target).attr('id') === 'vce-lightbox') {
        self.end();
      }
      return false;
    });

    this.$lightbox.find('.vce-lb-prev').on('click', function () {
      if (self.currentImageIndex === 0) {
        self.changeImage(self.album.length - 1);
      } else {
        self.changeImage(self.currentImageIndex - 1);
      }
      return false;
    });

    this.$lightbox.find('.vce-lb-next').on('click', function () {
      if (self.currentImageIndex === self.album.length - 1) {
        self.changeImage(0);
      } else {
        self.changeImage(self.currentImageIndex + 1);
      }
      return false;
    });

    this.$lightbox.find('.vce-lb-loader, .vce-lb-close').on('click', function () {
      self.end();
      return false;
    });
  };

  // Show overlay and lightbox. If the image is part of a set, add siblings to album array.
  Lightbox.prototype.start = function ($link) {
    var self = this;
    var $window = window.jQuery(window);

    $window.on('resize', window.jQuery.proxy(this.sizeOverlay, this));

    window.jQuery('select, object, embed').css({
      visibility: 'hidden'
    });

    this.sizeOverlay();

    this.album = [];
    var imageNumber = 0;

    function addToAlbum ($link) {
      var filterClass = Array.prototype.slice.call($link.get(0).classList).find(function (item) { return item.match(/vce\-image\-filter\-\-/) }) || ''
      var $image = $link.find('img')
      self.album.push({
        link: $link.attr('href'),
        title: $link.attr('data-title') || $link.attr('title'),
        filterClass: filterClass,
        alt: $image.attr('alt')
      });
    }

    // Support both data-lightbox attribute and rel attribute implementations
    var dataLightboxValue = $link.attr('data-lightbox');
    var $links;

    // Check against closest .slick-slider parent, select only original images
    var $isSlickSlider = $link.closest('.slick-slider');
    var selector;
    if ($isSlickSlider.length) {
      selector = $isSlickSlider.find('.vc-slick-item:not(.slick-cloned) ' + $link.prop('tagName') + '[data-lightbox="' + dataLightboxValue + '"]');
    } else {
      selector = $link.prop('tagName') + '[data-lightbox="' + dataLightboxValue + '"]';
    }

    if (dataLightboxValue) {
      $links = window.jQuery(selector);
      for (var i = 0; i < $links.length; i = ++i) {
        addToAlbum(window.jQuery($links[ i ]));
        if ($links[ i ] === $link[ 0 ]) {
          imageNumber = i;
        }
      }
    } else {
      if ($link.attr('rel') === 'lightbox') {
        // If image is not part of a set
        addToAlbum($link);
      } else {
        // If image is part of a set
        $links = window.jQuery(selector);
        for (var j = 0; j < $links.length; j = ++j) {
          addToAlbum(window.jQuery($links[ j ]));
          if ($links[ j ] === $link[ 0 ]) {
            imageNumber = j;
          }
        }
      }
    }

    // Position Lightbox
    var top = $window.scrollTop() + this.options.positionFromTop;
    var left = $window.scrollLeft();
    this.$lightbox.css({
      top: top + 'px',
      left: left + 'px'
    }).fadeIn(this.options.fadeDuration);

    // Disable scrolling of the page while open
    if (this.options.disableScrolling) {
      window.jQuery('body').addClass('vce-lb-disable-scrolling');
    }

    this.changeImage(imageNumber);
  };

  // Hide most UI elements in preparation for the animated resizing of the lightbox.
  Lightbox.prototype.changeImage = function (imageNumber) {
    var self = this;

    this.disableKeyboardNav();
    var $image = this.$lightbox.find('.vce-lb-image');

    this.$overlay.fadeIn(this.options.fadeDuration);

    window.jQuery('.vce-lb-loader').fadeIn('slow');
    this.$lightbox.find('.vce-lb-image, .vce-lb-nav, .vce-lb-prev, .vce-lb-next, .vce-lb-dataContainer, .vce-lb-numbers, .vce-lb-caption').hide();

    this.$outerContainer.addClass('vce-animating');

    // When image to show is preloaded, we send the width and height to sizeContainer()
    var preloader = new Image();
    preloader.onload = function () {
      var $preloader;
      var imageHeight;
      var imageWidth;
      var maxImageHeight;
      var maxImageWidth;
      var windowHeight;
      var windowWidth;

      $image.attr('src', self.album[ imageNumber ].link);
      $image.attr('alt', self.album[ imageNumber ].alt);
      var filterClass = Array.prototype.slice.call($image.get(0).classList).find(function (item) { return item.match(/vce\-image\-filter\-\-/) }) || ''
      filterClass && $image.removeClass(filterClass)
      self.album[ imageNumber ].filterClass && ($image.addClass(self.album[ imageNumber ].filterClass));

      $preloader = window.jQuery(preloader);

      $image.width(preloader.width);
      $image.height(preloader.height);

      if (self.options.fitImagesInViewport) {
        // Fit image inside the viewport.
        // Take into account the border around the image and an additional 10px gutter on each side.

        windowWidth = window.jQuery(window).width();
        windowHeight = window.jQuery(window).height();
        maxImageWidth = windowWidth - self.containerLeftPadding - self.containerRightPadding - 20;
        maxImageHeight = windowHeight - self.containerTopPadding - self.containerBottomPadding - 120;

        // Check if image size is larger then maxWidth|maxHeight in settings
        if (self.options.maxWidth && self.options.maxWidth < maxImageWidth) {
          maxImageWidth = self.options.maxWidth;
        }
        if (self.options.maxHeight && self.options.maxHeight < maxImageWidth) {
          maxImageHeight = self.options.maxHeight;
        }

        // Is there a fitting issue?
        if ((preloader.width > maxImageWidth) || (preloader.height > maxImageHeight)) {
          if ((preloader.width / maxImageWidth) > (preloader.height / maxImageHeight)) {
            imageWidth = maxImageWidth;
            imageHeight = parseInt(preloader.height / (preloader.width / imageWidth), 10);
            $image.width(imageWidth);
            $image.height(imageHeight);
          } else {
            imageHeight = maxImageHeight;
            imageWidth = parseInt(preloader.width / (preloader.height / imageHeight), 10);
            $image.width(imageWidth);
            $image.height(imageHeight);
          }
        }
      }
      self.sizeContainer($image.width(), $image.height());
    };

    preloader.src = this.album[ imageNumber ].link;
    this.album[ imageNumber ].filterClass && (preloader.classList.add(this.album[ imageNumber ].filterClass));
    this.currentImageIndex = imageNumber;
  };

  // Stretch overlay to fit the viewport
  Lightbox.prototype.sizeOverlay = function () {
    this.$overlay
      .width(window.jQuery(document).width())
      .height(window.jQuery(document).height());
  };

  // Animate the size of the lightbox to fit the image we are showing
  Lightbox.prototype.sizeContainer = function (imageWidth, imageHeight) {
    var self = this;

    var oldWidth = this.$outerContainer.outerWidth();
    var oldHeight = this.$outerContainer.outerHeight();
    var newWidth = imageWidth + this.containerLeftPadding + this.containerRightPadding;
    var newHeight = imageHeight + this.containerTopPadding + this.containerBottomPadding;

    function postResize () {
      self.$lightbox.find('.vce-lb-dataContainer').width(newWidth);
      self.$lightbox.find('.vce-lb-prevLink').height(newHeight);
      self.$lightbox.find('.vce-lb-nextLink').height(newHeight);
      self.showImage();
    }

    if (oldWidth !== newWidth || oldHeight !== newHeight) {
      this.$outerContainer.animate({
        width: newWidth,
        height: newHeight
      }, this.options.resizeDuration, 'swing', function () {
        postResize();
      });
    } else {
      postResize();
    }
  };

  // Display the image and its details and begin preload neighboring images.
  Lightbox.prototype.showImage = function () {
    this.$lightbox.find('.vce-lb-loader').stop(true).hide();
    this.$lightbox.find('.vce-lb-image').fadeIn('slow');

    this.updateNav();
    this.updateDetails();
    this.preloadNeighboringImages();
    this.enableKeyboardNav();
  };

  // Display previous and next navigation if appropriate.
  Lightbox.prototype.updateNav = function () {
    // Check to see if the browser supports touch events. If so, we take the conservative approach
    // and assume that mouse hover events are not supported and always show prev/next navigation
    // arrows in image sets.
    var alwaysShowNav = false;
    try {
      document.createEvent('TouchEvent');
      alwaysShowNav = (this.options.alwaysShowNavOnTouchDevices) ? true : false;
    } catch (e) {}

    this.$lightbox.find('.vce-lb-nav').show();

    if (this.album.length > 1) {
      if (this.options.wrapAround) {
        if (alwaysShowNav) {
          this.$lightbox.find('.vce-lb-prev, .vce-lb-next').css('opacity', '1');
        }
        this.$lightbox.find('.vce-lb-prev, .vce-lb-next').show();
      } else {
        if (this.currentImageIndex > 0) {
          this.$lightbox.find('.vce-lb-prev').show();
          if (alwaysShowNav) {
            this.$lightbox.find('.vce-lb-prev').css('opacity', '1');
          }
        }
        if (this.currentImageIndex < this.album.length - 1) {
          this.$lightbox.find('.vce-lb-next').show();
          if (alwaysShowNav) {
            this.$lightbox.find('.vce-lb-next').css('opacity', '1');
          }
        }
      }
    }
  };

  // Display caption, image number, and closing button.
  Lightbox.prototype.updateDetails = function () {
    var self = this;

    // Enable anchor clicks in the injected caption html.
    // Thanks Nate Wright for the fix. @https://github.com/NateWr
    if (typeof this.album[ this.currentImageIndex ].title !== 'undefined' &&
      this.album[ this.currentImageIndex ].title !== '') {
      this.$lightbox.find('.vce-lb-caption')
        .html(this.album[ this.currentImageIndex ].title)
        .fadeIn('fast')
        .find('a').on('click', function (event) {
        if (window.jQuery(this).attr('target') !== undefined) {
          window.open(window.jQuery(this).attr('href'), window.jQuery(this).attr('target'));
        } else {
          location.href = window.jQuery(this).attr('href');
        }
      });
    }

    if (this.album.length > 1 && this.options.showImageNumberLabel) {
      var labelText = this.imageCountLabel(this.currentImageIndex + 1, this.album.length);
      this.$lightbox.find('.vce-lb-number').text(labelText).fadeIn('fast');
    } else {
      this.$lightbox.find('.vce-lb-number').hide();
    }

    this.$outerContainer.removeClass('animating');

    this.$lightbox.find('.vce-lb-dataContainer').fadeIn(this.options.resizeDuration, function () {
      return self.sizeOverlay();
    });
  };

  // Preload previous and next images in set.
  Lightbox.prototype.preloadNeighboringImages = function () {
    if (this.album.length > this.currentImageIndex + 1) {
      var preloadNext = new Image();
      preloadNext.src = this.album[ this.currentImageIndex + 1 ].link;
    }
    if (this.currentImageIndex > 0) {
      var preloadPrev = new Image();
      preloadPrev.src = this.album[ this.currentImageIndex - 1 ].link;
    }
  };

  Lightbox.prototype.enableKeyboardNav = function () {
    window.jQuery(document).on('keyup.keyboard', window.jQuery.proxy(this.keyboardAction, this));
  };

  Lightbox.prototype.disableKeyboardNav = function () {
    window.jQuery(document).off('.keyboard');
  };

  Lightbox.prototype.keyboardAction = function (event) {
    var KEYCODE_ESC = 27;
    var KEYCODE_LEFTARROW = 37;
    var KEYCODE_RIGHTARROW = 39;

    var keycode = event.keyCode;
    var key = String.fromCharCode(keycode).toLowerCase();
    if (keycode === KEYCODE_ESC || key.match(/x|o|c/)) {
      this.end();
    } else if (key === 'p' || keycode === KEYCODE_LEFTARROW) {
      if (this.currentImageIndex !== 0) {
        this.changeImage(this.currentImageIndex - 1);
      } else if (this.options.wrapAround && this.album.length > 1) {
        this.changeImage(this.album.length - 1);
      }
    } else if (key === 'n' || keycode === KEYCODE_RIGHTARROW) {
      if (this.currentImageIndex !== this.album.length - 1) {
        this.changeImage(this.currentImageIndex + 1);
      } else if (this.options.wrapAround && this.album.length > 1) {
        this.changeImage(0);
      }
    }
  };

  // Closing time. :-(
  Lightbox.prototype.end = function () {
    this.disableKeyboardNav();
    window.jQuery(window).off('resize', this.sizeOverlay);
    this.$lightbox.fadeOut(this.options.fadeDuration);
    this.$overlay.fadeOut(this.options.fadeDuration);
    window.jQuery('select, object, embed').css({
      visibility: 'visible'
    });
    if (this.options.disableScrolling) {
      window.jQuery('body').removeClass('vce-lb-disable-scrolling');
    }
  };

  return new Lightbox();
})();

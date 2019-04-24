import PhotoSwipe from './photoswipe';
import PhotoSwipeUI_Default from './photoswipe-ui-default';
import './photoswipe.css';

(function () {
  var openedPhotoswipe;
  window.vcv.on('ready', function () {
    var pswp = document.getElementById('pswp');
    if (pswp) {
      openedPhotoswipe && openedPhotoswipe.destroy && openedPhotoswipe.destroy();
      pswp.remove();
    }
    var pswpHtml = '<div class="pswp" id="pswp" tabindex="-1" role="dialog" aria-hidden="true"><div class="pswp__bg"></div><div class="pswp__scroll-wrap"><div class="pswp__container"><div class="pswp__item"></div><div class="pswp__item"></div><div class="pswp__item"></div></div><div class="pswp__ui pswp__ui--hidden"><div class="pswp__top-bar"><div class="pswp__counter"></div><button class="pswp__button pswp__button--close" title="Close (Esc)"></button><button class="pswp__button pswp__button--fs" title="Toggle fullscreen"></button><button class="pswp__button pswp__button--zoom" title="Zoom in/out"></button><div class="pswp__preloader"><div class="pswp__preloader__icn"><div class="pswp__preloader__cut"><div class="pswp__preloader__donut"></div></div></div></div></div><div class="pswp__share-modal pswp__share-modal--hidden pswp__single-tap"><div class="pswp__share-tooltip"></div></div><button class="pswp__button pswp__button--arrow--left" title="Previous (arrow left)"></button><button class="pswp__button pswp__button--arrow--right" title="Next (arrow right)"></button><div class="pswp__caption"><div class="pswp__caption__center"></div></div></div></div></div>';
    var div = document.createElement('div');
    div.innerHTML = pswpHtml
    pswp = div.children[ 0 ];
    document.body.appendChild(pswp);

    var initPhotoSwipeFromDOM = function (domGallery) {
      var galleryId = domGallery.dataset.photoswipeGallery;
      var domPswp = pswp

      // parse data from images
      var parseElements = function () {
        var items = [];
        var imageList = domGallery.querySelectorAll('[data-photoswipe-item]:not([data-cloned])[data-photoswipe-image]');
        if (!imageList.length) {
          imageList = domGallery.querySelectorAll('[data-photoswipe-item]:not([data-cloned]) [data-photoswipe-image]');
        }
        if (imageList) {
          imageList = Array.prototype.slice.call(imageList);
          imageList.forEach(function (image) {
            var img = image.querySelector('img') || image.querySelector('canvas');
            if (img) {
              var filterClass = Array.prototype.slice.call(image.classList).find(function (className) { return className.match(/vce\-image\-filter\-\-/) }) || '';
              var item = {
                src: image.href,
                w: img.naturalWidth,
                h: img.naturalHeight,
                el: image,
                title: image.dataset.photoswipeCaption,
                filterClass: filterClass
              };
              items.push(item);
            }
          });
        }
        return items;
      };

      // find nearest parent element
      var closest = function closest (el, fn) {
        return el && (fn(el) ? el : closest(el.parentNode, fn));
      };

      // triggers when user clicks on thumbnail image
      var onThumbnailsClick = function (e) {
        e = e || window.event;
        e.preventDefault ? e.preventDefault() : e.returnValue = false;
        if (!closest(e.target, function (el) { return el.dataset && el.dataset.photoswipeGallery })) {
          return;
        }
        var eTarget = closest(e.target, function (el) {
          return !!el.dataset.photoswipeImage;
        });
        var clickedGallery = closest(eTarget, function (el) {
          return (el.dataset.photoswipeGallery && el.dataset.photoswipeGallery === eTarget.dataset.photoswipeImage);
        });
        if (!clickedGallery) {
          return;
        }

        var index = eTarget.dataset.photoswipeIndex;
        if (index >= 0) {
          openPhotoSwipe(index, clickedGallery);
        }
        return false;
      };

      // parse picture index and gallery index from URL (#&pid=1&gid=2)
      var photoswipeParseHash = function () {
        var hash = window.location.hash.substring(1),
          params = {};
        if (hash.length < 5) {
          return params;
        }
        var vars = hash.split('&');
        for (var i = 0; i < vars.length; i++) {
          if (!vars[ i ]) {
            continue;
          }
          var pair = vars[ i ].split('=');
          if (pair.length < 2) {
            continue;
          }
          params[ pair[ 0 ] ] = pair[ 1 ];
        }
        return params;
      };

      var openPhotoSwipe = function (index, galleryElement, disableAnimation, fromURL) {
        var items = parseElements(galleryElement);
        var options = {
          galleryUID: galleryId,
          getThumbBoundsFn: function (index) {
            var pageYScroll = window.pageYOffset || document.documentElement.scrollTop;
            var rect = items[ index ].el.getBoundingClientRect();
            return { x: rect.left, y: rect.top + pageYScroll, w: rect.width };
          }
        };

        if (fromURL) {
          if (options.galleryPIDs) {
            // parse real index when custom PIDs are used
            // http://photoswipe.com/documentation/faq.html#custom-pid-in-url
            for (var j = 0; j < items.length; j++) {
              if (items[ j ].pid == index) {
                options.index = j;
                break;
              }
            }
          } else {
            // in URL indexes start from 1
            options.index = parseInt(index, 10) - 1;
          }
        } else {
          options.index = parseInt(index, 10);
        }

        if (isNaN(options.index)) {
          return;
        }

        if (disableAnimation) {
          options.showAnimationDuration = 0;
        }

        options.hideAnimationDuration = 100;

        var gallery = openedPhotoswipe = new PhotoSwipe(domPswp, PhotoSwipeUI_Default, items, options);
        gallery.init();
      };

      var galleryElements = domGallery.querySelectorAll('[data-photoswipe-image]');
      if (galleryElements) {
        galleryElements = Array.prototype.slice.call(galleryElements);
        galleryElements.forEach(function (item, index) {
          item.setAttribute('data-pswp-uid', index + 1);
          item.onclick = onThumbnailsClick;
        });
      }

      // Parse URL and open gallery if it contains #&pid=3&gid=1
      var hashData = photoswipeParseHash();
      if (hashData.pid && hashData.gid) {
        openPhotoSwipe(hashData.pid, galleryElements[ hashData.gid - 1 ], true, true);
      }
    };

    var galleries = document.querySelectorAll('[data-photoswipe-gallery]');
    if (galleries) {
      galleries = Array.prototype.slice.call(galleries);
      galleries.forEach(function (gallery) {
        initPhotoSwipeFromDOM(gallery);
      });
    }
  })
})()

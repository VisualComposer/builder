import jQuery from 'jquery'
import 'slick-carousel'
import './sources/less/wpsettings/init.less'

(($) => {
  $(() => {
    let popupOpened = false
    let $popup = $('.vcv-popup-container')
    let loadSlider = () => {
      let $slider = $('.vcv-popup-slider')
      $slider.slick({
        dots: true,
        slidesToShow: 1,
        arrows: false,
        autoplay: true,
        autoplaySpeed: 5000,
        centerMode: true,
        centerPadding: '0px',
        focusOnSelect: true
      })

      let isGifImage = (img) => {
        return /^(?!data:).*\.gif/i.test(img.src)
      }
      let createGifCanvas = (img, width, height) => {
        let c = document.createElement('canvas')
        c.width = width
        c.height = height
        c.getContext('2d').drawImage(img, 0, 0, width, height)
        for (let j = 0; j < img.attributes.length; j++) {
          let attr = img.attributes[ j ]
          c.setAttribute(attr.name, attr.value)
        }
        c.className = 'vcv-popup-slider-canvas'
        img.parentNode.appendChild(c, img)
      }
      let getNaturalImgSizes = (imgElement) => {
        let imgSrc = imgElement.src
        let newImg = new window.Image()

        newImg.onload = () => {
          if (isGifImage(imgElement)) {
            createGifCanvas(imgElement, newImg.width, newImg.height)
          }
        }
        newImg.src = imgSrc
      }

      // create canvas for all slider gifs
      [].slice.apply($('.vcv-popup-slider-img')).map(getNaturalImgSizes)
    }

    let loadAnimation = () => {
      let $zoomContainer = $('.vcv-popup-loading-zoom')
      let $popupInner = $('.vcv-popup')

      let popupWidth = $popupInner[ 0 ].getBoundingClientRect().width
      let popupHeight = $popupInner[ 0 ].getBoundingClientRect().height

      let isWidthBigger = popupWidth > popupHeight
      let width = isWidthBigger ? popupWidth : popupHeight
      let circleWidth = width + width / 2

      $zoomContainer[ 0 ].style.width = circleWidth + 'px'
      $zoomContainer[ 0 ].style.height = circleWidth + 'px'

      let topPosition = isWidthBigger ? (popupWidth - popupHeight + width / 2) / 2 : (width / 4)
      let leftPosition = isWidthBigger ? (width / 4) : (popupHeight - popupWidth + width / 2) / 2
      $zoomContainer[ 0 ].style.top = -topPosition + 'px'
      $zoomContainer[ 0 ].style.left = -leftPosition + 'px'
    }

    $('#first-screen-button').on('click', () => {
      // second screen shows
      $popup.removeClass('vcv-first-screen--active').addClass('vcv-form-screen--active')
    })

    $('#login-form').on('submit', (e) => {
      e.preventDefault()
      let $errorPopup = $('.vcv-popup-error')

      if (e.currentTarget[ 0 ].value && e.currentTarget[ 1 ].value) {
        // third / loading screen shows, loading starts here
        $popup.removeClass('vcv-form-screen--active').addClass('vcv-loading-screen--active')

        let loadLastScreen = () => {
          loadAnimation()
          $popup.addClass('vcv-form-loaded')

          function whichTransitionEvent () {
            let t
            let el = document.createElement('fakeelement')
            let transitions = {
              'transition': 'transitionend',
              'OTransition': 'oTransitionEnd',
              'MozTransition': 'transitionend',
              'WebkitTransition': 'webkitTransitionEnd'
            }

            for (t in transitions) {
              if (el.style[ t ] !== undefined) {
                return transitions[ t ]
              }
            }
          }

          let transitionEvent = whichTransitionEvent()

          $('.vcv-popup-loading-zoom').one(transitionEvent, (event) => {
            // last screen shows
            $popup.removeClass('vcv-loading-screen--active').addClass('vcv-last-screen--active')
            loadSlider()
          })
        }

        // loading ends / loaded
        setTimeout(loadLastScreen, 2000)
      } else {
        // error shows
        $errorPopup.addClass('vcv-popup-error--active')
        setTimeout(() => {
          $errorPopup.removeClass('vcv-popup-error--active')
        }, 2000)
      }
    })

    $('.vcv-popup-close-button').on('click', () => {
      $popup.addClass('vcv-popup-container--hidden').removeClass('vcv-first-screen--active').removeClass('vcv-form-screen--active').removeClass('vcv-loading-screen--active').removeClass('vcv-last-screen--active').removeClass('vcv-form-loaded').addClass('vcv-first-screen--active')
      console.log('closed')
      window.location.href = 'index.php'
    })

    $('#activate-visual-composer').on('click', () => {
      $popup.removeClass('vcv-popup-container--hidden')

      if (!popupOpened) {
        popupOpened = true
      }
    })
  })
})(jQuery)

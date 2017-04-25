import 'slick-carousel'
import $ from 'jquery'

$(() => {
  let $popup = $('.vcv-popup-container')
  if ($popup.length) {
    let $errorPopup = $('.vcv-popup-error')
    let $zoomContainer = $('.vcv-popup-loading-zoom')
    let $popupInner = $('.vcv-popup')
    let $slider = $('.vcv-popup-slider')
    let $inputEmail = $('#vcv-account-login-form-email')

    let loadSlider = () => {
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

    let loadLastScreen = () => {
      closeError()
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
        showLastScreen()
        loadSlider()
      })
    }

    let showLoadingScreen = () => {
      $popup.removeClass('vcv-first-screen--active vcv-last-screen--active').addClass('vcv-loading-screen--active')
    }
    let showFirstScreen = () => {
      $popup.removeClass('vcv-loading-screen--active vcv-last-screen--active').addClass('vcv-first-screen--active')
    }
    let showLastScreen = () => {
      $popup.removeClass('vcv-loading-screen--active vcv-first-screen--active').addClass('vcv-last-screen--active')
    }
    let showError = (msg, timeout) => {
      $errorPopup.text(msg)
      $errorPopup.addClass('vcv-popup-error--active')

      if (timeout) {
        window.setTimeout(closeError, timeout)
      }
    }
    let closeError = () => {
      $errorPopup.removeClass('vcv-popup-error--active')
    }
    let ajaxTimeoutFinished = false
    let ajaxTimeoutTimer = () => {
      // Function used to make sure Loading windows is shown for at-least 2secs
      if (ajaxTimeoutFinished) {
        loadLastScreen()
      } else {
        ajaxTimeoutFinished = true
      }
    }
    let ajaxTimeout
    $('#vcv-account-login-form').on('submit', (e) => {
      e.preventDefault()

      let email = $inputEmail.val()
      if (email) {
        // third / loading screen shows, loading starts here
        showLoadingScreen()
        // loading ends / loaded
        // Assign handlers immediately after making the request,
        // and remember the jqxhr object for this request
        ajaxTimeout = setTimeout(ajaxTimeoutTimer, 2000)
        $.post(window.vcvAccountUrl, {
          email: email,
          'vcv-nonce': window.vcvAdminNonce
        }, () => {
          if (ajaxTimeoutFinished) {
            loadLastScreen()
          } else {
            ajaxTimeoutFinished = true
          }
        }).fail((response) => {
          let responseJson = JSON.parse(response.responseText)
          if (responseJson && responseJson.message) {
            showError('Your activation request failed due to the e-mail address format. Please check your e-mail address and try again.', 10000)
          } else {
            showError('Your activation request failed. Please try again.', 10000)
          }
          clearTimeout(ajaxTimeout)
          ajaxTimeoutFinished = false
          showFirstScreen()
        })
      } else {
        // error shows\
        showError('Please provide correct E-Mail')
      }
    })

    $('.vcv-popup-close-button').on('click', () => {
      window.location.href = 'index.php'
    })

    let src = $popupInner.css('background-image')
    let url = src.match(/\((.*?)\)/)[ 1 ].replace(/('|")/g, '')

    let img = new window.Image()
    img.onload = () => {
      $popup.removeClass('vcv-popup-container--hidden')
      showLoadingScreen()
      setTimeout(() => {
        if (window.vcvActivationActivePage === 'last') {
          loadLastScreen()
        } else {
          showFirstScreen()
        }
      }, 300)
    }
    img.src = url
    if (img.complete) {
      img.onload()
    }
  }
})

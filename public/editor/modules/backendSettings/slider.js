/* eslint-disable import/no-webpack-loader-syntax */
import 'imports-loader?exports=>undefined!slick-carousel'

(($) => {
  let $slider = $('.vcv-popup-slider')

  let loadSlider = () => {
    if ($slider.hasClass('slick-initialized')) {
      return
    }
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

  module.exports = { loadSlider: loadSlider }
})(window.jQuery)

import React from 'react'
import Slider from 'react-slick'

const slideData = window.VCV_ACTIVATION_SLIDES && window.VCV_ACTIVATION_SLIDES()

export default class SliderComponent extends React.Component {
  getSlides () {
    return slideData && slideData.map((item, i) => {
      return (
        <div className='vcv-activation-slider-item' key={`vcv-activation-slider-item-${i}`}>
          <img className='vcv-activation-slider-item-image' src={item.url} alt='Visual Composer Website Builder' />
          <p className='vcv-activation-slider-item-description'>{item.title}</p>
        </div>
      )
    })
  }
  render () {
    const settings = {
      dots: true,
      slidesToShow: 1,
      arrows: false,
      autoplay: true,
      autoplaySpeed: 5000,
      centerMode: true,
      centerPadding: '0px',
      focusOnSelect: true
    }

    return (
      <Slider {...settings} className='vcv-activation-slider'>
        {this.getSlides()}
      </Slider>

    )
  }
}

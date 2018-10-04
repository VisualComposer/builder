import React from 'react'
import Slider from 'react-slick'

const slideData = [
  {
    imgSrc: 'https://i.imgur.com/TDPxBhD.png',
    text: 'Build your site with the help of drag and drop editor straight from the frontend - it\'s that easy.'
  },
  {
    imgSrc: 'https://i.imgur.com/U1L9jbm.png',
    text: 'Get more elements and templates from the Visual Composer Hub - a free online marketplace.'
  },
  {
    imgSrc: 'https://i.imgur.com/km7zyAi.png',
    text: 'Unparallel performance for you and your website to rank higher and deliver faster.'
  },
  {
    imgSrc: 'https://i.imgur.com/q7tOBbF.png',
    text: 'Control every detail of your website with flexible design options and customization tools.'
  }
]

export default class SliderComponent extends React.Component {
  getSlides () {
    return slideData.map((item, i) => {
      return (
        <div className='vcv-activation-slider-item' key={`vcv-activation-slider-item-${i}`}>
          <img className='vcv-activation-slider-item-image' src={item.imgSrc} alt='Visual Composer Website Builder' />
          <p className='vcv-activation-slider-item-description'>{item.text}</p>
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

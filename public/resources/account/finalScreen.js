import React from 'react'
import VCVLogo from './vcvLogo'
import VersionBox from './versionBox'

export default class FinalScreen extends React.Component {
  componentDidMount () {
    const wrapper = document.querySelector('.vcv-activation-parallax-block')
    const layerOne = document.querySelector('.vcv-activation-parallax-inner')

    wrapper.addEventListener('mousemove', (e) => {
      const width = document.body.getBoundingClientRect().width
      const height = document.body.getBoundingClientRect().height
      const offsetX = 0.5 - e.pageX / width
      const offsetY = 0.5 - e.pageY / height
      const offset = 90
      layerOne.style.transform = `translate3d(${Math.round(offsetX * offset)}px, ${Math.round(offsetY * offset)}px, 0px`
    })
  }

  render () {
    return (
      <React.Fragment>
        <VCVLogo />
        <VersionBox />
        <p className='vcv-activation-heading'>
          Create a Professional WordPress Website.<br /> Any Layout. Fast and Easy.
        </p>
        <div className='vcv-activation-parallax-block'>
          <div className='vcv-activation-parallax-inner' />
          <img className='vcv-activation-parallax-fixed' src='https://i.imgur.com/mYtrplp.png' alt='Visual Composer Navbar' />
        </div>
        <div className='vcv-activation-button-container'>
          <a className='vcv-activation-button'>Create new page</a>
        </div>
      </React.Fragment>
    )
  }
}

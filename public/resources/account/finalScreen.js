import React from 'react'
import VCVLogo from './vcvLogo'
import VersionBox from './versionBox'

export default class FinalScreen extends React.Component {
  constructor (props) {
    super(props)

    this.parallaxBlock = React.createRef()
    this.parallaxLayer = React.createRef()
    this.activationContent = React.createRef()

    this.doMouseMoveParallax = this.doMouseMoveParallax.bind(this)
  }

  componentDidMount () {
    this.parallaxBlock.current.addEventListener('mousemove', this.doMouseMoveParallax)

    setTimeout(() => {
      this.activationContent.current.classList.add('vcv-activation-content--active')
    }, 200)
  }

  componentWillUnmount () {
    this.parallaxBlock.current.removeEventListener('mousemove', this.doMouseMoveParallax)
  }

  doMouseMoveParallax (e) {
    const width = document.body.getBoundingClientRect().width
    const height = document.body.getBoundingClientRect().height
    const offsetX = 0.5 - e.pageX / width
    const offsetY = 0.5 - e.pageY / height
    const offset = 90
    this.parallaxLayer.current.style.transform = `translate3d(${Math.round(offsetX * offset)}px, ${Math.round(offsetY * offset)}px, 0px`
  }

  render () {
    return (
      <div className='vcv-activation-content' ref={this.activationContent}>
        <VCVLogo />
        <VersionBox />
        <p className='vcv-activation-heading'>
          Create a Professional WordPress Website.<br /> Any Layout. Fast and Easy.
        </p>
        <div className='vcv-activation-parallax-block' ref={this.parallaxBlock}>
          <div className='vcv-activation-parallax-inner' ref={this.parallaxLayer} />
          <img className='vcv-activation-parallax-fixed' src='https://i.imgur.com/mYtrplp.png' alt='Visual Composer Navbar' />
        </div>
        <div className='vcv-activation-button-container'>
          <a href={window.VCV_CREATE_NEW_URL()} className='vcv-activation-button'>{window.VCV_CREATE_NEW_TEXT()}</a>
        </div>
      </div>
    )
  }
}

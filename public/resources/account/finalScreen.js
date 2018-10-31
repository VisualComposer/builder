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
      this.activationContent.current && this.activationContent.current.classList.add('vcv-activation-content--active')
    }, 200)
  }

  componentWillUnmount () {
    this.parallaxBlock.current.removeEventListener('mousemove', this.doMouseMoveParallax)
  }

  doMouseMoveParallax (e) {
    const blockClientReact = this.getElementOffset(this.parallaxBlock.current)
    const offsetX = e.pageX - (blockClientReact.left + blockClientReact.width / 2)
    const offsetY = e.pageY - (blockClientReact.top + blockClientReact.height / 2)
    const allowedOffsetX = 30
    const allowedOffsetY = 20
    const percentageOffsetX = offsetX / (blockClientReact.width / 2)
    const percentageOffsetY = offsetY / (blockClientReact.height / 2)

    this.parallaxLayer.current.style.transform = `translate3d(${Math.round(-allowedOffsetX * percentageOffsetX)}px, ${Math.round(-allowedOffsetY * percentageOffsetY)}px, 0px`
  }

  getElementOffset (el) {
    const rect = el.getBoundingClientRect()
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop
    return { top: rect.top + scrollTop, left: rect.left + scrollLeft, width: rect.width, height: rect.height }
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
          <div className='vcv-activation-parallax-fixed' />
        </div>
        <div className='vcv-activation-button-container'>
          <a href={window.VCV_CREATE_NEW_URL()} className='vcv-activation-button'>{window.VCV_CREATE_NEW_TEXT()}</a>
        </div>
      </div>
    )
  }
}

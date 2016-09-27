import React from 'react'
import StyleControlElement from './styleControlElement'

class StyleControl extends React.Component {
  state = {
    activeButtonIndex: 0
  }

  controls = [
    {
      title: 'Local CSS',
      index: 1
    },
    {
      title: 'Global CSS',
      index: 2
    }
  ]

  handleClick () {
    console.log(this.props)
  }

  getButtonProps (index) {
    return {
      buttonIndex: index
    }
  }

  changeActiveButton = (buttonIndex) => {
    this.setState({
      activeTabIndex: buttonIndex
    })
  }

  getControls () {
    let buttons = []
    for (let props in this.controls) {
      let buttonProps = this.getButtonProps(this.controls[props].index)
      buttons.push(
        <StyleControlElement
          key={this.controls[props].title}
          index={this.controls[props].index}
          controlName={this.controls[props].title}
          {...buttonProps}
        />
      )
    }
    return buttons
  }

  render () {
    let controls = this.getControls()
    return (
      <div className='vcv-ui-style-control-container'>
        {controls}
      </div>
    )
  }
}

export default StyleControl

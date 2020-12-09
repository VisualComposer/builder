import React from 'react'

export default class TooltipBox extends React.Component {
  constructor (props) {
    super(props)

    this.tooltipBoxRef = React.createRef()
  }

  componentDidMount () {
    if (this.tooltipBoxRef && this.tooltipBoxRef.current) {
      const suggestionRect = this.tooltipBoxRef.current.getBoundingClientRect()
      const bodyRect = window.document.body.getBoundingClientRect()
      if (suggestionRect.bottom > bodyRect.height) {
        this.props.setTopState(true)
      }
    }
  }

  render () {
    return (
      <div
        ref={this.tooltipBoxRef}
        className='vcv-tooltip-box'
        style={this.props.boxStyles}
        dangerouslySetInnerHTML={{ __html: this.props.children }}
      />
    )
  }
}

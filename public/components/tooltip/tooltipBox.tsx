import React from 'react'

interface Props {
  setTopState: () => void
  boxStyles: object
  children: string
}

export default class TooltipBox extends React.Component<Props> {
  tooltipBoxRef: React.RefObject<HTMLInputElement>
  constructor (props: Props) {
    super(props)

    this.tooltipBoxRef = React.createRef()
  }

  componentDidMount () {
    if (this.tooltipBoxRef && this.tooltipBoxRef.current) {
      const tooltipBoxRect = this.tooltipBoxRef.current.getBoundingClientRect()
      const bodyRect = window.document.body.getBoundingClientRect()
      if (tooltipBoxRect.bottom > bodyRect.height) {
        this.props.setTopState()
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

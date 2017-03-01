import React from 'react'

class ColumnResizer extends React.Component {
  componentDidMount () {

  }

  handleMouseDown () {

  }

  handleMouseUp () {

  }

  render () {
    return (
      <vcvhelper className='vce-column-resizer'>
        <div className='vce-column-resizer-handler' onMouseDown={this.handleMouseDown} onMouseUp={this.handleMouseUp} />
      </vcvhelper>
    )
  }
}

export default ColumnResizer

import React from 'react'
// import classNames from 'classnames'

import ContentEditable from './contenteditable'

import './styles.less'

class CustomLayoutInput extends React.Component {
  constructor () {
    super()
    this.state = {
      inputValue: '',
      doGrouping: false
    }
  }

  handleValueChange (e) {
    const inputVal = e.target.value
    this.updateInputValue(inputVal)
  }

  updateInputValue (inputValue) {
    this.setState({inputValue})
  }

  handleGrouping (e) {
    if (e.key === 'Enter') {
      this.changeGroupingState()
    }
  }

  changeGroupingState () {
    this.setState({doGrouping: !this.state.doGrouping})
  }

  render () {
    // let input = ''

    // if (this.state.doGrouping) {
      // input = (
      //   <span className='vcv-ui-layout-tokenized'
      //     onClick={this.changeGroupingState}
      //   >{this.state.inputValue}</span>
      // )
    // }

    // {input}
    // <span className='vcv-ui-layout-input-token'>
    //       <input className="vcv-ui-layout-input"
    //         type='text'
    //         value={this.state.inputValue}
    //         onChange={this.handleValueChange.bind(this)}
    //         onKeyPress={this.handleGrouping.bind(this)} />
    //     </span>

    return (
      <div className='vcv-ui-layout-input-container'>
        <ContentEditable />
      </div>
    )
  }
}

export default CustomLayoutInput

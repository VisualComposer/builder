import React from 'react'
import vcCake from 'vc-cake'
const elementsStorage = vcCake.getStorage('elements')

export default class UndoRedoControl extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      undoDisabled: true,
      redoDisabled: true
    }
  }

  componentWillMount () {
    elementsStorage.state('document').onChange(this.checkControls)
    this.checkControls()
  }

  componentWillUnmount () {
    elementsStorage.state('document').ignoreChange(this.checkControls)
  }

  checkControls = () => {
    this.setState({
      redoDisabled: !elementsStorage.state('redo').get(),
      undoDisabled: !elementsStorage.state('undo').get()
    })
  }

  handleUndo = () => {
    elementsStorage.trigger('undo')
  }

  handleRedo = () => {
    elementsStorage.trigger('redo')
  }

  render () {
    return (
      <div className='vcv-ui-navbar-controls-group vcv-ui-navbar-sandwich--stop-close'>
        <a
          className='vcv-ui-navbar-control' href='#' title='Undo' disabled={this.state.undoDisabled}
          onClick={this.handleUndo}
        ><span
          className='vcv-ui-navbar-control-content'
        ><i
          className='vcv-ui-navbar-control-icon vcv-ui-icon vcv-ui-icon-undo' /><span>Undo</span></span></a>
        <a
          className='vcv-ui-navbar-control' href='#' title='Redo' disabled={this.state.redoDisabled}
          onClick={this.handleRedo}
        ><span
          className='vcv-ui-navbar-control-content'
        ><i
          className='vcv-ui-navbar-control-icon vcv-ui-icon vcv-ui-icon-redo' /><span>Redo</span></span></a>
      </div>
    )
  }
}

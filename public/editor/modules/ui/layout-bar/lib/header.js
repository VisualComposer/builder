import React from 'react'

class BarHeader extends React.Component {
  state = {
    contentComponent: null,
    contentProps: {}
  }

  componentDidMount () {
    this.props.api.addAction('setHeaderContent', (Component, props = {}) => {
      this.setState({
        contentComponent: Component,
        contentProps: props
      })
    })
  }

  render () {
    let content = null
    if (this.state.contentComponent) {
      content = React.createElement(this.state.contentComponent, this.state.contentProps)
    }

    return (
      <div className='vcv-layout-bar-header' id='vcv-editor-header'>
        {content}
      </div>
    )
  }
}
BarHeader.propTypes = {
  api: React.PropTypes.object.isRequired
}

export default BarHeader

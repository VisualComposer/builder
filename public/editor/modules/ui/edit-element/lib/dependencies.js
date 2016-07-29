import React from 'react'
import classNames from 'classnames'

class DependencyManager extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      visible: true
    }
  }

  componentWillMount () {
    let { options } = this.props.data.settings
    if (options && options.dependencyOnChange) {
      this.props.api.reply('element:set', this.onElementChange.bind(this))
      // Call initial Set
    }
  }

  onElementChange (key, value) {
    let { dependencyOnChange } = this.props.data.settings.options
    if (dependencyOnChange[ key ]) {
      // We have something to do!
      // console.log(dependencyOnChange, key, value)
    }
  }

  render () {
    let { visible } = this.state
    let classes = classNames({
      'vcv-ui-form-dependency': true,
      'vcv-ui-state--visible': visible
    })

    let content = ''
    if (visible) {
      content = this.props.content
    }

    return (
      <div className={classes}>
        {content}
      </div>
    )
  }
}
DependencyManager.propTypes = {
  api: React.PropTypes.object.isRequired,
  element: React.PropTypes.object.isRequired,
  content: React.PropTypes.object.isRequired,
  data: React.PropTypes.object.isRequired
}

module.exports = DependencyManager

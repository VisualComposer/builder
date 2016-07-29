import vcCake from 'vc-cake'
import React from 'react'

const cook = vcCake.getService('cook')

class WordPressElement extends React.Component {
  render () {
    const element = cook.get(this.props.element)

    return element.render()
  }
}
WordPressElement.propTypes = {
  element: React.PropTypes.object
}

module.exports = WordPressElement

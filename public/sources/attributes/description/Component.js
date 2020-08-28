import React from 'react'
import Attribute from '../attribute'
import { getStorage } from 'vc-cake'

const workspaceSettings = getStorage('workspace').state('settings')
export default class DescriptionAttribute extends Attribute {
  static defaultProps = {
    fieldType: 'description'
  }
  handleClick (action) {
    if (action && action.workspaceSettings) {
      workspaceSettings.set(action.workspaceSettings)
    }
  }

  parseProps (props) {
    if (props.onClickAction) {
      props.onClick = this.handleClick.bind(this, props.onClickAction)
      delete props.onClickAction
    }
    return props
  }

  getReactContent (content) {
    if (typeof content === 'string') {
      return content
    }
    let returnContent = []
    content.forEach((contentPart) => {
      if (typeof contentPart === 'string') {
        returnContent.push(contentPart)
      } else {
        returnContent.push(React.createElement(contentPart.tag, this.parseProps(contentPart.props), ...this.getReactContent(contentPart.content)))
      }
    })
    return returnContent
  }

  getReactHtml (value) {
    return React.createElement(value.tag, this.parseProps(value.props), ...this.getReactContent(value.content))
  }

  render () {
    const html = typeof this.props.value === 'string' ? this.props.value : this.getReactHtml(this.props.value)
    return <p className='vcv-ui-form-helper'>
      {html}
    </p>
  }
}

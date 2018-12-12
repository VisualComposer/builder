import React from 'react'
import TreeViewItem from './treeViewItem'
import PropTypes from 'prop-types'

export default class TreeViewContainer extends React.Component {
  static propTypes = {
    value: PropTypes.string.isRequired
  }

  constructor (props) {
    super(props)

    this.getContent = this.getContent.bind(this)
  }

  getContent (value, level) {
    const multipleShortcodesRegex = window.wp.shortcode.regexp(window.VCV_API_WPBAKERY_WPB_MAP().join('|'))
    const localShortcodesRegex = new RegExp(multipleShortcodesRegex.source)
    if (value && value.match(multipleShortcodesRegex)) {
      let innerChildsContent = value.match(multipleShortcodesRegex)
      let childsComponents = []
      innerChildsContent.forEach((child, index) => {
        let childData = child.match(localShortcodesRegex)
        let childProps = {
          tag: childData[ 2 ],
          params: childData[ 3 ],
          value: childData[ 5 ],
          level: level,
          getContent: this.getContent,
          key: `wpbakery-edit-form-childs-${level}-${index}`
        }
        childsComponents.push(<TreeViewItem {...childProps} />)
      })
      return (<ul className='vcv-ui-tree-layout'>{childsComponents}</ul>)
    }

    return null
  }

  render () {
    const { value } = this.props

    return (
      <div className='vcv-ui-form-dependency'>
        <div className='vcv-ui-form-group'>
          <span className='vcv-ui-form-group-heading'>
            WPB inner elements
          </span>
          <div className='vcv-ui-form-tree-view--attribute'>
            <div className='vcv-ui-tree-layout-container'>
              {this.getContent(value, 0)}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

import React from 'react'
import PropTypes from 'prop-types'
import { getService } from 'vc-cake'
import { TreeViewContainerConsumer } from './treeViewContainer'

const utils = getService('utils')
const hubCategoriesService = getService('hubCategories')

export default class TreeViewItem extends React.Component {
  static propTypes = {
    tag: PropTypes.string.isRequired,
    shortcode: PropTypes.string.isRequired,
    content: PropTypes.any.isRequired,
    level: PropTypes.number.isRequired,
    editorIndex: PropTypes.string.isRequired
  }

  render () {
    const { tag, content, editorIndex, level, shortcode } = this.props
    const space = 0.8
    const isRTL = utils.isRTL()
    const defaultSpace = isRTL ? 1.5 : 0.5
    const controlPadding = (space * level + defaultSpace) + 'rem'
    const controlStyle = isRTL ? { paddingRight: controlPadding } : { paddingLeft: controlPadding }
    const publicPath = hubCategoriesService.getElementIcon('wpbakeryElement')

    console.log(this.props)

    return (
      <TreeViewContainerConsumer>
        {({ getContent, deleteItem, editItem }) => (
          <li className='vcv-ui-tree-layout-node-child'>
            <div className='vcv-ui-tree-layout-control' style={controlStyle}>
              {this.props.children}
              <div className='vcv-ui-tree-layout-control-content'>
                <i className='vcv-ui-tree-layout-control-icon'>
                  <img src={publicPath} className='vcv-ui-icon' alt='' />
                </i>
                <span className='vcv-ui-tree-layout-control-label'>{tag}</span>
                <div className='vcv-ui-tree-layout-control-actions'>
                  <span className='vcv-ui-tree-layout-control-action' onClick={editItem.bind(this, level, editorIndex, shortcode)}>
                    <i className='vcv-ui-icon vcv-ui-icon-edit' />
                  </span>
                  {editorIndex !== 'root' ? <span className='vcv-ui-tree-layout-control-action' onClick={deleteItem.bind(this, editorIndex)}>
                    <i className='vcv-ui-icon vcv-ui-icon-trash' />
                  </span> : null}
                </div>
              </div>
            </div>
            {getContent(content, level + 1, editorIndex)}
          </li>
        )}
      </TreeViewContainerConsumer>
    )
  }
}

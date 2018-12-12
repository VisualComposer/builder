import React from 'react'
import PropTypes from 'prop-types'
import vcCake from 'vc-cake'

const utils = vcCake.getService('utils')
const hubCategoriesService = vcCake.getService('hubCategories')

export default class TreeViewItem extends React.Component {
  static propTypes = {
    tag: PropTypes.string.isRequired,
    params: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    level: PropTypes.number.isRequired,
    getContent: PropTypes.func.isRequired
  }

  render () {
    let { tag, value, level, getContent } = this.props
    let space = 0.8
    let isRTL = utils.isRTL()
    let defaultSpace = isRTL ? 1.5 : 0.5
    const controlPadding = (space * this.props.level + defaultSpace) + 'rem'
    const controlStyle = isRTL ? { paddingRight: controlPadding } : { paddingLeft: controlPadding }
    const publicPath = hubCategoriesService.getElementIcon('wpbakeryElement')

    return (
      <li className='vcv-ui-tree-layout-node-child'>
        <div className='vcv-ui-tree-layout-control' style={controlStyle}>
          <div className='vcv-ui-tree-layout-control-content'>
            <i className='vcv-ui-tree-layout-control-icon'>
              <img src={publicPath} className='vcv-ui-icon' alt='' />
            </i>
            <span className='vcv-ui-tree-layout-control-label'>{tag}</span>
            <div className='vcv-ui-tree-layout-control-actions'>
              <span className='vcv-ui-tree-layout-control-action'>
                <i className='vcv-ui-icon vcv-ui-icon-edit' />
              </span>
              <span className='vcv-ui-tree-layout-control-action'>
                <i className='vcv-ui-icon vcv-ui-icon-trash' />
              </span>
            </div>
          </div>
        </div>
        {getContent(value, level + 1)}
      </li>
    )
  }
}

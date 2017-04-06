import React from 'react'
import vcCake from 'vc-cake'
import classNames from 'classnames'

const sharedAssetsLibraryService = vcCake.getService('sharedAssetsLibrary')

export default class RowControl extends React.Component {
  static propTypes = {
    hideIcon: React.PropTypes.bool.isRequired
  }

  render () {
    let imageClasses = classNames({
      'vcv-ui-blank-row-element-control-icon': true,
      'vcv-is-hidden': this.props.hideIcon
    })

    return <span
      className='vcv-ui-blank-row-element-control'
     >
      <img
        className={imageClasses}
        src={sharedAssetsLibraryService.getSourcePath('images/blankRowPlaceholderIcons/addElement.svg')}
        alt='Add Element'
      />
      <span className='vcv-ui-blank-row-element-control-label'>Add Element</span>
    </span>
  }
}

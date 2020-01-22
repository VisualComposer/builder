import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import addElementIcon from 'public/sources/images/blankRowPlaceholderIcons/addElement.raw'

export default class RowControl extends React.Component {
  static propTypes = {
    hideIcon: PropTypes.bool.isRequired
  }

  static localizations = window.VCV_I18N && window.VCV_I18N()

  render () {
    const svgClasses = classNames({
      'vcv-ui-blank-row-element-control-icon': true,
      'vcv-is-hidden': this.props.hideIcon
    })

    return <span className='vcv-ui-blank-row-element-control'>
      <span
        className={svgClasses}
        dangerouslySetInnerHTML={{ __html: addElementIcon }}
        alt={RowControl.localizations ? RowControl.localizations.addElement : 'Add Element'}
      />
      <span className='vcv-ui-blank-row-element-control-label'>Add Element</span>
    </span>
  }
}

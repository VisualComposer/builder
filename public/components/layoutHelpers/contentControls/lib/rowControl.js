import React from 'react'
import classNames from 'classnames'
import addElementIcon from 'public/sources/images/blankRowPlaceholderIcons/addElement.raw'

export default class RowControl extends React.Component {
  static localizations = window.VCV_I18N && window.VCV_I18N()

  render () {
    const svgClasses = classNames({
      'vcv-ui-blank-row-element-control-icon': true
    })

    return (
      <span className='vcv-ui-blank-row-element-control'>
        <span
          className={svgClasses}
          dangerouslySetInnerHTML={{ __html: addElementIcon }}
          title={RowControl.localizations ? RowControl.localizations.addElement : 'Add Element'}
        />
        <span className='vcv-ui-blank-row-element-control-label'>Add Element</span>
      </span>
    )
  }
}

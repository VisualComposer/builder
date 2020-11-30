import React from 'react'
import vcCake from 'vc-cake'
import classNames from 'classnames'
import addElementIcon from 'public/sources/images/blankRowPlaceholderIcons/addElement.raw'

const dataManager = vcCake.getService('dataManager')

export default class RowControl extends React.Component {
  static localizations = dataManager.get('localizations')

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

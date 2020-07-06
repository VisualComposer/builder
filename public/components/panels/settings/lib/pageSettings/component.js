import React from 'react'
import PageSettingsTitle from 'public/sources/attributes/pageSettingsTitle/Component'
import PageSettingsLayouts from 'public/sources/attributes/pageSettingsLayouts/Component'
import Permalink from 'public/components/permalink/permalink'

export default class PageSettings extends React.Component {
  render () {
    const content = []
    content.push(
      <PageSettingsTitle
        key={content.length}
        fieldKey='pageSettingsTitle'
        updater={() => {}} // required for attributes
        value='' // required for attributes
      />
    )

    if (typeof window.VCV_EDITOR_TYPE === 'undefined') {
      content.push(
        <div className='vcv-ui-form-group vcv-ui-form-group-style--inline vcv-ui-form-group--permalink' key={content.length}>
          <Permalink />
        </div>
      )
    }

    content.push(
      <PageSettingsLayouts
        key={`layouts-${content.length}`}
        fieldKey='pageSettingsLayouts'
        updater={() => {}} // required for attributes
        value='' // required for attributes
      />
    )

    return (
      <>
        {content}
      </>
    )
  }
}

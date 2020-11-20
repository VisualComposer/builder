import React from 'react'
import PageSettingsTitle from 'public/sources/attributes/pageSettingsTitle/Component'
import PageSettingsLayouts from 'public/sources/attributes/pageSettingsLayouts/Component'
import Permalink from 'public/components/permalink/permalink'
import ParentPage from '../parentPage/component'
import Excerpt from '../excerpt/component'
import Discussion from '../discussion/component'
import Author from '../author/component'
import { getService } from 'vc-cake'

const dataManager = getService('dataManager')
const localizations = dataManager.get('localizations')
const menuText = localizations ? localizations.menu : 'Menu'
const manageYourSiteMenu = localizations ? localizations.manageYourSiteMenu : 'Manage your site menus'
const viaWPAdminMenu = localizations ? localizations.viaWPAdminMenu : 'in the WordPress dashboard.'

export default class PageSettings extends React.Component {
  render () {
    const content = []
    const wordpressSettings = []
    content.push(
      <PageSettingsTitle
        key={content.length}
        fieldKey='pageSettingsTitle'
        updater={() => {}} // required for attributes
        value='' // required for attributes
      />
    )

    if (dataManager.get('editorType') === 'default') {
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

    if (dataManager.get('pageList')) {
      wordpressSettings.push(
        <ParentPage
          key='parentPage'
        />
      )
    }

    if (typeof dataManager.get('excerpt') !== 'undefined') {
      wordpressSettings.push(
        <Excerpt
          key='excerpt'
        />
      )
    }

    if (dataManager.get('authorList')) {
      wordpressSettings.push(
        <Author
          key='author'
        />
      )
    }

    if (dataManager.get('commentStatus') || dataManager.get('pingStatus')) {
      wordpressSettings.push(
        <Discussion
          key='discussion'
        />
      )
    }

    return (
      <>
        {content}
        <div className='vcv-ui-form-group vcv-ui-form-group--wp-menu'>
          <span className='vcv-ui-form-group-heading'>{menuText}</span>
          <p className='vcv-ui-form-helper'>
            <a className='vcv-ui-form-link' href={dataManager.get('manageMenuUrl')} target='_blank' rel='noopener noreferrer'>{manageYourSiteMenu}</a> {viaWPAdminMenu}
          </p>
        </div>
        {wordpressSettings}
      </>
    )
  }
}

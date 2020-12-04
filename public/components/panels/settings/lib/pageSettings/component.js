import React from 'react'
import PageSettingsTitle from 'public/sources/attributes/pageSettingsTitle/Component'
import PageSettingsLayouts from 'public/sources/attributes/pageSettingsLayouts/Component'
import Permalink from 'public/components/permalink/permalink'
import ParentPage from '../parentPage/component'
import Excerpt from '../excerpt/component'
import Discussion from '../discussion/component'
import Author from '../author/component'
import FeaturedImage from '../featuredImage/component'
import Tags from '../postTags/component'
import { getService } from 'vc-cake'
import AccordionPanel from '../../accordionPanel'

const dataManager = getService('dataManager')
const localizations = dataManager.get('localizations')
const menuText = localizations ? localizations.menu : 'Menu'
const manageYourSiteMenu = localizations ? localizations.manageYourSiteMenu : 'Manage your site menus'
const viaWPAdminMenu = localizations ? localizations.viaWPAdminMenu : 'in the WordPress dashboard.'
const generalText = localizations ? localizations.general : 'General'

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

    content.push(
      <div className='vcv-ui-form-group vcv-ui-form-group--wp-menu' key={content.length}>
        <span className='vcv-ui-form-group-heading'>{menuText}</span>
        <p className='vcv-ui-form-helper'>
          <a className='vcv-ui-form-link' href={dataManager.get('manageMenuUrl')} target='_blank' rel='noopener noreferrer'>{manageYourSiteMenu}</a> {viaWPAdminMenu}
        </p>
      </div>
    )

    if (dataManager.get('pageList')) {
      content.push(
        <ParentPage
          key='parentPage'
        />
      )
    }

    if (dataManager.get('tags')) {
      const tagsText = localizations ? localizations.tags : 'Tags'
      const tagsDescription = localizations ? localizations.manageTagsAssociatedWithThePost : 'Manage tags associated with the post.'
      wordpressSettings.push(
        <AccordionPanel
          key='tags'
          sectionTitle={tagsText}
          tooltipText={tagsDescription}
        >
          <Tags />
        </AccordionPanel>
      )
    }

    if (dataManager.get('featuredImage')) {
      const featuredImage = localizations ? localizations.featuredImage : 'Featured Image'
      wordpressSettings.push(
        <AccordionPanel
          key='featuredImage'
          sectionTitle={featuredImage}
        >
          <FeaturedImage />
        </AccordionPanel>
      )
    }

    if (typeof dataManager.get('excerpt') !== 'undefined') {
      const settingName = localizations ? localizations.excerpt : 'Excerpt'
      wordpressSettings.push(
        <AccordionPanel
          key='excerpt'
          sectionTitle={settingName}
        >
          <Excerpt />
        </AccordionPanel>
      )
    }

    if (dataManager.get('authorList')) {
      const authorTitle = localizations ? localizations.author : 'Author'
      wordpressSettings.push(
        <AccordionPanel
          key='author'
          sectionTitle={authorTitle}
        >
          <Author />
        </AccordionPanel>
      )
    }

    if (dataManager.get('commentStatus') || dataManager.get('pingStatus')) {
      const settingName = localizations ? localizations.discussion : 'Discussion'
      wordpressSettings.push(
        <AccordionPanel
          key='discussion'
          sectionTitle={settingName}
        >
          <Discussion />
        </AccordionPanel>
      )
    }

    return (
      <>
        <AccordionPanel
          sectionTitle={generalText}
          key='settingsGeneral'
        >
          {content}
        </AccordionPanel>
        {wordpressSettings}
      </>
    )
  }
}

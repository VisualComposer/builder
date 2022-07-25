import React, { useRef } from 'react'
import { getService } from 'vc-cake'
// @ts-ignore
import AccordionPanel from 'public/components/uiHelpers/accordionPanel/accordionPanel'
// @ts-ignore
import Permalink from 'public/components/permalink/permalink'
// @ts-ignore
import ParentPage from 'public/components/panels/settings/lib/parentPage/component'
// @ts-ignore
import FeaturedImage from 'public/components/panels/settings/lib/featuredImage/component'
// @ts-ignore
import Categories from 'public/components/panels/settings/lib/categories/component'
// @ts-ignore
import Tags from 'public/components/panels/settings/lib/postTags/component'
// @ts-ignore
import Excerpt from 'public/components/panels/settings/lib/excerpt/component'
// @ts-ignore
import Discussion from 'public/components/panels/settings/lib/discussion/component'
// @ts-ignore
import Author from 'public/components/panels/settings/lib/author/component'
// @ts-ignore
import Scrollbar from 'public/components/scrollbar/scrollbar'

const dataManager = getService('dataManager')
const localizations = dataManager.get('localizations')

interface Props {
  toggleSettings: () => void
}

const Sidebar: React.FC<Props> = ({ toggleSettings }) => {
  const scrollbarsRef = useRef(null)
  const postSettings:React.ReactElement[] = []
  const closeButtonText = localizations.close || 'Close'
  const url = new URL(window.location.href)
  const postOptionsText = url.searchParams.get('post_type') === 'page' ? localizations.pageSettings || 'Page Options' : localizations.postOptions || 'Post Options'

  if (dataManager.get('editorType') === 'default') {
    const generalText = localizations.general || 'General'

    const parentPage = dataManager.get('pageList') ? <ParentPage /> : null
    postSettings.push(
      <AccordionPanel
        key='general'
        sectionTitle={generalText}
        isChevron={true}
        classes='general-section'
        isExpanded={true}
      >
        <Permalink />
        {parentPage}
      </AccordionPanel>
    )
  }

  if (dataManager.get('featuredImage')) {
    const featuredImage = localizations.featuredImage || 'Featured Image'
    postSettings.push(
      <AccordionPanel
        key='featuredImage'
        sectionTitle={featuredImage}
        isChevron={true}
        classes='featured-image-section'
        isExpanded={false}
      >
        <FeaturedImage />
      </AccordionPanel>
    )
  }

  if (dataManager.get('categories')) {
    const categoriesTitle = localizations.categories || 'Categories'
    const categoriesDescription = localizations.categoriesDescription || 'Manage post categories or add a new category.'

    postSettings.push(
      <AccordionPanel
        key='categories'
        sectionTitle={categoriesTitle}
        tooltipText={categoriesDescription}
        isChevron={true}
        classes='categories-section'
        isExpanded={false}
      >
        <Categories />
      </AccordionPanel>
    )
  }

  if (dataManager.get('tags')) {
    const tagsText = localizations.tags || 'Tags'
    const tagsDescription = localizations.manageTagsAssociatedWithThePost || 'Manage tags associated with the post.'
    postSettings.push(
      <AccordionPanel
        key='tags'
        sectionTitle={tagsText}
        tooltipText={tagsDescription}
        isChevron={true}
        classes='tags-section'
        isExpanded={false}
      >
        <Tags />
      </AccordionPanel>
    )
  }

  if (typeof dataManager.get('excerpt') !== 'undefined') {
    const settingName = localizations.excerpt || 'Excerpt'
    const excerptsAreOptional = localizations.excerptsAreOptional || 'Excerpts are optional hand-crafted summaries of your content.'

    postSettings.push(
      <AccordionPanel
        key='excerpt'
        sectionTitle={settingName}
        tooltipText={excerptsAreOptional}
        isChevron={true}
        classes='excerpt-section'
        isExpanded={false}
      >
        <Excerpt />
      </AccordionPanel>
    )
  }

  if (dataManager.get('commentStatus') || dataManager.get('pingStatus')) {
    const settingName = localizations.discussion || 'Discussion'
    postSettings.push(
      <AccordionPanel
        key='discussion'
        sectionTitle={settingName}
        isChevron={true}
        classes='discussion-section'
        isExpanded={false}
      >
        <Discussion />
      </AccordionPanel>
    )
  }

  if (dataManager.get('authorList')) {
    const authorTitle = localizations.author || 'Author'
    postSettings.push(
      <AccordionPanel
        key='author'
        sectionTitle={authorTitle}
        isChevron={true}
        classes='author-section'
        isExpanded={false}
      >
        <Author />
      </AccordionPanel>
    )
  }

  return (
    <aside className='blank-page-settings'>
      <header className='blank-page-settings-header'>
        <i className='vcv-ui-icon vcv-ui-icon-cog' />
        <span className='blank-page-settings-title'>{postOptionsText}</span>
        <button
          className='blank-button vcv-ui-icon vcv-ui-icon-close-thin'
          aria-label={closeButtonText}
          title={closeButtonText}
          type='button'
          onClick={toggleSettings}
        />
      </header>
      <Scrollbar ref={scrollbarsRef}>
        {postSettings}
      </Scrollbar>
    </aside>
  )
}

export default Sidebar

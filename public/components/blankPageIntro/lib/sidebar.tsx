import React from 'react'
import { getService } from 'vc-cake'
// @ts-ignore
import AccordionPanel from 'public/components/uiHelpers/accordionPanel/accordionPanel'
// @ts-ignore
import Permalink from 'public/components/permalink/permalink'
import ParentPage from "../../panels/settings/lib/parentPage/component";
import FeaturedImage from "../../panels/settings/lib/featuredImage/component";

const dataManager = getService('dataManager')
const localizations = dataManager.get('localizations')

interface Props {
  toggleSettings: any
}

const Sidebar: React.FC<Props> = ({toggleSettings}) => {
  const postSettings:any = []
  const closeButtonText:string = localizations.close || 'Close'

  if (dataManager.get('editorType') === 'default') {
    const generalText = localizations.general || 'General'

    postSettings.push(
      <AccordionPanel
        key='general'
        sectionTitle={generalText}
        isChevron={true}
      >
        <Permalink />
        <ParentPage />
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
      >
        <FeaturedImage />
      </AccordionPanel>
    )
  }

  return (
    <aside className='blank-page-settings'>
      <header className='blank-page-settings-header'>
        <i className='vcv-ui-icon vcv-ui-icon-cog' />
        <span className='blank-page-settings-title'>Post Options</span>
        <button
            className='blank-button vcv-ui-icon vcv-ui-icon-close-thin'
            aria-label={closeButtonText}
            title={closeButtonText}
            type='button'
            onClick={toggleSettings}
        />
      </header>
      {postSettings}
    </aside>
  )
}

export default Sidebar
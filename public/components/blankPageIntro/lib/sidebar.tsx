import React from 'react'
// @ts-ignore
import Tooltip from 'public/components/tooltip/tooltip'
// @ts-ignore
import PageSettings from 'public/components/panels/settings/lib/pageSettings/component'
// @ts-ignore
import AccordionPanel from 'public/components/uiHelpers/accordionPanel/accordionPanel'

interface Props {
  toggleSettings: any
}

const Sidebar: React.FC<Props> = ({toggleSettings}) => {
    const toggleSection = () => {
        console.log('toggleSection')
    }
    return (
        <aside className='blank-page-settings'>
            <header className='blank-page-settings-header'>
                <i className='vcv-ui-icon vcv-ui-icon-cog' />
                <span>Post Options</span>
                <button className='vcv-ui-icon vcv-ui-icon-close-thin' aria-label='Close' title='Close' type='button' onClick={toggleSettings} />
            </header>
        </aside>
    )
}

export default Sidebar
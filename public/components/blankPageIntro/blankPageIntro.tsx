import React, { useRef, useState, useEffect } from 'react'
import classNames from 'classnames'
import { getStorage } from 'vc-cake'
import Sidebar from './lib/sidebar'
// @ts-ignore
import Tooltip from 'public/components/tooltip/tooltip'
// @ts-ignore
import PageSettingsTitle from 'public/sources/attributes/pageSettingsTitle/Component'

const workspaceStorage = getStorage('workspace')

interface Props {
  unmountBlankPage: any
}

const BlankPageIntro:React.FC<Props> = ({ unmountBlankPage }) => {
    const [isSidebarOpened, setIsSidebarOpened] = useState(false)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const settings = {
            action: 'add',
            element: {},
            tag: '',
            options: {}
        }
        workspaceStorage.state('settings').set(settings)
        unmountBlankPage()
    }

    const toggleSettings = () => {
        setIsSidebarOpened(!isSidebarOpened)
    }

    const handleTitleChange = () => {
        console.log('change Title')
    }
    const pageTitle = 'Page Title ...'
    const blankPageClasses = classNames({
        'blank-page-container': true,
        'blank-page-settings--active': isSidebarOpened
    })
    return (
        <div className={blankPageClasses}>
            <Sidebar toggleSettings={toggleSettings} />
            <form onSubmit={handleSubmit} className='blank-page-form'>
                <div className='blank-page-input-container'>
                    <PageSettingsTitle
                        key='pageSettingsTitle'
                        fieldKey='pageSettingsTitle'
                        updater={() => {}} // required for attributes
                        value='' // required for attributes
                    />
                    <button
                        className='blank-button settings-btn vcv-ui-icon vcv-ui-icon-cog'
                        aria-label='Post Options'
                        title='Post Options'
                        type='button'
                        onClick={toggleSettings}
                    />
                </div>
                <div className='template-groups-container'>
                    <div className='template-group'>
                        <div className='template-group-label-container'>
                            <div className='template-group-label'>
                                Layout
                                <Tooltip>Hello world</Tooltip>
                            </div>
                            <button className='blank-button vcv-ui-icon vcv-ui-icon-chevron-thick' type='button' aria-label='Toggle section' title='Toggle section' />
                        </div>
                        <div className='template-items'>
                            <div className='template-item'>
                                <div className='template-thumbnail' />
                                <div className='template-info'>
                                    <span className='template-label'>Default layout</span>
                                    <Tooltip />
                                </div>
                            </div>
                            <div className='template-item'>
                                <div className='template-thumbnail' />
                                <div className='template-info'>
                                    <span className='template-label'>Blank page</span>
                                    <Tooltip />
                                </div>
                            </div>
                            <div className='template-item'>
                                <div className='template-thumbnail' />
                                <div className='template-info'>
                                    <span className='template-label'>Custom layout</span>
                                    <select>
                                        <option value='Select a layout'>Select a layout</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='template-group'>
                        <div className='template-group-label'>
                            <div>
                                <span className='template-group-label'>Content</span>
                                <Tooltip>Hello world</Tooltip>
                            </div>
                            <button>toggle</button>
                        </div>
                        <div className='template-items'>
                            <div>item 1.2</div>
                            <div>item 2.2</div>
                            <div>item 3.2</div>
                        </div>
                    </div>
                </div>
                <button className='blank-button blank-page-submit-button' type='submit'>GET STARTED</button>
            </form>
        </div>
    )
}

export default BlankPageIntro
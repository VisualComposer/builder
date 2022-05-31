import { getService } from 'vc-cake'

const dataManager = getService('dataManager')
const localizations = dataManager.get('localizations')

const LayoutsData = {
    'layout': [
        {
            type: 'vc-custom-layout',
            value: 'default',
            icon: require('./defaultIcon'),
            label: localizations.defaultLayout || 'Default layout',
            control: 'button',
            description: localizations.defaultLayoutDescription || 'The theme default layout.'
        },
        {
            type: 'vc',
            value: 'blank',
            icon: require('./blankIcon'),
            label: localizations.blankPageNonCapitalized || 'Blank page',
            control: 'button',
            description: localizations.blankLayoutDescription || 'A layout without a header, footer and sidebar.'
        },
        {
            type: 'vc-theme',
            value: 'custom',
            icon: require('./customIcon'),
            label: localizations.customLayout || 'Custom layout',
            control: 'dropdown',
            contentType: 'premium'
        }
    ],
    'content': [
        {
            type: 'noContent',
            label: localizations.noContent || 'No content',
            control: 'button',
            description: localizations.noContentDescription || 'The blank content template.'
        },
        {
            type: 'myTemplate',
            icon: require('./myTemplateIcon'),
            label: localizations.myTemplate || 'My template',
            control: 'dropdown'
        }
    ],
    'popup': [
        {
            type: 'blankPopup',
            label: localizations.blankPopup || 'Blank popup',
            icon: require('./popupIcon'),
            control: 'button'
        },
        {
            type: 'popupTemplate',
            icon: require('./customIcon'),
            label: localizations.popupTemplate || 'Popup template',
            control: 'dropdown'
        }
    ]
}

export default LayoutsData

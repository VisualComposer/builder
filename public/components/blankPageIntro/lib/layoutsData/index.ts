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
            control: 'button'
        },
        {
            type: 'vc',
            value: 'blank',
            icon: require('./blankIcon'),
            label: localizations.blankPageNonCapitalized || 'Blank page',
            control: 'button'
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
            control: 'button'
        },
        {
            type: 'myTemplate',
            icon: require('./myTemplateIcon'),
            label: localizations.myTemplate || 'My template',
            control: 'dropdown'
        }
    ]
}

export default LayoutsData

import { getService } from 'vc-cake'

const dataManager = getService('dataManager')
const localizations = dataManager.get('localizations')

const LayoutsData = {
    'layout': [
        {
            type: 'default',
            icon: require('./defaultIcon'),
            label: localizations.defaultLayout || 'Default layout'
        },
        {
            type: 'blank',
            icon: require('./blankIcon'),
            label: localizations.blankPageNonCapitalized || 'Blank page'
        },
        {
            type: 'custom',
            icon: require('./customIcon'),
            label: localizations.customLayout || 'Custom layout'
        }
    ],
    'content': [
        {
            type: 'noContent',
            label: localizations.noContent || 'No content'
        },
        {
            type: 'myTemplate',
            icon: require('./myTemplateIcon'),
            label: localizations.myTemplate || 'My template'
        }
    ]
}

export default LayoutsData

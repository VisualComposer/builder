## Settings

All settings are stored in settings.js file. Default settings are collected with bundle collection command.
All settings in JSON format.

Settings template:
{
    name: '{name}',
    type: '{string|array|object}',
    access: '{public|private|protected|system}',
    value: {value depending on type},
    options: {
        customSettings: {customSettingsValue},
        ...
    }
}
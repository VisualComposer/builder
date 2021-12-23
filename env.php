<?php

$source = 'vcwb';
if (defined('VCV_AUTHOR_API_KEY')) {
    $source = 'theme-author-vcwb';
}

if (!VcvEnv::has('VCV_ENV_HUB_DOWNLOAD')) {
    VcvEnv::set('VCV_ENV_HUB_DOWNLOAD', true);
}

if (!VcvEnv::has('VCV_ENV_EXTENSION_DOWNLOAD')) {
    VcvEnv::set('VCV_ENV_EXTENSION_DOWNLOAD', true);
}

if (!VcvEnv::has('VCV_HUB_URL')) {
    VcvEnv::set(
        'VCV_HUB_URL',
        'https://my.visualcomposer.com'
    );
}

if (!VcvEnv::has('VCV_HUB_PUBLIC_URL')) {
    VcvEnv::set(
        'VCV_HUB_PUBLIC_URL',
        'https://my.visualcomposer.com'
    );
}

if (!VcvEnv::has('VCV_HUB_LICENSES_URL')) {
    VcvEnv::set(
        'VCV_HUB_LICENSES_URL',
        'https://my.visualcomposer.com/licenses/?utm_source=' . $source . '&utm_medium=license-vcdashboard&utm_campaign=upgrade&utm_content=text'
    );
}

if (!VcvEnv::has('VCV_TOKEN_URL')) {
    VcvEnv::set(
        'VCV_TOKEN_URL',
        'https://my.visualcomposer.com/authorization-token'
    );
}

if (!VcvEnv::has('VCV_THEME_TOKEN_URL')) {
    VcvEnv::set(
        'VCV_THEME_TOKEN_URL',
        'https://my.visualcomposer.com/theme-authorization-token'
    );
}

if (!VcvEnv::has('VCV_API_URL')) {
    VcvEnv::set('VCV_API_URL', 'https://api.visualcomposer.com');
}

if (!VcvEnv::has('VCV_ACTIVATE_LICENSE_URL')) {
    VcvEnv::set(
        'VCV_ACTIVATE_LICENSE_URL',
        'https://my.visualcomposer.com/?edd_action=activate_license&item_name=Visual%20Composer'
    );
}

if (!VcvEnv::has('VCV_DEBUG')) {
    VcvEnv::set('VCV_DEBUG', defined('VCV_DEBUG') ? constant('VCV_DEBUG') : false);
}

if (!VcvEnv::has('VCV_FIX_CURL_JSON_DOWNLOAD')) {
    // Disabled temporary
    VcvEnv::set('VCV_FIX_CURL_JSON_DOWNLOAD', false);
}

if (!VcvEnv::has('VCV_TF_ASSETS_URLS_FACTORY_RESET')) {
    VcvEnv::set('VCV_TF_ASSETS_URLS_FACTORY_RESET', true);
}

// Disabled until all php elements updated
if (!VcvEnv::has('VCV_ENV_ELEMENTS_FILES_NOGLOB')) {
    VcvEnv::set('VCV_ENV_ELEMENTS_FILES_NOGLOB', false);
}

if (!VcvEnv::has('VCV_TF_BLANK_PAGE_BOXED')) {
    VcvEnv::set('VCV_TF_BLANK_PAGE_BOXED', true);
}

if (!VcvEnv::has('VCV_FT_INITIAL_CSS_LOAD')) {
    VcvEnv::set('VCV_FT_INITIAL_CSS_LOAD', true);
}

if (!VcvEnv::has('VCV_TF_CSS_CHECKSUM')) {
    VcvEnv::set('VCV_TF_CSS_CHECKSUM', true);
}

if (!VcvEnv::has('VCV_FT_TEMPLATE_DATA_ASYNC')) {
    VcvEnv::set('VCV_FT_TEMPLATE_DATA_ASYNC', true);
}

if (!VcvEnv::has('VCV_FT_ASSETS_INSIDE_PLUGIN')) {
    VcvEnv::set('VCV_FT_ASSETS_INSIDE_PLUGIN', true);
}

if (!VcvEnv::has('VCV_FT_DEFAULT_ELEMENTS_INSIDE_PLUGIN')) {
    VcvEnv::set('VCV_FT_DEFAULT_ELEMENTS_INSIDE_PLUGIN', true);
}

if (!VcvEnv::has('VCV_ENV_FT_SYSTEM_CHECK_LIST')) {
    VcvEnv::set('VCV_ENV_FT_SYSTEM_CHECK_LIST', true);
}

if (!VcvEnv::has('VCV_ENV_FT_GLOBAL_CSS_JS_SETTINGS')) {
    VcvEnv::set('VCV_ENV_FT_GLOBAL_CSS_JS_SETTINGS', true);
}

if (!VcvEnv::has('VCV_JS_THEME_LAYOUTS')) {
    VcvEnv::set('VCV_JS_THEME_LAYOUTS', false); // SEE the devAddons/themeEditor/themeEditor/src/*.js files
}

if (!VcvEnv::has('VCV_POPUP_BUILDER')) {
    VcvEnv::set('VCV_POPUP_BUILDER', false);
}

if (!VcvEnv::has('VCV_JS_THEME_EDITOR')) {
    VcvEnv::set('VCV_JS_THEME_EDITOR', false); // SEE the devAddons/themeEditor/themeEditor/src/*.js files
}

if (!VcvEnv::has('VCV_JS_SAVE_ZIP')) {
    VcvEnv::set('VCV_JS_SAVE_ZIP', true);
}

if (!VcvEnv::has('VCV_JS_FT_ROW_COLUMN_LOGIC_REFACTOR')) {
    VcvEnv::set('VCV_JS_FT_ROW_COLUMN_LOGIC_REFACTOR', false);
}

if (!VcvEnv::has('VCV_JS_FT_DYNAMIC_FIELDS')) {
    VcvEnv::set('VCV_JS_FT_DYNAMIC_FIELDS', false); // Must be false! SEE the devAddons/dynamicFields/ env files
}

if (!VcvEnv::has('VCV_ACCOUNT_URL')) {
    VcvEnv::set('VCV_ACCOUNT_URL', 'https://account.visualcomposer.io');
}

if (!VcvEnv::has('VCV_SUPPORT_URL')) {
    VcvEnv::set(
        'VCV_SUPPORT_URL',
        'https://my.visualcomposer.com/support/?utm_source=' . $source . '&utm_medium=error-screen&utm_campaign=support&utm_content=button'
    );
}

if (!VcvEnv::has('VCV_FT_INSIGHTS')) {
    VcvEnv::set('VCV_FT_INSIGHTS', true);
}

if (!VcvEnv::has('VCV_FT_DYNAMIC_ARCHIVE_FIELDS')) {
    VcvEnv::set('VCV_FT_DYNAMIC_ARCHIVE_FIELDS', true);
}

if (!VcvEnv::has('VCV_FT_UPDATE_NOTIFICATION') && !VcvEnv::has('VCV_DEBUG')) {
    VcvEnv::set('VCV_FT_UPDATE_NOTIFICATION', true);
}

if (!VcvEnv::has('VCV_FT_THEME_BUILDER_LAYOUTS')) {
    VcvEnv::set('VCV_FT_THEME_BUILDER_LAYOUTS', true);
}

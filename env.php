<?php

if (!defined('VCV_ENV_ADDONS_ID')) {
    define(
        'VCV_ENV_ADDONS_ID',
        isset($_SERVER['ENV_VCV_ENV_ADDONS_ID']) ? $_SERVER['ENV_VCV_ENV_ADDONS_ID'] : 'account'
    );
}
if (!defined('VCV_ENV_HUB_DOWNLOAD')) {
    define(
        'VCV_ENV_HUB_DOWNLOAD',
        isset($_SERVER['ENV_VCV_ENV_HUB_DOWNLOAD']) ? $_SERVER['ENV_VCV_ENV_HUB_DOWNLOAD'] : true
    );
}
if (!defined('VCV_ENV_TEMPLATES_DOWNLOAD')) {
    define(
        'VCV_ENV_TEMPLATES_DOWNLOAD',
        isset($_SERVER['ENV_VCV_ENV_TEMPLATES_DOWNLOAD']) ? $_SERVER['ENV_VCV_ENV_TEMPLATES_DOWNLOAD'] : true
    );
}
if (!defined('VCV_ENV_ELEMENT_DOWNLOAD')) {
    define(
        'VCV_ENV_ELEMENT_DOWNLOAD',
        isset($_SERVER['ENV_VCV_ENV_ELEMENT_DOWNLOAD']) ? $_SERVER['ENV_VCV_ENV_ELEMENT_DOWNLOAD'] : true
    );
}
if (!defined('VCV_ENV_ELEMENT_DOWNLOAD_V')) {
    define(
        'VCV_ENV_ELEMENT_DOWNLOAD_V',
        isset($_SERVER['ENV_VCV_ENV_ELEMENT_DOWNLOAD_V']) ? $_SERVER['ENV_VCV_ENV_ELEMENT_DOWNLOAD_V'] : '2'
    );
}
if (!defined('VCV_ENV_EXTENSION_DOWNLOAD')) {
    define(
        'VCV_ENV_EXTENSION_DOWNLOAD',
        isset($_SERVER['ENV_VCV_ENV_EXTENSION_DOWNLOAD']) ? $_SERVER['ENV_VCV_ENV_EXTENSION_DOWNLOAD'] : true
    );
}
if (!defined('VCV_ACCOUNT_URL')) {
    define(
        'VCV_ACCOUNT_URL',
        isset($_SERVER['ENV_VCV_ACCOUNT_URL']) ? $_SERVER['ENV_VCV_ACCOUNT_URL']
            : 'https://account.visualcomposer.io'
    );
}
if (!defined('VCV_HUB_URL')) {
    define(
        'VCV_HUB_URL',
        isset($_SERVER['ENV_VCV_HUB_URL']) ? $_SERVER['ENV_VCV_HUB_URL'] : 'https://account.visualcomposer.io'
    );
}
if (!defined('VCV_TOKEN_URL')) {
    define(
        'VCV_TOKEN_URL',
        isset($_SERVER['ENV_VCV_TOKEN_URL']) ? $_SERVER['ENV_VCV_TOKEN_URL']
            : 'https://account.visualcomposer.io/authorization-token'
    );
}

if (!defined('VCV_API_URL')) {
    define(
        'VCV_API_URL',
        isset($_SERVER['ENV_VCV_API_URL']) ? $_SERVER['ENV_VCV_API_URL']
            : 'https://account.visualcomposer.io'
    );
}

if (!defined('VCV_LICENSE_ACTIVATE_URL')) {
    define(
        'VCV_LICENSE_ACTIVATE_URL',
        isset($_SERVER['ENV_VCV_LICENSE_ACTIVATE_URL']) ? $_SERVER['ENV_VCV_LICENSE_ACTIVATE_URL']
            : 'https://account.visualcomposer.io/activate-license'
    );
}

if (!defined('VCV_LICENSE_DEACTIVATE_URL')) {
    define(
        'VCV_LICENSE_DEACTIVATE_URL',
        isset($_SERVER['ENV_VCV_LICENSE_DEACTIVATE_URL']) ? $_SERVER['ENV_VCV_LICENSE_DEACTIVATE_URL']
            : 'https://account.visualcomposer.io/deactivate-license'
    );
}

if (!defined('VCV_LICENSE_ACTIVATE_FINISH_URL')) {
    define(
        'VCV_LICENSE_ACTIVATE_FINISH_URL',
        isset($_SERVER['ENV_VCV_LICENSE_ACTIVATE_FINISH_URL']) ? $_SERVER['ENV_VCV_LICENSE_ACTIVATE_FINISH_URL']
            : 'https://account.visualcomposer.io/finish-license-activation'
    );
}

if (!defined('VCV_LICENSE_DEACTIVATE_FINISH_URL')) {
    define(
        'VCV_LICENSE_DEACTIVATE_FINISH_URL',
        isset($_SERVER['ENV_VCV_LICENSE_DEACTIVATE_FINISH_URL']) ? $_SERVER['ENV_VCV_LICENSE_DEACTIVATE_FINISH_URL']
            : 'https://account.visualcomposer.io/finish-license-deactivation'
    );
}

if (!defined('VCV_ENV_LICENSES')) {
    define(
        'VCV_ENV_LICENSES',
        isset($_SERVER['ENV_VCV_ENV_LICENSES']) ? $_SERVER['ENV_VCV_ENV_LICENSES'] : true
    );
}

if (!defined('VCV_ENV_HUB_TEASER')) {
    define(
        'VCV_ENV_HUB_TEASER',
        isset($_SERVER['ENV_VCV_ENV_HUB_TEASER']) ? $_SERVER['ENV_VCV_ENV_HUB_TEASER'] : true
    );
}

if (!defined('VCV_ENV_HUB_TEMPLATES_TEASER')) {
    define(
        'VCV_ENV_HUB_TEMPLATES_TEASER',
        isset($_SERVER['ENV_VCV_ENV_HUB_TEMPLATES_TEASER']) ? $_SERVER['ENV_VCV_ENV_HUB_TEMPLATES_TEASER'] : true
    );
}

if (!defined('VCV_ENV_UPGRADE')) {
    define(
        'VCV_ENV_UPGRADE',
        isset($_SERVER['ENV_VCV_ENV_UPGRADE']) ? $_SERVER['ENV_VCV_ENV_UPGRADE'] : true
    );
}

if (!defined('VCV_TF_POSTS_RERENDER')) {
    define(
        'VCV_TF_POSTS_RERENDER',
        isset($_SERVER['ENV_VCV_TF_POSTS_RERENDER']) ? $_SERVER['ENV_VCV_TF_POSTS_RERENDER'] : true
    );
}

if (!defined('VCV_DEBUG')) {
    define('VCV_DEBUG', false);
}

if (!defined('VCV_TF_JS_SETTINGS')) {
    define(
        'VCV_TF_JS_SETTINGS',
        isset($_SERVER['ENV_VCV_TF_JS_SETTINGS']) ? $_SERVER['ENV_VCV_TF_JS_SETTINGS'] : true
    );
}

if (!defined('VCV_PAGE_TEMPLATES_FE')) {
    define(
        'VCV_PAGE_TEMPLATES_FE',
        isset($_SERVER['ENV_VCV_PAGE_TEMPLATES_FE']) ? $_SERVER['ENV_VCV_PAGE_TEMPLATES_FE'] : true
    );
}

if (!defined('VCV_PAGE_TITLE_FE')) {
    define(
        'VCV_PAGE_TITLE_FE',
        isset($_SERVER['ENV_VCV_PAGE_TITLE_FE']) ? $_SERVER['ENV_VCV_PAGE_TITLE_FE'] : true
    );
}

if (!defined('VCV_HUB_DOWNLOAD_SINGLE_ELEMENT')) {
    define(
        'VCV_HUB_DOWNLOAD_SINGLE_ELEMENT',
        isset($_SERVER['ENV_VCV_HUB_DOWNLOAD_SINGLE_ELEMENT']) ? $_SERVER['ENV_VCV_HUB_DOWNLOAD_SINGLE_ELEMENT'] : true
    );
}

if (!defined('VCV_HUB_DOWNLOAD_SINGLE_TEMPLATE')) {
    define(
        'VCV_HUB_DOWNLOAD_SINGLE_TEMPLATE',
        isset($_SERVER['ENV_VCV_HUB_DOWNLOAD_SINGLE_TEMPLATE']) ? $_SERVER['ENV_VCV_HUB_DOWNLOAD_SINGLE_TEMPLATE']
            : true
    );
}

if (!defined('VCV_IFRAME_RELOAD')) {
    define(
        'VCV_IFRAME_RELOAD',
        isset($_SERVER['ENV_VCV_IFRAME_RELOAD']) ? $_SERVER['ENV_VCV_IFRAME_RELOAD'] : true
    );
}

if (!defined('VCV_REVISIONS_SAVE_FIX')) {
    define(
        'VCV_REVISIONS_SAVE_FIX',
        isset($_SERVER['ENV_VCV_REVISIONS_SAVE_FIX']) ? $_SERVER['ENV_VCV_REVISIONS_SAVE_FIX'] : true
    );
}
if (!defined('VCV_FE_SHORTCODES_SCRIPTS')) {
    define(
        'VCV_FE_SHORTCODES_SCRIPTS',
        isset($_SERVER['ENV_VCV_FE_SHORTCODES_SCRIPTS']) ? $_SERVER['ENV_VCV_FE_SHORTCODES_SCRIPTS'] : true
    );
}

if (!defined('VCV_FIX_CURL_JSON_DOWNLOAD')) {
    define(
        'VCV_FIX_CURL_JSON_DOWNLOAD',
        isset($_SERVER['ENV_VCV_FIX_CURL_JSON_DOWNLOAD']) ? $_SERVER['ENV_VCV_FIX_CURL_JSON_DOWNLOAD'] : false
    );
}

if (!defined('VCV_BOXED_BLANK_PAGE_TEMPLATE')) {
    define(
        'VCV_BOXED_BLANK_PAGE_TEMPLATE',
        isset($_SERVER['ENV_VCV_BOXED_BLANK_PAGE_TEMPLATE']) ? $_SERVER['ENV_VCV_BOXED_BLANK_PAGE_TEMPLATE'] : true
    );
}

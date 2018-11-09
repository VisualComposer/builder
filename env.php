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
if (!defined('VCV_PREMIUM_TOKEN_URL')) {
    define(
        'VCV_PREMIUM_TOKEN_URL',
        isset($_SERVER['ENV_VCV_PREMIUM_TOKEN_URL']) ? $_SERVER['ENV_PREMIUM_VCV_TOKEN_URL']
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
            : 'https://account.visualcomposer.io/activation'
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

if (!defined('VCV_DEBUG')) {
    define('VCV_DEBUG', false);
}

if (!defined('VCV_TF_JS_SETTINGS')) {
    define(
        'VCV_TF_JS_SETTINGS',
        isset($_SERVER['ENV_VCV_TF_JS_SETTINGS']) ? $_SERVER['ENV_VCV_TF_JS_SETTINGS'] : true
    );
}

if (!defined('VCV_FIX_CURL_JSON_DOWNLOAD')) {
    define(
        'VCV_FIX_CURL_JSON_DOWNLOAD',
        isset($_SERVER['ENV_VCV_FIX_CURL_JSON_DOWNLOAD']) ? $_SERVER['ENV_VCV_FIX_CURL_JSON_DOWNLOAD'] : false
    );
}

if (!defined('VCV_TF_ASSETS_IN_UPLOADS')) {
    define(
        'VCV_TF_ASSETS_IN_UPLOADS',
        isset($_SERVER['ENV_VCV_TF_ASSETS_IN_UPLOADS']) ? $_SERVER['ENV_VCV_TF_ASSETS_IN_UPLOADS'] : true
    );
}

if (!defined('VCV_TF_ASSETS_URLS_FACTORY_RESET')) {
    define(
        'VCV_TF_ASSETS_URLS_FACTORY_RESET',
        isset($_SERVER['ENV_VCV_TF_ASSETS_URLS_FACTORY_RESET']) ? $_SERVER['ENV_VCV_TF_ASSETS_URLS_FACTORY_RESET']
            : true
    );
}

if (!defined('VCV_TF_ADD_NEW_VC_IN_NAVBAR')) {
    define(
        'VCV_TF_ADD_NEW_VC_IN_NAVBAR',
        isset($_SERVER['ENV_VCV_TF_ADD_NEW_VC_IN_NAVBAR']) ? $_SERVER['ENV_VCV_TF_ADD_NEW_VC_IN_NAVBAR'] : true
    );
}

// Disabled until all php elements updated
if (!defined('VCV_ENV_ELEMENTS_FILES_NOGLOB')) {
    define(
        'VCV_ENV_ELEMENTS_FILES_NOGLOB',
        isset($_SERVER['ENV_VCV_ENV_ELEMENTS_FILES_NOGLOB']) ? $_SERVER['ENV_VCV_ENV_ELEMENTS_FILES_NOGLOB'] : false
    );
}

if (!defined('VCV_ENV_TEMPLATES_LOAD_ASYNC')) {
    define(
        'VCV_ENV_TEMPLATES_LOAD_ASYNC',
        isset($_SERVER['ENV_VCV_ENV_TEMPLATES_LOAD_ASYNC']) ? $_SERVER['ENV_VCV_ENV_TEMPLATES_LOAD_ASYNC'] : true
    );
}

if (!defined('VCV_TF_BLANK_PAGE_BOXED')) {
    define(
        'VCV_TF_BLANK_PAGE_BOXED',
        true
    );
}

if (!defined('VCV_FT_INITIAL_CSS_LOAD')) {
    define(
        'VCV_FT_INITIAL_CSS_LOAD',
        true
    );
}

if (!defined('VCV_TF_CSS_CHECKSUM')) {
    define(
        'VCV_TF_CSS_CHECKSUM',
        true
    );
}

if (!defined('VCV_FT_TEMPLATE_DATA_ASYNC')) {
    define(
        'VCV_FT_TEMPLATE_DATA_ASYNC',
        true
    );
}

if (!defined('VCV_FT_ACTIVATION_REDESIGN')) {
    define(
        'VCV_FT_ACTIVATION_REDESIGN',
        true
    );
}

if (!defined('VCV_FT_ASSETS_INSIDE_PLUGIN')) {
    define(
        'VCV_FT_ASSETS_INSIDE_PLUGIN',
        true
    );
}

if (!defined('VCV_FT_ACTIVATION_FIELDS_MOVE')) {
    define(
        'VCV_FT_ACTIVATION_FIELDS_MOVE',
        false
    );
}
if (!defined('VCV_FT_CATEGORIES_INSIDE_PLUGIN')) {
    define(
        'VCV_FT_CATEGORIES_INSIDE_PLUGIN',
        true
    );
}

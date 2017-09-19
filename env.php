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
        isset($_SERVER['ENV_VCV_HUB_URL']) ? $_SERVER['ENV_VCV_HUB_URL'] : 'http://account.visualcomposer.io'
    );
}
if (!defined('VCV_TOKEN_URL')) {
    define(
        'VCV_TOKEN_URL',
        isset($_SERVER['ENV_VCV_TOKEN_URL']) ? $_SERVER['ENV_VCV_TOKEN_URL']
            : 'https://account.visualcomposer.io/authorization-token'
    );
}

if (!defined('VCV_ACTIVATE_LICENSE_URL')) {
    define(
        'VCV_ACTIVATE_LICENSE_URL',
        isset($_SERVER['ENV_VCV_ACTIVATE_LICENSE_URL']) ? $_SERVER['ENV_VCV_ACTIVATE_LICENSE_URL']
            : 'https://account.visualcomposer.io/activate-license'
    );
}

if (!defined('VCV_ACTIVATE_LICENSE_FINISH_URL')) {
    define(
        'VCV_ACTIVATE_LICENSE_FINISH_URL',
        isset($_SERVER['ENV_VCV_ACTIVATE_LICENSE_FINISH_URL']) ? $_SERVER['ENV_VCV_ACTIVATE_LICENSE_FINISH_URL']
            : 'https://account.visualcomposer.io/finish-license-activation'
    );
}


if (!defined('VCV_ENV_LICENSES')) {
    define(
        'VCV_ENV_LICENSES',
        isset($_SERVER['ENV_VCV_ENV_LICENSES']) ? $_SERVER['ENV_VCV_ENV_LICENSES'] : true
    );
}

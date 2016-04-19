<?php

return array (
  'helpers' => 
  array (
    'TemplatesHelper' => 
    array (
      'name' => 'TemplatesHelper',
      'abstract' => 'VisualComposer\\Helpers\\Templates',
      'make' => false,
    ),
    'StrHelper' => 
    array (
      'name' => 'StrHelper',
      'abstract' => 'VisualComposer\\Helpers\\Str',
      'make' => false,
    ),
    'NonceHelper' => 
    array (
      'name' => 'NonceHelper',
      'abstract' => 'VisualComposer\\Helpers\\Nonce',
      'make' => false,
    ),
    'TokenHelper' => 
    array (
      'name' => 'TokenHelper',
      'abstract' => 'VisualComposer\\Helpers\\Token',
      'make' => false,
    ),
    'FileHelper' => 
    array (
      'name' => 'FileHelper',
      'abstract' => 'VisualComposer\\Helpers\\File',
      'make' => false,
    ),
    'OptionsHelper' => 
    array (
      'name' => 'OptionsHelper',
      'abstract' => 'VisualComposer\\Helpers\\Options',
      'make' => false,
    ),
    'CoreHelper' => 
    array (
      'name' => 'CoreHelper',
      'abstract' => 'VisualComposer\\Helpers\\Core',
      'make' => false,
    ),
    'RequestHelper' => 
    array (
      'name' => 'RequestHelper',
      'abstract' => 'VisualComposer\\Helpers\\Request',
      'make' => false,
    ),
    'UrlHelper' => 
    array (
      'name' => 'UrlHelper',
      'abstract' => 'VisualComposer\\Helpers\\Url',
      'make' => false,
    ),
    'AccessRoleHelper' => 
    array (
      'name' => 'AccessRoleHelper',
      'abstract' => 'VisualComposer\\Helpers\\Access\\Role',
      'make' => false,
    ),
    'AccessCurrentUserHelper' => 
    array (
      'name' => 'AccessCurrentUserHelper',
      'abstract' => 'VisualComposer\\Helpers\\Access\\CurrentUser',
      'make' => false,
    ),
    'DataHelper' => 
    array (
      'name' => 'DataHelper',
      'abstract' => 'VisualComposer\\Helpers\\Data',
      'make' => false,
    ),
  ),
  'modules' => 
  array (
    'SystemActivationController' => 
    array (
      'name' => 'SystemActivationController',
      'abstract' => 'VisualComposer\\Modules\\System\\Activation\\Controller',
      'make' => true,
    ),
    'EditorsFrontendController' => 
    array (
      'name' => 'EditorsFrontendController',
      'abstract' => 'VisualComposer\\Modules\\Editors\\Frontend\\Controller',
      'make' => true,
    ),
    'SystemTextDomainController' => 
    array (
      'name' => 'SystemTextDomainController',
      'abstract' => 'VisualComposer\\Modules\\System\\TextDomain\\Controller',
      'make' => true,
    ),
    'SettingsPagesRoles' => 
    array (
      'name' => 'SettingsPagesRoles',
      'abstract' => 'VisualComposer\\Modules\\Settings\\Pages\\Roles',
      'make' => true,
    ),
    'ElementsAjaxShortcodeRenderController' => 
    array (
      'name' => 'ElementsAjaxShortcodeRenderController',
      'abstract' => 'VisualComposer\\Modules\\Elements\\AjaxShortcodeRender\\Controller',
      'make' => true,
    ),
    'LicenseController' => 
    array (
      'name' => 'LicenseController',
      'abstract' => 'VisualComposer\\Modules\\License\\Controller',
      'make' => true,
    ),
    'EditorsDataAjaxController' => 
    array (
      'name' => 'EditorsDataAjaxController',
      'abstract' => 'VisualComposer\\Modules\\Editors\\DataAjax\\Controller',
      'make' => true,
    ),
    'SiteController' => 
    array (
      'name' => 'SiteController',
      'abstract' => 'VisualComposer\\Modules\\Site\\Controller',
      'make' => true,
    ),
    'SettingsPagesHub' => 
    array (
      'name' => 'SettingsPagesHub',
      'abstract' => 'VisualComposer\\Modules\\Settings\\Pages\\Hub',
      'make' => true,
    ),
    'SettingsController' => 
    array (
      'name' => 'SettingsController',
      'abstract' => 'VisualComposer\\Modules\\Settings\\Controller',
      'make' => true,
    ),
    'EditorsPageEditableController' => 
    array (
      'name' => 'EditorsPageEditableController',
      'abstract' => 'VisualComposer\\Modules\\Editors\\PageEditable\\Controller',
      'make' => true,
    ),
    'SettingsPagesGeneral' => 
    array (
      'name' => 'SettingsPagesGeneral',
      'abstract' => 'VisualComposer\\Modules\\Settings\\Pages\\General',
      'make' => true,
    ),
    'SettingsPagesLicense' => 
    array (
      'name' => 'SettingsPagesLicense',
      'abstract' => 'VisualComposer\\Modules\\Settings\\Pages\\License',
      'make' => true,
    ),
    'SettingsPagesAbout' => 
    array (
      'name' => 'SettingsPagesAbout',
      'abstract' => 'VisualComposer\\Modules\\Settings\\Pages\\About',
      'make' => true,
    ),
    'SettingsPagesAuthorization' => 
    array (
      'name' => 'SettingsPagesAuthorization',
      'abstract' => 'VisualComposer\\Modules\\Settings\\Pages\\Authorization',
      'make' => true,
    ),
    'EditorsAssetsManagerController' => 
    array (
      'name' => 'EditorsAssetsManagerController',
      'abstract' => 'VisualComposer\\Modules\\Editors\\AssetsManager\\Controller',
      'make' => true,
    ),
  ),
);
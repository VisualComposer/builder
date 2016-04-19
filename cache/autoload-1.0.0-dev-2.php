<?php

return array (
  'helpers' => 
  array (
    'CoreHelper' => 
    array (
      'name' => 'CoreHelper',
      'abstract' => 'VisualComposer\\Helpers\\Core',
      'make' => false,
    ),
    'TokenHelper' => 
    array (
      'name' => 'TokenHelper',
      'abstract' => 'VisualComposer\\Helpers\\Token',
      'make' => false,
    ),
    'DataHelper' => 
    array (
      'name' => 'DataHelper',
      'abstract' => 'VisualComposer\\Helpers\\Data',
      'make' => false,
    ),
    'AccessRoleHelper' => 
    array (
      'name' => 'AccessRoleHelper',
      'abstract' => 'VisualComposer\\Helpers\\Access\\Role',
      'make' => false,
    ),
    'NonceHelper' => 
    array (
      'name' => 'NonceHelper',
      'abstract' => 'VisualComposer\\Helpers\\Nonce',
      'make' => false,
    ),
    'StrHelper' => 
    array (
      'name' => 'StrHelper',
      'abstract' => 'VisualComposer\\Helpers\\Str',
      'make' => false,
    ),
    'UrlHelper' => 
    array (
      'name' => 'UrlHelper',
      'abstract' => 'VisualComposer\\Helpers\\Url',
      'make' => false,
    ),
    'TemplatesHelper' => 
    array (
      'name' => 'TemplatesHelper',
      'abstract' => 'VisualComposer\\Helpers\\Templates',
      'make' => false,
    ),
    'RequestHelper' => 
    array (
      'name' => 'RequestHelper',
      'abstract' => 'VisualComposer\\Helpers\\Request',
      'make' => false,
    ),
    'OptionsHelper' => 
    array (
      'name' => 'OptionsHelper',
      'abstract' => 'VisualComposer\\Helpers\\Options',
      'make' => false,
    ),
    'FileHelper' => 
    array (
      'name' => 'FileHelper',
      'abstract' => 'VisualComposer\\Helpers\\File',
      'make' => false,
    ),
    'AccessCurrentUserHelper' => 
    array (
      'name' => 'AccessCurrentUserHelper',
      'abstract' => 'VisualComposer\\Helpers\\Access\\CurrentUser',
      'make' => false,
    ),
  ),
  'modules' => 
  array (
    'SettingsPagesHub' => 
    array (
      'name' => 'SettingsPagesHub',
      'abstract' => 'VisualComposer\\Modules\\Settings\\Pages\\Hub',
      'make' => true,
    ),
    'EditorsPageEditableController' => 
    array (
      'name' => 'EditorsPageEditableController',
      'abstract' => 'VisualComposer\\Modules\\Editors\\PageEditable\\Controller',
      'make' => true,
    ),
    'SettingsController' => 
    array (
      'name' => 'SettingsController',
      'abstract' => 'VisualComposer\\Modules\\Settings\\Controller',
      'make' => true,
    ),
    'SettingsPagesAuthorization' => 
    array (
      'name' => 'SettingsPagesAuthorization',
      'abstract' => 'VisualComposer\\Modules\\Settings\\Pages\\Authorization',
      'make' => true,
    ),
    'EditorsFrontendController' => 
    array (
      'name' => 'EditorsFrontendController',
      'abstract' => 'VisualComposer\\Modules\\Editors\\Frontend\\Controller',
      'make' => true,
    ),
    'SettingsPagesLicense' => 
    array (
      'name' => 'SettingsPagesLicense',
      'abstract' => 'VisualComposer\\Modules\\Settings\\Pages\\License',
      'make' => true,
    ),
    'SystemActivationController' => 
    array (
      'name' => 'SystemActivationController',
      'abstract' => 'VisualComposer\\Modules\\System\\Activation\\Controller',
      'make' => true,
    ),
    'SiteController' => 
    array (
      'name' => 'SiteController',
      'abstract' => 'VisualComposer\\Modules\\Site\\Controller',
      'make' => true,
    ),
    'SystemTextDomainController' => 
    array (
      'name' => 'SystemTextDomainController',
      'abstract' => 'VisualComposer\\Modules\\System\\TextDomain\\Controller',
      'make' => true,
    ),
    'ElementsAjaxShortcodeRenderController' => 
    array (
      'name' => 'ElementsAjaxShortcodeRenderController',
      'abstract' => 'VisualComposer\\Modules\\Elements\\AjaxShortcodeRender\\Controller',
      'make' => true,
    ),
    'SettingsPagesGeneral' => 
    array (
      'name' => 'SettingsPagesGeneral',
      'abstract' => 'VisualComposer\\Modules\\Settings\\Pages\\General',
      'make' => true,
    ),
    'SettingsPagesAbout' => 
    array (
      'name' => 'SettingsPagesAbout',
      'abstract' => 'VisualComposer\\Modules\\Settings\\Pages\\About',
      'make' => true,
    ),
    'EditorsAssetsManagerController' => 
    array (
      'name' => 'EditorsAssetsManagerController',
      'abstract' => 'VisualComposer\\Modules\\Editors\\AssetsManager\\Controller',
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
    'SettingsPagesRoles' => 
    array (
      'name' => 'SettingsPagesRoles',
      'abstract' => 'VisualComposer\\Modules\\Settings\\Pages\\Roles',
      'make' => true,
    ),
  ),
);
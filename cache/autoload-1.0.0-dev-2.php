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
    'DataHelper' => 
    array (
      'name' => 'DataHelper',
      'abstract' => 'VisualComposer\\Helpers\\Data',
      'make' => false,
    ),
    'FileHelper' => 
    array (
      'name' => 'FileHelper',
      'abstract' => 'VisualComposer\\Helpers\\File',
      'make' => false,
    ),
    'NonceHelper' => 
    array (
      'name' => 'NonceHelper',
      'abstract' => 'VisualComposer\\Helpers\\Nonce',
      'make' => false,
    ),
    'OptionsHelper' => 
    array (
      'name' => 'OptionsHelper',
      'abstract' => 'VisualComposer\\Helpers\\Options',
      'make' => false,
    ),
    'RequestHelper' => 
    array (
      'name' => 'RequestHelper',
      'abstract' => 'VisualComposer\\Helpers\\Request',
      'make' => false,
    ),
    'StrHelper' => 
    array (
      'name' => 'StrHelper',
      'abstract' => 'VisualComposer\\Helpers\\Str',
      'make' => false,
    ),
    'TemplatesHelper' => 
    array (
      'name' => 'TemplatesHelper',
      'abstract' => 'VisualComposer\\Helpers\\Templates',
      'make' => false,
    ),
    'TokenHelper' => 
    array (
      'name' => 'TokenHelper',
      'abstract' => 'VisualComposer\\Helpers\\Token',
      'make' => false,
    ),
    'UrlHelper' => 
    array (
      'name' => 'UrlHelper',
      'abstract' => 'VisualComposer\\Helpers\\Url',
      'make' => false,
    ),
    'AccessCurrentUserHelper' => 
    array (
      'name' => 'AccessCurrentUserHelper',
      'abstract' => 'VisualComposer\\Helpers\\Access\\CurrentUser',
      'make' => false,
    ),
    'AccessRoleHelper' => 
    array (
      'name' => 'AccessRoleHelper',
      'abstract' => 'VisualComposer\\Helpers\\Access\\Role',
      'make' => false,
    ),
  ),
  'modules' => 
  array (
    'EditorsAssetsManagerController' => 
    array (
      'name' => 'EditorsAssetsManagerController',
      'abstract' => 'VisualComposer\\Modules\\Editors\\AssetsManager\\Controller',
      'make' => true,
    ),
    'EditorsFrontendController' => 
    array (
      'name' => 'EditorsFrontendController',
      'abstract' => 'VisualComposer\\Modules\\Editors\\Frontend\\Controller',
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
    'SiteController' => 
    array (
      'name' => 'SiteController',
      'abstract' => 'VisualComposer\\Modules\\Site\\Controller',
      'make' => true,
    ),
    'SystemAjaxController' => 
    array (
      'name' => 'SystemAjaxController',
      'abstract' => 'VisualComposer\\Modules\\System\\Ajax\\Controller',
      'make' => true,
    ),
  ),
);
<?php

return [
    'helpers' =>
        [
            'CoreHelper' =>
                [
                    'name' => 'CoreHelper',
                    'abstract' => 'VisualComposer\\Helpers\\Core',
                    'make' => false,
                ],
            'DataHelper' =>
                [
                    'name' => 'DataHelper',
                    'abstract' => 'VisualComposer\\Helpers\\Data',
                    'make' => false,
                ],
            'FileHelper' =>
                [
                    'name' => 'FileHelper',
                    'abstract' => 'VisualComposer\\Helpers\\File',
                    'make' => false,
                ],
            'NonceHelper' =>
                [
                    'name' => 'NonceHelper',
                    'abstract' => 'VisualComposer\\Helpers\\Nonce',
                    'make' => false,
                ],
            'OptionsHelper' =>
                [
                    'name' => 'OptionsHelper',
                    'abstract' => 'VisualComposer\\Helpers\\Options',
                    'make' => false,
                ],
            'RequestHelper' =>
                [
                    'name' => 'RequestHelper',
                    'abstract' => 'VisualComposer\\Helpers\\Request',
                    'make' => false,
                ],
            'StrHelper' =>
                [
                    'name' => 'StrHelper',
                    'abstract' => 'VisualComposer\\Helpers\\Str',
                    'make' => false,
                ],
            'TemplatesHelper' =>
                [
                    'name' => 'TemplatesHelper',
                    'abstract' => 'VisualComposer\\Helpers\\Templates',
                    'make' => false,
                ],
            'TokenHelper' =>
                [
                    'name' => 'TokenHelper',
                    'abstract' => 'VisualComposer\\Helpers\\Token',
                    'make' => false,
                ],
            'UrlHelper' =>
                [
                    'name' => 'UrlHelper',
                    'abstract' => 'VisualComposer\\Helpers\\Url',
                    'make' => false,
                ],
            'AccessCurrentUserHelper' =>
                [
                    'name' => 'AccessCurrentUserHelper',
                    'abstract' => 'VisualComposer\\Helpers\\Access\\CurrentUser',
                    'make' => false,
                ],
            'AccessRoleHelper' =>
                [
                    'name' => 'AccessRoleHelper',
                    'abstract' => 'VisualComposer\\Helpers\\Access\\Role',
                    'make' => false,
                ],
        ],
    'modules' =>
        [
            'EditorsAssetsManagerController' =>
                [
                    'name' => 'EditorsAssetsManagerController',
                    'abstract' => 'VisualComposer\\Modules\\Editors\\AssetsManager\\Controller',
                    'make' => true,
                ],
            'EditorsAttributesUrlController' =>
                [
                    'name' => 'EditorsAttributesUrlController',
                    'abstract' => 'VisualComposer\\Modules\\Editors\\Attributes\\Url\\Controller',
                    'make' => true,
                ],
            'EditorsDataAjaxController' =>
                [
                    'name' => 'EditorsDataAjaxController',
                    'abstract' => 'VisualComposer\\Modules\\Editors\\DataAjax\\Controller',
                    'make' => true,
                ],
            'EditorsEditPostLinksController' =>
                [
                    'name' => 'EditorsEditPostLinksController',
                    'abstract' => 'VisualComposer\\Modules\\Editors\\EditPostLinks\\Controller',
                    'make' => true,
                ],
            'EditorsFrontendController' =>
                [
                    'name' => 'EditorsFrontendController',
                    'abstract' => 'VisualComposer\\Modules\\Editors\\Frontend\\Controller',
                    'make' => true,
                ],
            'EditorsPageEditableController' =>
                [
                    'name' => 'EditorsPageEditableController',
                    'abstract' => 'VisualComposer\\Modules\\Editors\\PageEditable\\Controller',
                    'make' => true,
                ],
            'SiteController' =>
                [
                    'name' => 'SiteController',
                    'abstract' => 'VisualComposer\\Modules\\Site\\Controller',
                    'make' => true,
                ],
            'SystemAjaxController' =>
                [
                    'name' => 'SystemAjaxController',
                    'abstract' => 'VisualComposer\\Modules\\System\\Ajax\\Controller',
                    'make' => true,
                ],
        ],
];

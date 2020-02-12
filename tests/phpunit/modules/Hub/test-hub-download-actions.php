<?php

class HubDownloadActions extends WP_UnitTestCase
{
    public function testAvailableVariables()
    {
        $this->assertIsArray(BundleHelperTest::$releaseJson);
        $this->assertIsArray(BundleHelperTest::$elementJson);
        $this->assertIsArray(BundleHelperTest::$addonJson);
        $this->assertIsArray(BundleHelperTest::$templateJson);
    }

    public function testElementDownloadAction()
    {
        $this->assertFalse(VcvEnv::get('VCV_ENV_DEV_ELEMENTS', false));
        $action = BundleHelperTest::$elementJson['actions'][0];
        $name = $action['action'];
        $data = $action['data'];

        $hubHelper = vchelper('HubActionsActionBundle');

        $result = vcfilter(
            'vcv:hub:process:action:element/icon',
            ['status' => true],
            [
                'data' => $data,
                'action' => $name,
            ]
        );
        $this->assertEquals(
            VCV_PLUGIN_ASSETS_DIR_PATH . '/temp-bundle-' . str_replace('/', '-', $name),
            $hubHelper->getTempBundleFolder()
        );

        $elementsAfter = vchelper('HubElements')->getElements();
        $this->assertEquals(
            [
                'icon' => [
                    'settings' => [
                        'name' => 'Icon',
                        'metaThumbnailUrl' => 'http://localhost/wp-content/uploads/builder-assets/elements/icon/icon/public/thumbnail-icon.jpg',
                        'metaPreviewUrl' => 'http://localhost/wp-content/uploads/builder-assets/elements/icon/icon/public/preview-icon.jpg',
                        'metaDescription' => 'Simple icon element with various icons from library and background shape control options.',
                    ],
                    'key' => 'icon',
                    'bundlePath' => 'http://localhost/wp-content/uploads/builder-assets/elements/icon/public/dist/element.bundle.js',
                    'elementPath' => 'http://localhost/wp-content/uploads/builder-assets/elements/icon/icon/',
                    'elementRealPath' => '/var/www/html/wp-content/uploads/builder-assets/elements/icon/icon/',
                    'assetsPath' => 'http://localhost/wp-content/uploads/builder-assets/elements/icon/icon/public/',
                ],
            ],
            $elementsAfter
        );
        $this->assertFalse(vcIsBadResponse($result));
    }

    public function testAddonDownloadAction()
    {
        $this->assertFalse(VcvEnv::get('VCV_ENV_DEV_ADDONS', false));
        $action = BundleHelperTest::$addonJson['actions'][0];
        $name = $action['action'];
        $data = $action['data'];

        $hubBundle = vchelper('HubActionsActionBundle');

        $result = vcfilter(
            'vcv:hub:process:action:addon/pluginVersionCheck',
            ['status' => true],
            [
                'data' => $data,
                'action' => $name,
            ]
        );
        $this->assertEquals(
            VCV_PLUGIN_ASSETS_DIR_PATH . '/temp-bundle-' . str_replace('/', '-', $name),
            $hubBundle->getTempBundleFolder()
        );

        $addonsAfter = vchelper('HubAddons')->getAddons();
        $this->assertEquals(
            [
                'pluginVersionCheck' => [
                    'settings' => [
                        'name' => 'Plugin Version Check',
                        'metaThumbnailUrl' => '[publicPath]/vcwb-default-addon-thumbnail.png',
                        'metaPreviewUrl' => '[publicPath]/vcwb-default-addon-preview.png',
                        'metaDescription' => 'Automatically checks the plugin version and helps to keep the plugin up to date.',
                    ],
                    'phpFiles' => [
                        '/var/www/html/wp-content/uploads/builder-assets/addons/pluginVersionCheck/pluginVersionCheck/SettingsController.php',
                    ],
                    'addonRealPath' => '/var/www/html/wp-content/uploads/builder-assets/addons/pluginVersionCheck/pluginVersionCheck/',
                ],
            ],
            $addonsAfter
        );
        $this->assertFalse(vcIsBadResponse($result));
    }

    public function testTemplateDownloadAction()
    {
        $this->assertFalse(VcvEnv::get('VCV_ENV_DEV_ADDONS', false));
        $action = BundleHelperTest::$templateJson['actions'][0];
        $name = $action['action'];
        $data = $action['data'];

        $hubBundle = vchelper('HubActionsActionBundle');

        $result = vcfilter(
            'vcv:hub:process:action:predefinedTemplate/weddingPage',
            ['status' => true],
            [
                'data' => $data,
                'action' => $name,
            ]
        );
        $this->assertFalse(vcIsBadResponse($result));
        $this->assertEquals(
            VCV_PLUGIN_ASSETS_DIR_PATH . '/temp-bundle-' . str_replace('/', '-', $name),
            $hubBundle->getTempBundleFolder()
        );
        wp_set_current_user(1);
        $templates = vchelper('EditorTemplates')->all();
        $this->assertEquals(
            [
                'predefined' => [
                    'name' => 'Content Templates',
                    'type' => 'predefined',
                    'templates' => [
                        [
                            'name' => 'Wedding Page',
                            'bundle' => 'predefinedTemplate/weddingPage',
                            'id' => (string)$result['templates'][0]['id'],
                            'thumbnail' => 'https://cdn.hub.visualcomposer.com/vcwb-templates/1556191390.weddingPage-thumbnail.png',
                            'preview' => 'https://cdn.hub.visualcomposer.com/vcwb-templates/1556191390.weddingPage-preview.png',
                            'type' => 'predefined',
                            'description' => 'An ideal one-page layout for your wedding or other events, including meetups and networking parties.',
                        ],
                    ],
                ],
                'hub' => [
                    'templates' => [
                    ],
                ],
                'custom' => [
                    'templates' => [
                    ],
                ],
            ],

            $templates
        );
    }

    public function testAssetDownloadAction()
    {
        $this->assertTrue(VcvEnv::get('VCV_FT_ASSETS_INSIDE_PLUGIN'));
        $this->assertTrue(VcvEnv::get('VCV_ENV_EXTENSION_DOWNLOAD'));
        $action = BundleHelperTest::$releaseJson['actions']['asset/faqToggle'];

        $name = $action['action'];
        $data = $action['data'];
        $result = vcfilter(
            'vcv:hub:process:action:asset/faqToggle',
            ['status' => true],
            [
                'data' => $data,
                'action' => $name,
            ]
        );
        $this->assertFalse(vcIsBadResponse($result));
        $this->assertEquals(
            [
                'status' => true,
                'sharedAssets' =>
                    [
                        'faqToggle' =>
                            [
                                'name' => 'faqToggle',
                                'dependencies' =>
                                    [
                                    ],
                                'jsBundle' => 'sharedLibraries/faqToggle/dist/faqToggle.bundle.js',
                            ],
                    ],
                'sharedAssetsUrl' => 'http://localhost/wp-content/uploads/builder-assets/',
            ],
            $result
        );
    }

    public function testCategoriesUpdater()
    {
        $result = vcfilter(
            'vcv:hub:download:bundle:anythingtestCategoriesUpdater',
            ['status' => true],
            [
                'archive' => [
                    'categories' => [
                        'Icon' => ['elements' => ['megaCustomIcon']],
                    ],
                ],
            ]
        );
        $this->assertFalse(vcIsBadResponse($result));
        $this->assertEquals(
            [
                'status' => true,
                'categories' => [
                    [
                        'Icon' => [
                            'elements' => [
                                'megaCustomIcon',
                            ],
                        ],
                    ],
                ],
            ],
            $result
        );

        $hubCategories = vchelper('HubCategories');
        $all = $hubCategories->getCategories();
        $iconCat = $all['Icon'];
        $this->assertContains('megaCustomIcon', $iconCat['elements']);
        $this->assertContains('icon', $iconCat['elements']);
        $this->assertContains('iconGroup', $iconCat['elements']);
        unset($iconCat['elements']);
        $this->assertEquals(
            [
                'title' => 'Icon',
                'icon' => 'http://localhost/wp-content/plugins/builder/public/categories/icons/Icon.svg',
                'iconDark' => 'http://localhost/wp-content/plugins/builder/public/categories/iconsDark/Icon.svg',
            ],
            $iconCat
        );
    }
}

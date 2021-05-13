<?php

class HubDownloadActionsTest extends WP_UnitTestCase
{
    public function testAvailableVariables()
    {
        $this->assertIsArray(BundleHelperTest::$releaseJson);
        $this->assertIsArray(BundleHelperTest::$elementJson);
        $this->assertIsArray(BundleHelperTest::$addonJson);
        $this->assertIsArray(BundleHelperTest::$templateJson);
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
        $this->assertArrayHasKey('pluginVersionCheck', $addonsAfter);

        $this->assertEquals(
            [

                'settings' => [
                    'name' => 'Plugin Version Check',
                    'metaThumbnailUrl' => '[publicPath]/vcwb-default-addon-thumbnail.png',
                    'metaPreviewUrl' => '[publicPath]/vcwb-default-addon-preview.png',
                    'metaAddonImageUrl' => '[publicPath]/default-addon-image.png',
                    'metaDescription' => 'Automatically checks the plugin version and helps to keep the plugin up to date.',
                ],
                'phpFiles' => [
                    '/var/www/html/wp-content/uploads/' . VCV_PLUGIN_ASSETS_DIRNAME
                    . '/addons/pluginVersionCheck/pluginVersionCheck/SettingsController.php',
                    '/var/www/html/wp-content/uploads/' . VCV_PLUGIN_ASSETS_DIRNAME
                    . '/addons/pluginVersionCheck/pluginVersionCheck/EnqueueController.php',
                ],
                'addonRealPath' => '/var/www/html/wp-content/uploads/' . VCV_PLUGIN_ASSETS_DIRNAME
                    . '/addons/pluginVersionCheck/pluginVersionCheck/',
            ],
            $addonsAfter['pluginVersionCheck']
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
        vchelper('EditorTemplates')->clearCache();
        $templates = vchelper('EditorTemplates')->all();
        $usageCount = vchelper('Options')->get('usageCount', []);
        $templateId = (string)$result['templates'][0]['id'];
        $this->assertEquals(
            [
                'predefined' => [
                    'name' => 'Hub Templates',
                    'type' => 'predefined',
                    'templates' => [
                        [
                            'name' => 'Wedding Page',
                            'bundle' => 'predefinedTemplate/weddingPage',
                            'id' => $templateId,
                            'usageCount' => isset($usageCount[ 'template/' . $templateId ]) ? $usageCount[ 'template/' . $templateId ] : 0,
                            'thumbnail' => 'http://localhost/wp-content/uploads/' . VCV_PLUGIN_ASSETS_DIRNAME
                                . '/templates/TP11000008/1556191390.weddingpage-thumbnail.png',
                            'preview' => 'http://localhost/wp-content/uploads/' . VCV_PLUGIN_ASSETS_DIRNAME
                                . '/templates/TP11000008/1556191390.weddingpage-preview.png',
                            'type' => 'predefined',
                            'description' => 'An ideal one-page layout for a wedding, engagements, meetups, and networking parties.',
                        ],
                    ],
                ],
            ],

            $templates
        );
        $this->assertEquals(
            [
                VCV_PLUGIN_ASSETS_DIR_PATH . '/templates/TP11000008/assets/elements/Life-before-image-150x150.jpg',
                VCV_PLUGIN_ASSETS_DIR_PATH . '/templates/TP11000008/assets/elements/Life-before-image-300x212.jpg',
                VCV_PLUGIN_ASSETS_DIR_PATH . '/templates/TP11000008/assets/elements/Life-before-image.jpg',
                VCV_PLUGIN_ASSETS_DIR_PATH . '/templates/TP11000008/assets/elements/Love-story-image-150x150.jpg',
                VCV_PLUGIN_ASSETS_DIR_PATH . '/templates/TP11000008/assets/elements/Love-story-image-300x212.jpg',
                VCV_PLUGIN_ASSETS_DIR_PATH . '/templates/TP11000008/assets/elements/Love-story-image.jpg',
                VCV_PLUGIN_ASSETS_DIR_PATH . '/templates/TP11000008/assets/elements/Photo-gallery-four-1024x351.jpg',
                VCV_PLUGIN_ASSETS_DIR_PATH . '/templates/TP11000008/assets/elements/Photo-gallery-four-150x150.jpg',
                VCV_PLUGIN_ASSETS_DIR_PATH . '/templates/TP11000008/assets/elements/Photo-gallery-four-300x103.jpg',
                VCV_PLUGIN_ASSETS_DIR_PATH . '/templates/TP11000008/assets/elements/Photo-gallery-four.jpg',
                VCV_PLUGIN_ASSETS_DIR_PATH . '/templates/TP11000008/assets/elements/Photo-gallery-one-150x150.jpg',
                VCV_PLUGIN_ASSETS_DIR_PATH . '/templates/TP11000008/assets/elements/Photo-gallery-one-191x300.jpg',
                VCV_PLUGIN_ASSETS_DIR_PATH . '/templates/TP11000008/assets/elements/Photo-gallery-one.jpg',
                VCV_PLUGIN_ASSETS_DIR_PATH . '/templates/TP11000008/assets/elements/Photo-gallery-three-150x150.jpg',
                VCV_PLUGIN_ASSETS_DIR_PATH . '/templates/TP11000008/assets/elements/Photo-gallery-three-191x300.jpg',
                VCV_PLUGIN_ASSETS_DIR_PATH . '/templates/TP11000008/assets/elements/Photo-gallery-three.jpg',
                VCV_PLUGIN_ASSETS_DIR_PATH . '/templates/TP11000008/assets/elements/Photo-gallery-two-150x150.jpg',
                VCV_PLUGIN_ASSETS_DIR_PATH . '/templates/TP11000008/assets/elements/Photo-gallery-two-191x300.jpg',
                VCV_PLUGIN_ASSETS_DIR_PATH . '/templates/TP11000008/assets/elements/Photo-gallery-two.jpg',
                VCV_PLUGIN_ASSETS_DIR_PATH . '/templates/TP11000008/assets/elements/Two-meet-image-150x150.jpg',
                VCV_PLUGIN_ASSETS_DIR_PATH . '/templates/TP11000008/assets/elements/Two-meet-image-162x300.jpg',
                VCV_PLUGIN_ASSETS_DIR_PATH . '/templates/TP11000008/assets/elements/Two-meet-image.jpg',
                VCV_PLUGIN_ASSETS_DIR_PATH . '/templates/TP11000008/assets/elements/Wedding-header-image-1024x640.jpg',
                VCV_PLUGIN_ASSETS_DIR_PATH . '/templates/TP11000008/assets/elements/Wedding-header-image-150x150.jpg',
                VCV_PLUGIN_ASSETS_DIR_PATH . '/templates/TP11000008/assets/elements/Wedding-header-image-300x188.jpg',
                VCV_PLUGIN_ASSETS_DIR_PATH . '/templates/TP11000008/assets/elements/Wedding-header-image.jpg',
                VCV_PLUGIN_ASSETS_DIR_PATH . '/templates/TP11000008/assets/elements/Yes-image-150x150.jpg',
                VCV_PLUGIN_ASSETS_DIR_PATH . '/templates/TP11000008/assets/elements/Yes-image-260x300.jpg',
                VCV_PLUGIN_ASSETS_DIR_PATH . '/templates/TP11000008/assets/elements/Yes-image.jpg',
                VCV_PLUGIN_ASSETS_DIR_PATH . '/templates/TP11000008/assets/elements/family-image-150x150.jpg',
                VCV_PLUGIN_ASSETS_DIR_PATH . '/templates/TP11000008/assets/elements/family-image-300x212.jpg',
                VCV_PLUGIN_ASSETS_DIR_PATH . '/templates/TP11000008/assets/elements/family-image.jpg',
                VCV_PLUGIN_ASSETS_DIR_PATH . '/templates/TP11000008/assets/elements/johnson-image.png',
            ],
            glob(VCV_PLUGIN_ASSETS_DIR_PATH . '/templates/TP11000008/assets/elements/*')
        );
    }
}

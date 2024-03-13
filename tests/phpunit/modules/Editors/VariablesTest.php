<?php

class VariablesTest extends WP_UnitTestCase
{
    public function testVariablesTypes()
    {
        $variables = vcfilter('vcv:editor:variables', []);

        foreach ($variables as $variable) {
            $this->assertArrayHasKey('type', $variable, '`type` not specified for variable ' . $variable['key']);
            $this->assertContains(
                $variable['type'],
                ['variable', 'constant'],
                'Variable type unknown:' . $variable['type'] . ' name: ' . $variable['key']
            );
            if ($variable['type'] === 'variable') {
                $this->assertNotEquals(
                    $variable['key'],
                    strtoupper($variable['key']),
                    'Avoid use CAMEL_CASE in non-constant variables: ' . $variable['key']
                );
            }
        }
    }

    public function testEnvVariables()
    {
        $dataHelper = vchelper('Data');
        $variables = vcfilter('vcv:editor:variables', []);
        $this->assertIsArray($variables);

        $variableKeys = $dataHelper->arrayColumn($variables, 'key');
        $this->assertIsArray($variableKeys);
        $this->assertContains('VCV_ENV', $variableKeys, 'VCV_ENV');
        $this->assertContains('VCV_SITE_URL', $variableKeys, 'VCV_SITE_URL');
        $keyEnv = array_search('VCV_ENV', $variableKeys);

        $this->assertIsNumeric($keyEnv);
        $this->assertTrue(isset($variables[ $keyEnv ]));
        $this->assertTrue(isset($variables[ $keyEnv ]['value']));
        $this->arrayHasKey('VCV_HUB_URL', $variables[ $keyEnv ]['value']);
        $this->assertEquals(\VcvEnv::all(), $variables[ $keyEnv ]['value']);
    }

    public function testAddonsVariables()
    {
        $dataHelper = vchelper('Data');
        $variables = vcfilter('vcv:editor:variables', []);

        $variableKeys = $dataHelper->arrayColumn($variables, 'key');
        $this->assertContains('VCV_HUB_GET_ADDONS', $variableKeys, 'VCV_HUB_GET_ADDONS');
        $key = array_search('VCV_HUB_GET_ADDONS', $variableKeys);

        $this->assertIsNumeric($key, 'key:' . $key);
        $this->assertTrue(isset($variables[ $key ]));
        $this->assertTrue(isset($variables[ $key ]['value']));
        $hubHelper = vcapp('\VisualComposer\Helpers\Hub\Addons');
        $this->assertEquals($hubHelper->getAddons(false), $variables[ $key ]['value']);
    }

    public function testKeysVariables()
    {
        $dataHelper = vchelper('Data');
        $variables = vcfilter('vcv:editor:variables', []);

        $variableKeys = $dataHelper->arrayColumn($variables, 'key');
        $this->assertContains(
            'VCV_PAGE_TEMPLATES_LAYOUTS_CURRENT',
            $variableKeys,
            'VCV_PAGE_TEMPLATES_LAYOUTS_CURRENT'
        );
        $this->assertContains(
            'VCV_PAGE_TEMPLATES_LAYOUTS',
            $variableKeys,
            'VCV_PAGE_TEMPLATES_LAYOUTS'
        );
        $this->assertContains(
            'VCV_PAGE_TEMPLATES_LAYOUTS_THEME',
            $variableKeys,
            'VCV_PAGE_TEMPLATES_LAYOUTS_THEME'
        );
        $this->assertContains(
            'VCV_HUB_GET_ADDONS',
            $variableKeys,
            'VCV_HUB_GET_ADDONS'
        );
        $this->assertContains(
            'VCV_HUB_GET_ADDON_TEASER',
            $variableKeys,
            'VCV_HUB_GET_ADDON_TEASER'
        );
        $this->assertContains(
            'VCV_HUB_GET_TEMPLATES_TEASER',
            $variableKeys,
            'VCV_HUB_GET_TEMPLATES_TEASER'
        );
        $this->assertContains(
            'VCV_PLUGIN_UPDATE',
            $variableKeys,
            'VCV_PLUGIN_UPDATE'
        );
    }

    public function testErrorReporingVariables()
    {
        $dataHelper = vchelper('Data');
        $variables = vcfilter('vcv:editor:variables', []);

        $variableKeys = $dataHelper->arrayColumn($variables, 'key');
        $this->assertContains('VCV_ERROR_REPORT_URL', $variableKeys, 'VCV_ERROR_REPORT_URL');
    }

    public function testUpdateVariablesAbout()
    {
        $dataHelper = vchelper('Data');
        $variables = vcfilter('vcv:editor:variables', [], ['slug' => 'vcv-about']);

        $variableKeys = $dataHelper->arrayColumn($variables, 'key');
        $this->assertContains('VCV_ACTIVE_PAGE', $variableKeys, 'VCV_ACTIVE_PAGE');
        $key = array_search('VCV_ACTIVE_PAGE', $variableKeys);

        $this->assertIsNumeric($key, 'key: ' . $key);
        $this->assertTrue(isset($variables[ $key ]));
        $this->assertTrue(isset($variables[ $key ]['value']));
        $this->assertEquals('last', $variables[ $key ]['value']);
    }

    public function testUpdateVariablesGettingStarted()
    {
        $dataHelper = vchelper('Data');
        $variables = vcfilter('vcv:editor:variables', [], ['slug' => 'vcv-getting-started']);

        $variableKeys = $dataHelper->arrayColumn($variables, 'key');
        $this->assertContains('VCV_ACTIVATION_SLIDES', $variableKeys, 'VCV_ACTIVATION_SLIDES');
    }

    public function testEditorVariables()
    {

        $dataHelper = vchelper('Data');

        $postId = $this->createPost();

        $variables = vcfilter('vcv:editor:variables', [], ['sourceId' => $postId]);

        $variableKeys = $dataHelper->arrayColumn($variables, 'key');

        $this->assertContains('ajaxurl', $variableKeys, 'ajaxurl');
        $this->assertContains('vcvSourceID', $variableKeys, 'vcvSourceID');
        $this->assertContains('vcvAjaxUrl', $variableKeys, 'vcvAjaxUrl');
        $this->assertContains('vcvAdminAjaxUrl', $variableKeys, 'vcvAdminAjaxUrl');
        $this->assertContains('vcvNonce', $variableKeys, 'vcvNonce');
        $this->assertContains('vcvPageEditableNonce', $variableKeys, 'vcvPageEditableNonce');
        $this->assertContains('vcvPluginUrl', $variableKeys, 'vcvPluginUrl');
        $this->assertContains('vcvPluginSourceUrl', $variableKeys, 'vcvPluginSourceUrl');
        $this->assertContains('vcvPostData', $variableKeys, 'vcvPostData');
        $this->assertContains('vcvPostPermanentLink', $variableKeys, 'vcvPostPermanentLink');
        $this->assertContains('vcvIsPremiumActivated', $variableKeys, 'vcvIsPremiumActivated');
        $this->assertContains('vcvGoPremiumUrl', $variableKeys, 'vcvGoPremiumUrl');
        $this->assertContains('vcvGettingStartedUrl', $variableKeys, 'vcvGettingStartedUrl');
        $this->assertContains('vcvGutenbergEditorUrl', $variableKeys, 'vcvGutenbergEditorUrl');
    }

    public function testJsonVariables()
    {
        wp_set_current_user(1);
        $dataHelper = vchelper('Data');
        $postId = $this->createPost();

        $variables = vcfilter('vcv:editor:variables', [], ['sourceId' => $postId]);

        $variableKeys = $dataHelper->arrayColumn($variables, 'key');
        $this->assertContains('vcvPostData', $variableKeys, 'vcvPostData');
        $keyPostData = array_search('vcvPostData', $variableKeys);

        $this->assertIsArray($variables[ $keyPostData ]);
    }

    /**
     * @return int|\WP_Error
     */
    protected function createPost()
    {
        wp_set_current_user(1);
        $postTypeHelper = vchelper('PostType');
        $postId = $postTypeHelper->create(
            [
                'post_type' => 'page',
                'post_content' => '',
            ]
        );
        $this->assertTrue(is_numeric($postId));
        $this->assertTrue($postId > 0);
        $postTypeHelper->setupPost($postId);

        return $postId;
    }

    public function testInitialHelpersVariables()
    {
        wp_set_current_user(1);
        $postId = $this->createPost();

        $optionsHelper = vchelper('Options');
        $dataHelper = vchelper('Data');

        $isEnabled = $optionsHelper->get('settings-initial-helpers-enabled', true);
        $optionsHelper->set('settings-initial-helpers-enabled', true);
        $variables = vcfilter('vcv:editor:variables', [], ['sourceId' => $postId]);
        $variableKeys = $dataHelper->arrayColumn($variables, 'key');

        $this->assertContains('VCV_SHOW_INITIAL_HELPERS', $variableKeys, 'VCV_SHOW_INITIAL_HELPERS');
        // Set it back to the previous value
        $optionsHelper->set('settings-initial-helpers-enabled', $isEnabled);
    }
}

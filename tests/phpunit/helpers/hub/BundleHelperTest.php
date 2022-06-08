<?php

class BundleHelperTest extends WP_UnitTestCase
{
    public static $latestVersion;

    public static $releaseJson;

    public static $elementJson = [];

    public static $addonJson;

    public static $templateJson = [];

    protected function getLatestWpVersion()
    {
        if (BundleHelperTest::$latestVersion === null) {
            $url = 'https://api.wordpress.org/plugins/info/1.0/visualcomposer.json';

            $response = wp_remote_get($url);
            $this->assertFalse(is_wp_error($response));
            $body = json_decode($response['body'], true);
            $this->assertIsArray($body);
            BundleHelperTest::$latestVersion = $body['version'];
        }

        return BundleHelperTest::$latestVersion;
    }

    public function testReleaseJsonForLatestWpRelease()
    {
        $version = $this->getLatestWpVersion();

        $helper = vchelper('HubBundle');
        $releaseJsonUrl = str_replace(VCV_VERSION, $version, $helper->getJsonDownloadUrl(['token' => 'free-token']));

        // now make sure that download works fine!
        BundleHelperTest::$releaseJson = $helper->getRemoteBundleJson($releaseJsonUrl);

        $this->assertIsArray(BundleHelperTest::$releaseJson);
        $this->assertArrayHasKey('actions', BundleHelperTest::$releaseJson);
        $this->assertNotEmpty(BundleHelperTest::$releaseJson['actions']);
    }

    //    public function testFreeElementJson()
    // DIsabled because there is no free elements in release json anymore
    //    {
    //        $version = $this->getLatestWpVersion();
    //        $helper = vchelper('HubBundle');
    //        $urlParam = ['token' => 'free-token', 'bundle' => 'element/icon'];
    //        $url = str_replace(
    //            VCV_VERSION,
    //            $version,
    //            $helper->getAssetDownloadUrl('element', $urlParam)
    //        );
    //
    //        BundleHelperTest::$elementJson = $helper->getRemoteBundleJson($url);
    //        $this->assertIsArray(BundleHelperTest::$elementJson);
    //        $this->assertArrayHasKey('actions', BundleHelperTest::$elementJson);
    //        $this->assertNotEmpty(BundleHelperTest::$elementJson['actions']);
    //    }

    public function testFreeTemplateJson()
    {
        $version = $this->getLatestWpVersion();
        $helper = vchelper('HubBundle');
        $urlParam = ['token' => 'free-token', 'bundle' => 'predefinedTemplate/weddingPage'];
        $url = str_replace(
            VCV_VERSION,
            $version,
            $helper->getAssetDownloadUrl('template', $urlParam)
        );

        BundleHelperTest::$templateJson = $helper->getRemoteBundleJson($url);
        $this->assertIsArray(BundleHelperTest::$templateJson);
        $this->assertArrayHasKey('actions', BundleHelperTest::$templateJson);
        $this->assertNotEmpty(BundleHelperTest::$templateJson['actions']);
    }

    public function testFreeAddonJson()
    {
        $version = $this->getLatestWpVersion();
        $helper = vchelper('HubBundle');
        $urlParam = ['token' => 'free-token', 'bundle' => 'addon/pluginVersionCheck'];
        $url = str_replace(
            VCV_VERSION,
            $version,
            $helper->getAssetDownloadUrl('addon', $urlParam)
        );

        BundleHelperTest::$addonJson = $helper->getRemoteBundleJson($url);
        $this->assertIsArray(BundleHelperTest::$addonJson);
        $this->assertArrayHasKey('actions', BundleHelperTest::$addonJson);
        $this->assertNotEmpty(BundleHelperTest::$addonJson['actions']);
    }

    //    public function testFreeAssetJson()
    //    {
    //        // ASSETS doesn't have different url, it located on release json
    //        $findAsset = BundleHelperTest::$releaseJson['actions']['asset/faqToggle'];
    //        $this->assertIsArray($findAsset);
    //        $this->assertArrayHasKey('data', $findAsset);
    //        $this->assertNotEmpty($findAsset['data']);
    //    }

    public function testElementActionBundle()
    {
        $helper = vcapp(TestHubElementDownload::class);
        $this->assertEquals(rtrim(__DIR__, '\//') . '/tmp-dir/element-tmp', $helper->getTempBundleFolder());
    }

    //    public function testElementActionDownload()
    // DISABLED Because free elements are built-in since v36
    //    {
    //        $helper = vcapp(TestHubElementDownload::class);
    //        $this->assertArrayHasKey('actions', BundleHelperTest::$elementJson);
    //        $elementAction = BundleHelperTest::$elementJson['actions'][0];
    //        $downloadedArchive = $helper->requestBundleDownload($elementAction['data']['url']);
    //        $this->assertTrue(is_file($downloadedArchive));
    //        $this->assertEquals(rtrim(__DIR__, '\//') . '/tmp-dir/element-tmp', $helper->getTempBundleFolder());
    //
    //        // unzip
    //        // force set bundle path again to fix downloaded override
    //        $helper->bundlePath = rtrim(__DIR__, '\//') . '/tmp-dir/element-tmp';
    //        $result = $helper->unzipDownloadedBundle($downloadedArchive);
    //        $this->assertTrue($result);
    //        $manifest = $helper->readBundleJson($helper->getTempBundleFolder('bundle.json'));
    //        $this->assertEquals(
    //            [
    //                'elements' =>
    //                    [
    //                        'icon' =>
    //                            [
    //                                'settings' =>
    //                                    [
    //                                        'name' => 'Icon',
    //                                        'metaThumbnailUrl' => '[publicPath]/thumbnail-icon.jpg',
    //                                        'metaPreviewUrl' => '[publicPath]/preview-icon.jpg',
    //                                        'metaDescription' => 'Simple icon element with various icons from library and background shape control options.',
    //                                    ],
    //                            ],
    //                    ],
    //                'categories' =>
    //                    [
    //                        'Icon' =>
    //                            [
    //                                'elements' =>
    //                                    [
    //                                        0 => 'icon',
    //                                    ],
    //                            ],
    //                    ],
    //            ],
    //            $manifest
    //        );
    //
    //        // remove downloaded
    //        $this->assertFileExists($helper->getTempBundleFolder());
    //        $removeResult = $helper->removeTempBundleFolder();
    //        $this->assertTrue($removeResult);
    //        $this->assertFileDoesNotExist($helper->getTempBundleFolder());
    //    }

    public function testAddonActionBundle()
    {
        $helper = vcapp(TestHubAddonDownload::class);
        $this->assertEquals(rtrim(__DIR__, '\//') . '/tmp-dir/addon-tmp', $helper->getTempBundleFolder());
    }

    public function testAddonActionDownload()
    {
        $helper = vcapp(TestHubAddonDownload::class);
        $this->assertArrayHasKey('actions', BundleHelperTest::$addonJson);
        $addonAction = BundleHelperTest::$addonJson['actions'][0];
        $downloadedArchive = $helper->requestBundleDownload($addonAction['data']['url']);
        $this->assertTrue(is_file($downloadedArchive));
        $this->assertEquals(rtrim(__DIR__, '\//') . '/tmp-dir/addon-tmp', $helper->getTempBundleFolder());

        // unzip
        // force set bundle path again to fix downloaded override
        $helper->bundlePath = rtrim(__DIR__, '\//') . '/tmp-dir/addon-tmp';
        $result = $helper->unzipDownloadedBundle($downloadedArchive);
        $this->assertTrue($result);
        $manifest = $helper->readBundleJson($helper->getTempBundleFolder('bundle.json'));
        $this->assertEquals(
            [
                'addons' => [
                    'pluginVersionCheck' => [
                        'settings' => [
                            'name' => 'Plugin Version Check',
                            'metaThumbnailUrl' => '[publicPath]/vcwb-default-addon-thumbnail.png',
                            'metaPreviewUrl' => '[publicPath]/vcwb-default-addon-preview.png',
                            'metaAddonImageUrl' => '[publicPath]/default-addon-image.png',
                            'metaDescription' => 'Automatically checks the plugin version and helps to keep the plugin up to date.',
                        ],
                        'phpFiles' => [
                            0 => 'SettingsController.php',
                            1 => 'EnqueueController.php',
                        ],
                    ],
                ],
            ],
            $manifest
        );

        // remove downloaded
        $this->assertFileExists($helper->getTempBundleFolder());
        $removeResult = $helper->removeTempBundleFolder();
        $this->assertTrue($removeResult);
        $this->assertFileDoesNotExist($helper->getTempBundleFolder());
    }

    public function testTemplateActionBundle()
    {
        $helper = vcapp(TestHubTemplatesDownload::class);
        $this->assertEquals(rtrim(__DIR__, '\//') . '/tmp-dir/templates-tmp', $helper->getTempBundleFolder());
    }

    public function testTemplateActionDownload()
    {
        $helper = vcapp(TestHubTemplatesDownload::class);
        $this->assertArrayHasKey('actions', BundleHelperTest::$templateJson);
        $templateAction = BundleHelperTest::$templateJson['actions'][0];
        $downloadedArchive = $helper->requestBundleDownload($templateAction['data']['url']);
        $this->assertTrue(is_file($downloadedArchive));
        $this->assertEquals(rtrim(__DIR__, '\//') . '/tmp-dir/templates-tmp', $helper->getTempBundleFolder());

        // unzip
        // force set bundle path again to fix downloaded override
        $helper->bundlePath = rtrim(__DIR__, '\//') . '/tmp-dir/templates-tmp';
        $result = $helper->unzipDownloadedBundle($downloadedArchive);
        $this->assertTrue($result);
        $manifest = $helper->readBundleJson($helper->getTempBundleFolder('bundle.json'));
        /*
         array (
    'id' => 'TP11000008',
    'type' => 'custom',
    'tags' =>
    array (
      0 => 'element/singleImage',
      1 => 'element/column',
      2 => 'element/basicButton',
      3 => 'element/row',
      4 => 'element/textBlock',
      5 => 'element/icon',
    ),
    'data' =>
    array (

         */
        $this->assertEquals('TP11000008', $manifest['id']);
        $this->assertEquals('custom', $manifest['type']);
        //        $this->assertEquals(
        //            [
        //                'element/singleImage',
        //                'element/column',
        //                'element/basicButton',
        //                'element/row',
        //                'element/textBlock',
        //                'element/icon',
        //            ],
        //            $manifest['tags']
        //        );
        $this->assertArrayHasKey('data', $manifest);

        // remove downloaded
        $this->assertFileExists($helper->getTempBundleFolder());
        $removeResult = $helper->removeTempBundleFolder();
        $this->assertTrue($removeResult);
        $this->assertFileDoesNotExist($helper->getTempBundleFolder());
    }

    //    public function testFreeAssetDownload()
    // Also disabled because now it is built-in
    // TODO: update disabled tests for premium checks.
    //    {
    //        // ASSETS doesn't have different url, it located on release json
    //        $findAsset = BundleHelperTest::$releaseJson['actions']['asset/faqToggle'];
    //        $helper = vcapp(TestAssetDownload::class);
    //        $downloadedArchive = $helper->requestBundleDownload($findAsset['data']['url']);
    //        $this->assertEquals(rtrim(__DIR__, '\//') . '/tmp-dir/shared-tmp', $helper->getTempBundleFolder());
    //
    //        $this->assertTrue(is_file($downloadedArchive));
    //
    //        // unzip
    //        // force set bundle path again to fix downloaded override
    //        $helper->bundlePath = rtrim(__DIR__, '\//') . '/tmp-dir/shared-tmp';
    //        $result = $helper->unzipDownloadedBundle($downloadedArchive);
    //        $this->assertTrue($result);
    //        $manifest = $helper->readBundleJson($helper->getTempBundleFolder('bundle.json'));
    //        $this->assertEquals(rtrim(__DIR__, '\//') . '/tmp-dir/shared-tmp', $helper->getTempBundleFolder());
    //        $this->assertEquals(
    //            [
    //                'assetsLibrary' => [
    //                    [
    //                        'name' => 'faqToggle',
    //                        'dependencies' => [],
    //                        'jsBundle' => '[publicPath]/dist/faqToggle.bundle.js',
    //                    ],
    //                ],
    //            ],
    //            $manifest
    //        );
    //
    //        // remove downloaded
    //        $this->assertFileExists($helper->getTempBundleFolder());
    //        $removeResult = $helper->removeTempBundleFolder();
    //        $this->assertTrue($removeResult);
    //        $this->assertFileDoesNotExist($helper->getTempBundleFolder());
    //    }
}

class TestHubElementDownload extends \VisualComposer\Helpers\Hub\Actions\ActionBundle
{
    public $bundlePath;

    public function __construct()
    {
        $this->bundlePath = rtrim(__DIR__, '\//') . '/tmp-dir/element-tmp';
    }
}

class TestHubAddonDownload extends \VisualComposer\Helpers\Hub\Actions\ActionBundle
{
    public $bundlePath;

    public function __construct()
    {
        $this->bundlePath = rtrim(__DIR__, '\//') . '/tmp-dir/addon-tmp';
    }
}

class TestHubTemplatesDownload extends \VisualComposer\Helpers\Hub\Actions\ActionBundle
{
    public $bundlePath;

    public function __construct()
    {
        $this->bundlePath = rtrim(__DIR__, '\//') . '/tmp-dir/templates-tmp';
    }
}

class TestAssetDownload extends \VisualComposer\Helpers\Hub\Actions\ActionBundle
{
    public $bundlePath;

    public function __construct()
    {
        $this->bundlePath = rtrim(__DIR__, '\//') . '/tmp-dir/shared-tmp';
    }
}

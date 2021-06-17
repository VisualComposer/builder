<?php

class TemplatesControllerTest extends WP_UnitTestCase
{
    public function testAsyncTemplateLoad()
    {
        // 1.st create some template
        wp_set_current_user(1);
        $postTypeHelper = vchelper('PostType');
        $postId = $postTypeHelper->create(
            [
                'post_type' => 'vcv_templates',
                'post_content' => 'Test',
                'post_status' => 'publish',
                'post_title' => 'Welcome-testAsyncTemplateLoad',
                'meta_input' => [
                    VCV_PREFIX
                    . 'pageContent' => '%7B%22elements%22%3A%7B%2224053598%22%3A%7B%22metaThumbnailUrl%22%3A%22%22%2C%22parent%22%3Afalse%2C%22hidden%22%3Afalse%2C%22name%22%3A%22--%22%2C%22metaPreviewUrl%22%3A%22%22%2C%22order%22%3A0%2C%22metaDescription%22%3A%22%22%2C%22customHeaderTitle%22%3A%22%22%2C%22tag%22%3A%22row%22%2C%22id%22%3A%2224053598%22%7D%2C%22eb5b30ca%22%3A%7B%22size%22%3A%22100%25%22%2C%22designOptionsAdvanced%22%3A%7B%7D%2C%22disableStacking%22%3Afalse%2C%22firstInRow%22%3Atrue%2C%22relatedTo%22%3A%5B%22Column%22%5D%2C%22customClass%22%3A%22%22%2C%22containerFor%22%3A%5B%22General%22%5D%2C%22metaThumbnailUrl%22%3A%22http%3A%2F%2Fvcwb.local%2Fwp-content%2Fuploads%2Fvisualcomposer-assets%2Felements%2F%22%2C%22parent%22%3A%2224053598%22%2C%22hidden%22%3Afalse%2C%22editFormTab1%22%3A%5B%22metaCustomId%22%2C%22customClass%22%5D%2C%22name%22%3A%22Column%22%2C%22metaPreviewUrl%22%3A%22http%3A%2F%2Fvcwb.local%2Fwp-content%2Fuploads%2Fvisualcomposer-assets%2Felements%2F%22%2C%22metaBundlePath%22%3A%22http%3A%2F%2Fvcwb.local%2Fwp-content%2Fuploads%2Fvisualcomposer-assets%2Felements%2Fcolumn%2Fpublic%2Fdist%2Felement.bundle.js%22%2C%22metaAssetsPath%22%3A%22http%3A%2F%2Fvcwb.local%2Fwp-content%2Fuploads%2Fvisualcomposer-assets%2Felements%2Fcolumn%2Fcolumn%2Fpublic%2F%22%2C%22order%22%3A0%2C%22metaEditFormTabs%22%3A%5B%22editFormTab1%22%2C%22designOptionsAdvanced%22%2C%22dividers%22%5D%2C%22metaCustomId%22%3A%22%22%2C%22metaDescription%22%3A%22%22%2C%22assetsLibrary%22%3A%5B%22animate%22%2C%22backgroundSlider%22%2C%22backgroundSimple%22%2C%22backgroundZoom%22%2C%22backgroundColorGradient%22%2C%22backgroundVideoYoutube%22%2C%22backgroundVideoVimeo%22%2C%22backgroundVideoEmbed%22%2C%22parallaxFade%22%2C%22parallaxBackground%22%5D%2C%22backendView%22%3A%22frontend%22%2C%22dividers%22%3A%7B%7D%2C%22customHeaderTitle%22%3A%22%22%2C%22tag%22%3A%22column%22%2C%22id%22%3A%22eb5b30ca%22%2C%22metaElementPath%22%3A%22http%3A%2F%2Fvcwb.local%2Fwp-content%2Fuploads%2Fvisualcomposer-assets%2Felements%2Fcolumn%2Fcolumn%2F%22%2C%22lastInRow%22%3Atrue%7D%2C%2210fd6ab0%22%3A%7B%22metaThumbnailUrl%22%3A%22%22%2C%22parent%22%3A%22eb5b30ca%22%2C%22hidden%22%3Afalse%2C%22name%22%3A%22--%22%2C%22metaPreviewUrl%22%3A%22%22%2C%22order%22%3A0%2C%22metaDescription%22%3A%22%22%2C%22customHeaderTitle%22%3A%22%22%2C%22tag%22%3A%22singleImage%22%2C%22id%22%3A%2210fd6ab0%22%7D%7D%7D',
                    '_vcv-type' => 'custom',
                ],
            ]
        );
        $this->assertTrue(is_numeric($postId));
        $postTypeHelper->setupPost($postId);
        // 2.nd let's test it
        $data = vcfilter('vcv:dataAjax:getData', ['status' => true], ['sourceId' => $postId]);
        $this->assertArrayHasKey('templates', $data, 'Data:' . json_encode($data));
        $templates = $data['templates'];
        $this->assertArrayHasKey('custom', $templates);
        $customTemplates = $templates['custom']['templates'];
        $this->assertNotEmpty($customTemplates);
        $lastTemplate = $customTemplates[ count($customTemplates) - 1 ];
        $this->assertEquals('Welcome-testAsyncTemplateLoad', $lastTemplate['name']);
        $this->assertEquals($postId, intval($lastTemplate['id']));
    }

    public function testTemplateSave()
    {
        wp_set_current_user(1);
        /** @var \VisualComposer\Helpers\Request $requestHelper */
        $requestHelper = vchelper('Request');
        $requestHelper->setData(['vcv-ready' => '1', 'vcv-source-id' => 'template']);
        /** @var \VisualComposer\Modules\System\Ajax\Controller $module */
        $module = vc_create_module_mock('\VisualComposer\Modules\System\Ajax\Controller');
        $result = $module->call('getResponse', ['setData:adminNonce']);
        $this->assertTrue(array_key_exists('status', $result));
        $this->assertEquals(true, $result['status']);
        $this->assertTrue(array_key_exists('postData', $result));

        // Reset
        $requestHelper->setData([]);
    }
}

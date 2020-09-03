<?php

class DynamicFieldsAddonTest extends WP_UnitTestCase
{
    protected $calledApi = 0;

    public function testAddons()
    {
        if (vcvenv('VCV_ENV_DEV_ADDONS')) {
            $path = vcapp()->path('devAddons/dynamicFields/dynamicFields');
            $this->assertTrue(is_dir($path), $path);
            wp_set_current_user(1);
            $this->loadAddon('dynamicFields');
            $this->assertFeaturedImage();
            $this->assertNesting();
            $this->assertNestedFeatured();
        }

        // Just to avoid empty warning
        $this->assertTrue(true);
    }

    protected function assertFeaturedImage()
    {
        $postId = $this->createPost('');
        $attachmentId = $this->createFeatured($postId);
        $url = wp_get_attachment_url($attachmentId);
        $featuredImageUrl = get_the_post_thumbnail_url();
        $this->assertNotEmpty($featuredImageUrl);
        $this->assertNotEmpty($url);
        $this->assertEquals($featuredImageUrl, $url);
        $featuredValue = vcfilter(
            'vcv:dynamic:value:featured_image',
            'testMe',
            [
                'atts' => [
                    'currentValue' => 'test',
                ],
            ]
        );

        $this->assertEquals($url . '?vcv-dynamic-field=featured_image&alt=&caption=&title=vcb-demo-imageMe', $featuredValue);
    }

    protected function assertNesting()
    {
        $this->registerDynamicApi();
        $postContent = '<!--  wp:vcv-gutenberg-blocks/dynamic-field-block-0-1 {"value":"testApi","currentValue":"toBeReplaced1"} --><!-- wp:vcv-gutenberg-blocks/dynamic-field-block-0-2 {"value":"testApi","currentValue":"toBeReplaced2"} --><!-- wp:vcv-gutenberg-blocks/dynamic-field-block-0-3 {"value":"testApi","currentValue":"toBeReplaced3"} --><!-- wp:vcv-gutenberg-blocks/dynamic-field-block-0-4 {"value":"testApi","currentValue":"toBeReplaced4"} --><!-- wp:vcv-gutenberg-blocks/dynamic-field-block-0-5 {"value":"testApi","currentValue":"toBeReplaced5"} --><div class="toBeReplaced1"><div class="test class1 toBeReplaced2" id="el-toBeReplaced3"><div class="vce-test" data-vcv-info="toBeReplaced4">toBeReplaced5</div></div></div><!-- /wp:vcv-gutenberg-blocks/dynamic-field-block-0-5 --><!-- /wp:vcv-gutenberg-blocks/dynamic-field-block-0-4 --><!-- /wp:vcv-gutenberg-blocks/dynamic-field-block-0-3 --><!-- /wp:vcv-gutenberg-blocks/dynamic-field-block-0-2 --><!-- /wp:vcv-gutenberg-blocks/dynamic-field-block-0-1 -->';
        $postId = $this->createPost($postContent);

        $post = get_post($postId);
        $actual = apply_filters('the_content', $post->post_content);
        $this->assertEquals(
            '<div class="replacedValue"><div class="test class1 replacedValue" id="el-replacedValue"><div class="vce-test" data-vcv-info="replacedValue">replacedValue</div></div></div>',
            $actual
        );
        //        $this->assertEquals(5, $this->calledApi);
    }

    protected function createFeatured($postId)
    {
        // Get the path to the upload directory.
        $uploadDir = wp_upload_dir();
        // $filename should be the path to a file in the upload directory .
        $filename = 'vcb-demo-image.jpg';
        $fullPath = $uploadDir['path'] . '/' . $filename;
        copy(__DIR__ . '/../../assets/' . $filename, $fullPath);
        chmod($fullPath, 0777);
        chmod($uploadDir['path'], 0777);
        // Check the type of file. We'll use this as the 'post_mime_type'.
        $fileType = wp_check_filetype(basename($filename), null);

        // Prepare an array of post data for the attachment.
        $attachment = [
            'guid' => $uploadDir['url'] . '/' . $postId . basename($filename),
            'post_mime_type' => $fileType['type'],
            'post_title' => preg_replace('/\.[^.]+$/', '', basename($filename)),
            'post_content' => '',
            'post_status' => 'inherit',
        ];
        // Attach the attachment to parent
        $attachmentId = wp_insert_attachment($attachment, $fullPath, $postId);
        $this->assertTrue(is_numeric($attachmentId));
        set_post_thumbnail($postId, $attachmentId);

        return $attachmentId;
    }
}

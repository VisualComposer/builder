<?php

class DynamicFieldsAddonTest extends WP_UnitTestCase
{
    public function testAddons()
    {
        if (vcvenv('VCV_ENV_DEV_ADDONS')) {
            $path = vcapp()->path('devAddons/dynamicFields/dynamicFields');
            $this->assertTrue(is_dir($path), $path);
            $this->loadAddon('dynamicFields');
            $this->assertFeaturedImage();

        }

        // Just to avoid empty warning
        $this->assertTrue(true);
    }

    protected function assertFeaturedImage()
    {
        wp_set_current_user(1);
        $postId = $this->createPost();
        $attachmentId = $this->createFeatured($postId);
        $url = wp_get_attachment_url($attachmentId);
        $featuredImage = get_the_post_thumbnail_url();
        $this->assertNotEmpty($featuredImage);
        $this->assertNotEmpty($url);
        $this->assertEquals($featuredImage, $url);
        $featuredValue = vcfilter(
            'vcv:dynamic:value:featured_image',
            'testMe',
            [
                'atts' => [
                    'currentValue' => 'test',
                ],
            ]
        );

        $this->assertEquals($url . 'Me', $featuredValue);
    }

    protected function loadAddon($addon)
    {
        $app = vcapp();
        $addonData = $app->path('devAddons/' . $addon . '/manifest.json');
        $devAddons = vc_create_module_mock('\VisualComposer\Modules\Development\DevAddons');
        $addonsMeta = $devAddons->call(
            'readManifests',
            [
                [$addonData],
            ]
        );
        $this->assertTrue(is_array($addonsMeta));
        $this->assertTrue(array_key_exists($addon, $addonsMeta));

        vcevent(
            'vcv:hub:addons:autoload',
            [
                $addonsMeta[ $addon ],
            ]
        );
    }

    protected function createPost()
    {
        $templatesHelper = vchelper('EditorTemplates');

        $postTypeHelper = vchelper('PostType');
        $postId = $postTypeHelper->create(
            [
                'post_type' => 'page',
                'post_content' => 'Test',
            ]
        );
        $this->assertTrue(is_numeric($postId));
        $this->assertTrue($postId > 0);
        $postTypeHelper->setupPost($postId);

        return $postId;
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

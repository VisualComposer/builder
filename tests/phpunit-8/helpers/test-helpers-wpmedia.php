<?php

class HelpersWpmediaTest extends WP_UnitTestCase
{
    public function testWpmediaHelper()
    {
        /**
         * @var $helper VisualComposer\Helpers\WpMedia
         */
        $helper = vcapp('VisualComposer\Helpers\Wpmedia');
        $this->assertTrue(is_object($helper), 'Wpmedia helper should be an object');
    }

    public function testGetImageBySize()
    {
        /**
         * @var $helper VisualComposer\Helpers\Url
         */
        $helper = vcapp('VisualComposer\Helpers\Wpmedia');
        add_filter('wp_get_attachment_image_src', function($image) {
            $image[1] = 100;
            $image[2] = 100;
            return $image;
        });
        $this->assertTrue(method_exists($helper, 'getImageBySize'), 'method getImageBySize() should exist');
     /*
        $id = $this->createDemoImage();
        $uploadDir = wp_upload_dir();

        $params = ['attach_id' => $id, 'thumb_size' => '11x12'];
        $result = $helper->getImageBySize($params);
        $this->assertEquals($uploadDir['url'] .'/vcb-demo-image-' . $params['thumb_size'] . '.jpg', $result['imgUrl']);

        $params = ['attach_id' => $id, 'thumb_size' => 'thumbnail'];
        $result = $helper->getImageBySize($params);
        $this->assertEquals($uploadDir['url'] .'/vcb-demo-image-' . $params['thumb_size'] . '.jpg', $result['imgUrl']);*/
    }

    public function testGetThumbSize()
    {
        /**
         * @var $helper VisualComposer\Helpers\Url
         */
        $helper = vcapp('VisualComposer\Helpers\Wpmedia');
        $this->assertTrue(method_exists($helper, 'getThumbSize'), 'method getThumbSize() should exist');
        $result = $helper->getThumbSize('100x500');
        $this->assertEquals(['100', '500'], $result);
    }

    protected function createDemoImage()
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
            'guid' => $uploadDir['url'] . '/' . basename($filename),
            'post_mime_type' => $fileType['type'],
            'post_title' => preg_replace('/\.[^.]+$/', '', basename($filename)),
            'post_content' => '',
            'post_status' => 'inherit',
        ];
        // Insert the attachment.
        return wp_insert_attachment($attachment, $fullPath);
    }
}

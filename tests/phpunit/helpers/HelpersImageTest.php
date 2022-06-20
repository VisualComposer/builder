<?php

class HelpersImageTest extends WP_UnitTestCase
{
    public function testImageHelper()
    {
        /** @var $helper VisualComposer\Helpers\Image */
        $helper = vcapp('VisualComposer\Helpers\Image');
        $this->assertIsObject($helper, 'Image helper should be an object');
    }

    public function testParseImage()
    {
        /** @var $helper VisualComposer\Helpers\Image */
        $helper = vcapp('VisualComposer\Helpers\Image');

        $this->assertTrue(method_exists($helper, 'parseImage'), 'method parseImage() should exist');

        // No sure about this test as parseImage calls generateImage in its body
        // Need to perform a refactoring first
    }

    public function testGetImageData()
    {
        /** @var $helper VisualComposer\Helpers\Image */
        $helper = vcapp('VisualComposer\Helpers\Image');

        $this->assertTrue(method_exists($helper, 'getImageData'), 'method getImageData() should exist');

        $src = 'http://localhost/wp-content/uploads/2022/06/Portfolio-4.jpg';
        $imageData = $helper->getImageData($src);

        // Should return [path, filename, extension]
        $this->assertIsArray($imageData, 'method getImageData() should return an array');

        // Check path:
        // 1. should exist
        // 2. should contain the correct substring
        $this->assertArrayHasKey('path', $imageData, 'path in missing in $imageData');
        $this->assertStringContainsString(
            'wp-content/uploads/2022/06/Portfolio-4.jpg',
            $imageData['path'],
            'expected path not equals the actual one'
        );

        // Check filename
        $this->assertArrayHasKey('filename', $imageData, 'filename is missing in $imageData');
        $this->assertEquals('Portfolio-4', $imageData['filename'], 'expected filename not equals the actual one');

        // Check extension
        $this->assertArrayHasKey('extension', $imageData, 'extensions is missing in $imageData');
        $this->assertEquals('jpg', $imageData['extension'], 'expected extension not equals the actual one');
        $this->assertNotEquals('png', $imageData['extension'], 'expected extension should not equals the actual one');
    }

    public function testGenerateImage()
    {
        /** @var $helper VisualComposer\Helpers\Image */
        $helper = vcapp('VisualComposer\Helpers\Image');

        $this->assertTrue(method_exists($helper, 'generateImage'), 'method generateImage() should exist');

        // Not sure about this test, because it requires a real installation,
        // with uploaded image. Also perform a resizing operations and so on.
    }

    public function testGetLazyLoadSrc()
    {
        /** @var $helper VisualComposer\Helpers\Image */
        $helper = vcapp('VisualComposer\Helpers\Image');

        $this->assertTrue(method_exists($helper, 'getLazyLoadSrc'), 'method getLazyLoadSrc() should exist');

        $expectedSrc = 'http://localhost/wp-content/uploads/2022/06/Portfolio-4.jpg';
        $expectedLazyLoadSrc = 'http://localhost/wp-content/uploads/2022/06/Portfolio-lazy-4.jpg';

        $srcWithoutLazyLoad = $helper->getLazyLoadSrc(
            'src="http://localhost/wp-content/uploads/2022/06/Portfolio-4.jpg"',
            'http://localhost/wp-content/uploads/2022/06/Portfolio-4.jpg'
        );

        $srcWithLazyLoad = $helper->getLazyLoadSrc(
            'src="http://localhost/wp-content/uploads/2022/06/Portfolio-4.jpg" data-src="http://localhost/wp-content/uploads/2022/06/Portfolio-lazy-4.jpg"',
            'http://localhost/wp-content/uploads/2022/06/Portfolio-4.jpg'
        );

        $this->assertEquals($expectedSrc, $srcWithoutLazyLoad, 'expected src not equals the actual one');
        $this->assertNotEquals($expectedLazyLoadSrc, $srcWithoutLazyLoad, 'should not contains a lazy-load src');

        $this->assertEquals($expectedLazyLoadSrc, $srcWithLazyLoad, 'should be a lazy-load src');
        $this->assertNotEquals($expectedSrc, $srcWithLazyLoad, 'should not be a lazy-load src');
    }

    public function testGetImageSrc()
    {
        /** @var $helper VisualComposer\Helpers\Image */
        $helper = vcapp('VisualComposer\Helpers\Image');

        $this->assertTrue(method_exists($helper, 'getImageSrc'), 'method getImageSrc() should exist');

        $expected = 'http://localhost/wp-content/uploads/2022/06/Portfolio-4-1024x683.jpg';
        $images = [
            '320w' => 'http://localhost/wp-content/uploads/2022/06/Portfolio-4-320x213.jpg',
            '480w' => 'http://localhost/wp-content/uploads/2022/06/Portfolio-4-480x320.jpg',
            '800w' => 'http://localhost/wp-content/uploads/2022/06/Portfolio-4-800x533.jpg',
            '1024w' => 'http://localhost/wp-content/uploads/2022/06/Portfolio-4-1024x683.jpg',
            '2x' => 'http://localhost/wp-content/uploads/2022/06/Portfolio-4-2048x1366.jpg',
        ];

        $this->assertEquals($expected, $helper->getImageSrc($images, 1024), 'expected image not equals the actual one');
        $this->assertNotEquals($expected, $helper->getImageSrc($images, 320), 'expected image equals the actual one (but should not)');
        $this->assertEmpty($helper->getImageSrc([], 1024), 'should be an empty string');
        $this->assertEmpty($helper->getImageSrc($images, 1111), 'should be an empty string');
    }

    public function testGetImageSrcset()
    {
        /** @var $helper VisualComposer\Helpers\Image */
        $helper = vcapp('VisualComposer\Helpers\Image');

        $this->assertTrue(method_exists($helper, 'getImageSrcset'), 'method getImageSrcset() should exist');

        $images = [
            '320w' => 'Portfolio-4-320x213.jpg',
            '480w' => 'Portfolio-4-480x320.jpg',
            '2x' => 'Portfolio-4-2048x1366.jpg',
        ];

        // Note about "http://" part
        // That's because inside `getImageSrcset` url are escaped with `esc_url` function.
        $this->assertEquals(
            'http://Portfolio-4-320x213.jpg 320w, http://Portfolio-4-480x320.jpg 480w, http://Portfolio-4-2048x1366.jpg 2x',
            $helper->getImageSrcset($images),
            'expected srcset not equals the actual one'
        );
        $this->assertNotEmpty($helper->getImageSrcset($images), 'should not be empty');
        $this->assertEmpty($helper->getImageSrcset([]), 'should be an empty string');
    }

    public function testGetAspectRatio()
    {
        /** @var $helper VisualComposer\Helpers\Image */
        $helper = vcapp('VisualComposer\Helpers\Image');

        $this->assertTrue(method_exists($helper, 'getAspectRatio'), 'method getAspectRatio() should exist');

        $width = 1024;
        $height = 682;

        $this->assertEquals(
            $width / $height,
            $helper->getAspectRatio($width, $height),
            'expected aspectRation not equals actual one'
        );
        $this->assertNotEquals(
            $width * $height,
            $helper->getAspectRatio($width, $height),
            'expected aspectRation equals actual one, but should not'
        );
    }

    public function testGetBaseUrl()
    {
        /** @var $helper VisualComposer\Helpers\Image */
        $helper = vcapp('VisualComposer\Helpers\Image');

        $this->assertTrue(method_exists($helper, 'getBaseUrl'), 'method getBaseUrl() should exist');

        $this->assertNotEmpty($helper->getBaseUrl(), 'baseUrl should not be empty');
    }

    public function testGetSizes()
    {
        /** @var $helper VisualComposer\Helpers\Image */
        $helper = vcapp('VisualComposer\Helpers\Image');

        $this->assertTrue(method_exists($helper, 'getSizes'), 'method getSizes() should exist');

        $imageData = [
            'width' => 1024,
            'originalWidth' => 2500,
        ];

        $expected = [
            '320w' => 320,
            '480w' => 480,
            '800w' => 800,
            '1024w' => 1024,
            '2x' => 2048,
        ];

        $this->assertIsArray($helper->getSizes($imageData), 'method getImageData() should return an array');
        $this->assertIsArray($helper->getSizes([]), 'method getImageData() should return an array even with empty $imageData');
        $this->assertEmpty($helper->getSizes([]), 'should be an empty array');
        $this->assertNotEmpty($helper->getSizes($imageData), 'should not be empty');
        $this->assertEqualsCanonicalizing($expected, $helper->getSizes($imageData), 'expected sizes not equals actual one');
    }

    public function testGetImages()
    {
        /** @var $helper VisualComposer\Helpers\Image */
        $helper = vcapp('VisualComposer\Helpers\Image');

        $this->assertTrue(method_exists($helper, 'getImages'), 'method getImages() should exist');

        // More info about testing images see
        // ci/wp-tests-9.0.0/wp-tests/phpunit/tests/image/functions.php
        $image = wp_get_image_editor('');
        $imageData = [];

        $this->assertIsArray($helper->getImages([], $image, $imageData), 'method getImages() should return an array');
        $this->assertEmpty($helper->getImages([], $image, $imageData), 'should be an empty array if $sizes not provided');

        // This method relies on the real installation, so need to add e2e tests
    }

    public function testGetImagesFromAttachmentSizes()
    {
        /** @var $helper VisualComposer\Helpers\Image */
        $helper = vcapp('VisualComposer\Helpers\Image');

        $this->assertTrue(method_exists($helper, 'getImagesFromAttachmentSizes'), 'method getImagesFromAttachmentSizes() should exist');

        // This method relies on the real installation, so need to add e2e tests
    }

    public function testResizeImages()
    {
        /** @var $helper VisualComposer\Helpers\Image */
        $helper = vcapp('VisualComposer\Helpers\Image');

        $this->assertTrue(method_exists($helper, 'resizeImages'), 'method resizeImages() should exist');

        // Not sure about testing this method as it requires to resize a real images
    }

    public function testResizeImage()
    {
        /** @var $helper VisualComposer\Helpers\Image */
        $helper = vcapp('VisualComposer\Helpers\Image');

        $this->assertTrue(method_exists($helper, 'resizeImage'), 'method resizeImage() should exist');

        // Not sure about testing this method as it requires to resize a real images
    }
}

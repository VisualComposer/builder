<?php

class ThemeEditorAddonTest extends WP_UnitTestCase
{
    public function testAddons()
    {
        if (vcvenv('VCV_ENV_DEV_ADDONS')) {
            $path = vcapp()->path('devAddons/themeEditor/themeEditor');
            $this->assertTrue(is_dir($path), $path);
            $path = vcapp()->path('devAddons/themeBuilder/themeBuilder');
            $this->assertTrue(is_dir($path), $path);
            wp_set_current_user(1);
            $this->loadAddon('themeEditor');
            $this->loadAddon('themeBuilder');

            $hfsList = ['header', 'footer', 'sidebar'];
            foreach ($hfsList as $postName) {
                $this->createHfs($postName);
            }

            $postId = $this->createPost();
            update_post_meta($postId, '_vcv-page-template-type', 'vc-theme');

            $headerId = get_posts(['fields' => 'ids','post_type' => 'vcv_headers']);
            $this->assertIsNumeric($headerId[0]);

            update_post_meta($postId, '_vcv-HeaderTemplateId', $headerId[0]);

            $footerId = get_posts(['fields' => 'ids','post_type' => 'vcv_footers']);
            $this->assertIsNumeric($footerId[0]);

            update_post_meta($postId, '_vcv-FooterTemplateId', $footerId[0]);

            $this->assertPageLayoutWithHfs($postId);
        }
        $this->assertTrue(true);
    }

    protected function loadAddon($addon)
    {
        $app = vcapp();
        $addonData = $app->path('devAddons/' . $addon . '/manifest.json');
        $addonsHelper = vchelper('HubAddons');
        $addonsMeta = $addonsHelper->readManifests([$addonData]);
        $this->assertTrue(is_array($addonsMeta));
        $this->assertTrue(array_key_exists($addon, $addonsMeta));
        $addonsMeta[ $addon ]['tag'] = $addon;
        vcevent(
            'vcv:hub:addons:autoload',
            [
                $addonsMeta[ $addon ],
            ]
        );
    }

    protected function createHfs($postName)
    {
        $postTypeHelper = vchelper('PostType');
        $postId = $postTypeHelper->create(
            [
                'post_title' => 'test-theme-editor-' . $postName,
                'post_content' => 'This is ' . $postName,
                'post_status' => 'publish',
                'post_type' => 'vcv_' . $postName . 's'
            ]
        );
        $this->assertTrue(is_numeric($postId));
        $this->assertTrue($postId > 0);
        $postTypeHelper->setupPost($postId);

        return $postId;
    }

    protected function createPost()
    {
        $postTypeHelper = vchelper('PostType');
        $postId = $postTypeHelper->create(
            [
                'post_type' => 'post',
                'post_title' => 'Title',
                'post_content' => 'Here we have some content',
                'post_status' => 'publish',
            ]
        );
        $this->assertTrue(is_numeric($postId));
        $this->assertTrue($postId > 0);
        $postTypeHelper->setupPost($postId);

        return $postId;
    }

    protected function assertPageLayoutWithHfs($postId) {
        update_post_meta($postId, '_vcv-page-template', 'header-footer-layout');

        $args = array(
            'p' => $postId,
        );
        $loop = new WP_Query($args);
        if ( $loop->have_posts() ) :
            while ( $loop->have_posts() ) : $loop->the_post();
                ob_start();
                get_header();
                $headerContent = ob_get_clean();

                $this->assertStringContainsString('This is header', $headerContent);

                ob_start();
                get_footer();
                $footerContent = ob_get_clean();

                $this->assertStringContainsString('This is footer', $footerContent);
            endwhile;
        endif;

        $this->assertTrue(true);
    }
}

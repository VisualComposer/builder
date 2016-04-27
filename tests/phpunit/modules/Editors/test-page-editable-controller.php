<?php

class PageEditableControllerTest extends WP_UnitTestCase
{
    /**
     * Test for some specific strings/patterns in generated output.
     */
    public function testBuildPageEditable()
    {
        /** @var $module \VisualComposer\Modules\Editors\PageEditable\Controller */
        $module = vcapp('EditorsPageEditableController');

        /** @var \VisualComposer\Helpers\Url $urlHelper */
        $urlHelper = vchelper('Url');

        // Create test post.
        $this->post = new WP_UnitTest_Factory_For_Post($this);
        $post_id = $this->post->create(array('post_title' => 'Test Post'));

        $module->buildPageEditable($urlHelper);

        global $post;
        $post = get_post($post_id);
        setup_postdata($post);
        ob_start();
        the_content();
        $output = ob_get_contents();
        ob_end_clean();
        wp_reset_postdata();

        $patterns = [
            '<script>',
            'function vcvLoadJsCssFile\( filename, filetype \) {',
            'vcvLoadJsCssFile\( \'http',
            '<div id="vcv-editor">Loading...<\/div>',
            '<\/script>',
        ];

        foreach ($patterns as $pattern) {
            $this->assertEquals(1, preg_match('/' . $pattern . '/', $output), 'Failed to find `' . $pattern . '` in generated output');
        }
    }

}

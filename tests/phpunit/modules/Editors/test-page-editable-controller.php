<?php

class PageEditableControllerTest extends WP_UnitTestCase
{
    protected $post = null;

    public function setUp()
    {
        // Create test post.
        $factory = new WP_UnitTest_Factory_For_Post($this);
        $post_id = $factory->create(['post_title' => 'Test Post']);
        $this->post = get_post($post_id);
        parent::setUp();
    }

    /**
     * Test for some specific strings/patterns in generated output.
     */
    public function testBuildPageEditable()
    {
        /** @var $module \VisualComposer\Modules\Editors\PageEditable\Controller */
        $module = vc_create_module_mock('\VisualComposer\Modules\Editors\PageEditable\Controller');

        vcapp()->call([$module, 'buildPageEditable']);

        global $post;
        $post = $this->post;
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
            $errorMessage = 'Failed to find `' . $pattern . '` in generated output: "' . $output . '"';
            $this->assertEquals(1, preg_match('/' . $pattern . '/', $output), $errorMessage);
        }
    }

    public function testTemplateRedirectAction()
    {
        /** @var \VisualComposer\Helpers\Request $requestHelper */
        $requestHelper = vchelper('Request');

        /** @var \VisualComposer\Helpers\Nonce $nonceHelper */
        $nonceHelper = vchelper('Nonce');

        $requestHelper->setData(
            [
                'vcv-editable' => 1,
                'vcv-nonce' => $nonceHelper->admin(),
            ]
        );

        $_SERVER['REQUEST_URI'] = '/';
        do_action('template_redirect');
        global $post;
        $post = get_post($this->post);
        setup_postdata($post); // This will trigger the_post action.

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
            $errorMessage = 'Failed to find `' . $pattern . '` in generated output: "' . $output . '"';
            $this->assertEquals(1, preg_match('/' . $pattern . '/', $output), $errorMessage);
        }
    }
}

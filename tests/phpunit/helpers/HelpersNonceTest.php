<?php

class HelpersNonceTest extends WP_UnitTestCase
{
    public function testNonceHelper()
    {
        /**
         * @var $helper VisualComposer\Helpers\Nonce
         */
        $helper = vcapp('VisualComposer\Helpers\Nonce');

        $this->assertTrue(is_object($helper), 'Nonce helper should be an object');
    }

    public function testVerifyPageEditableNonce() {
        $nonceHelper = vchelper('Nonce');

        // Emulate that nonce is "almost expired (second tick)"
        $callback = function() {
            return 10; // lifetime 10sec
        };
        add_filter('nonce_life', $callback);
        wp_set_current_user(1);
        $pageEditableNonce = $nonceHelper->pageEditable();

        $this->assertTrue($nonceHelper->verifyPageEditable($pageEditableNonce), 'check instant tick');

        sleep(3);
        $this->assertTrue($nonceHelper->verifyPageEditable($pageEditableNonce), 'check almost expired tick');

        remove_filter('nonce_life', $callback);
    }
}

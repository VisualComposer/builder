<?php

if (!defined('ABSPATH')) {
    die('-1');
}

?>
<div class="vc_resources-tab changelog">
    <div class="feature-section vc_row">
        <div class="vc_col-xs-6">
            <h3><?php
                echo __('Resources', 'vc5');
                ?></h3>

            <p><?php
                echo __(
                    'There are several resources available to Visual Composer users to help you to get around plugin:',
                    'vc5'
                );
                ?></p>

            <ul>
                <li>
                    <a href="http://vc.wpbakery.com/?utm_campaign=VCplugin&amp;utm_source=vc_user&amp;utm_medium=welcome_page"
                        target="_blank">
                        Official website
                    </a></li>
                <li><a href="http://bit.ly/vcomposer" target="_blank">Official sales point on CodeCanyon</a></li>
                <li><a href="http://kb.wpbakery.com" target="_blank">Official Knowledge Base</a></li>
                <li><a href="http://vc.wpbakery.com/video-academy/" target="_blank">Video Academy</a></li>
                <li><a href="http://support.wpbakery.com" target="_blank">Official support</a></li>
                <li><a href="http://facebook.com/VisualComposer.wpbakery" target="_blank">Facebook page</a></li>
                <li><a href="http://twitter.com/wpbakery" target="_blank">Twitter account</a></li>
            </ul>
        </div>

        <div class="vc_col-xs-6">
            <h3><?php echo __('Official Support', 'vc5') ?></h3>
            <p><?php
                printf(
                    __(
                        'To get your support related question answered in the fastest timing, please head over to our <a href="%s" target="_blank">support page</a> and open Support ticket. To open support ticket you should have account in the ticket system. Registration should take you couple of minutes to complete and is completely automatic process. Prepare your Visual Composer <a href="%s" target="_blank">Purchase code</a> and fill in "Create account in Ticket system" form located at <a href="%s" target="_blank">support page</a>, then follow on screen instructions.',
                        'vc5'
                    ),
                    'http://support.wpbakery.com',
                    'http://go.wpbakery.com/purchase-code',
                    'http://support.wpbakery.com'
                );
                ?></p>
            <p><?php
                printf(
                    __(
                        'Before applying for support please make sure you understand the rules of support and go through all steps described and listed in <a href="%s" target="_blank">Support Policy</a> in order to get your issues solved as soon as possible.',
                        'vc5'
                    ),
                    'http://go.wpbakery.com/support-policy'
                );
                ?></p>
        </div>
    </div>
</div>

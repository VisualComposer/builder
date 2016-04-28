<?php

if (!defined('ABSPATH')) {
    die('-1');
}
/** @var \VisualComposer\Helpers\Options $options */
$options = vchelper('Options');
/** @var \VisualComposer\Helpers\Url $url */
$url = vchelper('Url');
?>

<div class="vcv-settings-page-authorization">
    <a href="http://test.account.visualcomposer.io/authorization?response_type=code&client_id=<?php
    echo esc_attr(
        $options->get('site-id')
    );
    ?>&redirect_uri=<?php
    echo rawurlencode(
        $url->ajax(['vcv-action' => 'api'])
    );
    ?>&scope=user.read"
        class="button button-primary button-hero button-updater"
        data-vcv-action="authorization"
        type="button"
        id="vcv-settings-page-authorization-button"><?php echo __('Authorize Site', 'vc5'); ?></a>
</div>

<?php

if (!defined('ABSPATH')) {
    die('-1');
}

?>

<div class="vcv-settings-page-authorization">
    <a href="http://test.account.visualcomposer.io/authorization?response_type=code&client_id=pasha-test&redirect_uri=http%3A%2F%2Fwp-test.dev%2Fwp-content%2Fplugins%2Fvc-five%2Fajax.php%3Faction%3Dapi&scope=user.read"
        class="button button-primary button-hero button-updater"
        data-vcv-action="authorization"
        type="button"
        id="vcv-settings-page-authorization-button"><?php echo __('Authorize Site', 'vc5'); ?></a>
</div>

<?php

if (!defined('ABSPATH')) {
    die('-1');
}
/** @var \VisualComposer\Helpers\Options $options */
$options = vchelper('Options');

/** @var \VisualComposer\Helpers\Url $url */
$urlHelper = vchelper('Url');

$clientId = esc_attr($options->get('siteId'));
$redirectUrl = rawurlencode($urlHelper->ajax(['vcv-action' => 'api']));
$scope = 'user.read,elements.read';

$url = sprintf(
    '%s/authorization?response_type=code&client_id=%s&redirect_uri=%s&scope=%s',
    VCV_ACCOUNT_URL,
    $clientId,
    $redirectUrl,
    $scope
);

?>

<div class="vcv-settings-page-authorization">
    <a href="<?php echo $url ?>"
        class="button button-primary button-hero button-updater"
        data-vcv-action="authorization"
        type="button"
        id="vcv-settings-page-authorization-button"><?php echo __('Authorize Site', 'vc5') ?></a>
</div>

<?php

if (!defined('ABSPATH')) {
    die('-1');
}
/** @var \VisualComposer\Helpers\Options $options */
$options = vchelper('Options');

/** @var \VisualComposer\Helpers\Url $url */
$urlHelper = vchelper('Url');

$client_id = esc_attr($options->get('site-id'));
$redirect_url = rawurlencode($urlHelper->ajax(['vcv-action' => 'api']));
$scope = 'user.read,elements.read';

$url = sprintf(
    '%s/authorization?response_type=code&client_id=%s&redirect_uri=%s&scope=%s',
    VCV_ACCOUNT_URL,
    $client_id,
    $redirect_url,
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

<?php

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}
/** @var $controller \VisualComposer\Modules\Settings\Pages\Settings */
/** @var string $slug */
$iframeUrl = add_query_arg(['post_type' => $slug, 'vcv-dashboard-iframe' => true], admin_url('edit.php'));
?>

<iframe class="vcv-dashboard-section-custom-post-type-iframe" src="<?php echo esc_url(
    $iframeUrl
); ?>" onload="this.style.height=(this.contentWindow.document.body.scrollHeight + 20) + 'px';"></iframe>

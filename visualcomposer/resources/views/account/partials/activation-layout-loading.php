<?php
if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

/**
 * @var \VisualComposer\Modules\Account\Pages\ActivationPage $controller
 * @var array $page
 */
$expirationTime = get_option('_transient_timeout_vcv-' . VCV_VERSION . 'vcv:activation:request');
$expiresAfter = $expirationTime - time();
$expiresAfter = $expiresAfter < 0 ? 60 : $expiresAfter;

$errorMsg = sprintf(
    __('Activation already in process! Please wait %1$s seconds before you try again', 'vcwb'),
    $expiresAfter
);
$type = isset($page, $page['type']) ? $page['type'] : 'default';
?>
<div class="vcv-popup-container vcv-popup-container--hidden">
	<div class="vcv-popup-scroll-container">
		<div class="vcv-popup">
			<button class="vcv-popup-close-button"></button>
			<!-- Error block -->
			<div class="vcv-popup-error<?php echo $errorMsg ? ' vcv-popup-error--active' : ''; ?>">
				<span class="vcv-error-message"><?php echo $errorMsg ? esc_html($errorMsg) : ''; ?></span>
			</div>
		</div>
		<div class="vcv-hidden-helper"></div>
	</div>
</div>

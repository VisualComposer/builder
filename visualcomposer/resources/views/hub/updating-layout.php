<?php
if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}
/**
 * @var \VisualComposer\Modules\Account\Pages\ActivationPage $controller
 */
$optionsHelper = vchelper('Options');

$errorMsg = $optionsHelper->getTransient('hub:update:error');
if ($errorMsg) {
    $optionsHelper->deleteTransient('hub:update:error');
}

?>

<div class="vcv-popup-container vcv-loading-screen--active">
	<div class="vcv-popup-scroll-container">
		<div class="vcv-popup">
            <?php echo vcview(
                'hub/updating-content',
                [
                    'controller' => $controller,
                ]
            ); ?>
			<!-- Error block -->
			<div class="vcv-popup-error<?php echo $errorMsg ? ' vcv-popup-error--active' : ''; ?>">
				<span class="vcv-error-message"><?php echo $errorMsg ? $errorMsg : ''; ?></span>
			</div>
		</div>
		<div class="vcv-hidden-helper"></div>
	</div>
</div>
<div id="vcv-posts-update-wrapper"></div>

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
$optionsHelper = vchelper('Options');
$licenseHelper = vchelper('License');
$tokenHelper = vchelper('Token');

$errorMsg = $optionsHelper->getTransient('account:activation:error');
if ($errorMsg) {
    $optionsHelper->deleteTransient('account:activation:error');
}
$type = isset($page, $page['type']) ? $page['type'] : 'default';
?>
<script>
  window.ajaxurl = '<?php echo admin_url('admin-ajax.php', 'relative'); ?>';
    <?php if ($optionsHelper->getTransient('vcv:activation:request')) { ?>
    window.vcvActivationRequest = 1;
    <?php } ?>
    window.vcvActivationUrl = '<?php echo vchelper('Url')->adminAjax(
        ['vcv-action' => 'account:activation:adminNonce']
    ); ?>';
    window.vcvActionsUrl = '<?php echo vchelper('Url')->adminAjax(['vcv-action' => 'hub:action:adminNonce']); ?>';
    window.vcvActivationFinishedUrl = '<?php echo vchelper('Url')->adminAjax(
        ['vcv-action' => 'account:activation:finished:adminNonce']
    ); ?>';
  window.vcvPluginUrl = '<?php echo VCV_PLUGIN_URL; ?>';
  window.vcvPluginSourceUrl = '<?php echo VCV_PLUGIN_URL; ?>' + 'public/sources/';
  window.vcvNonce = '<?php echo vchelper('Nonce')->admin(); ?>';
    window.vcvActivationActivePage = '<?php echo $controller->getActivePage(); ?>';
    window.vcvActivationType = '<?php echo $type; ?>';
    window.vcvAjaxTime = <?php echo $_SERVER['REQUEST_TIME']; ?>;
    window.vcvAjaxUrl = '<?php echo vchelper('Url')->ajax(); ?>';
    window.vcvAdminAjaxUrl = '<?php echo vchelper('Url')->adminAjax(); ?>';
    window.vcvDashboardUrl = '<?php echo admin_url('index.php'); ?>';
    window.vcvErrorReportUrl = '<?php echo vchelper('Url')->adminAjax(
        ['vcv-action' => 'account:error:report:adminNonce']
    ); ?>';
    window.vcvElementsGlobalsUrl = '<?php echo vchelper('Url')->adminAjax(
        ['vcv-action' => 'elements:globalVariables:adminNonce']
    ); ?>';
    <?php
    if (vcvenv('VCV_ENV_EXTENSION_DOWNLOAD')) :
    ?>
    window.vcvUpdaterUrl = '<?php echo content_url() . '/' . VCV_PLUGIN_ASSETS_DIRNAME
        . '/editor/wpPostRebuild.bundle.js'; ?>';
    window.vcvVendorUrl = '<?php echo content_url() . '/' . VCV_PLUGIN_ASSETS_DIRNAME . '/editor/vendor.bundle.js'; ?>';
    <?php else : ?>
    window.vcvUpdaterUrl = '<?php echo vchelper('Url')->to('public/dist/wpPostRebuild.bundle.js'); ?>';
    window.vcvVendorUrl = '<?php echo vchelper('Url')->to('public/dist/vendor.bundle.js'); ?>';
    <?php endif; ?>
</script>
<?php
$extraOutput = vcfilter('vcv:backend:settings:extraOutput', []);
if (is_array($extraOutput)) {
    foreach ($extraOutput as $output) {
        echo $output;
    }
}

if ($optionsHelper->getTransient('vcv:activation:request')) {
    echo vcview(
        'account/partials/activation-layout-loading',
        [
            'controller' => $controller,
        ]
    );

    return;
}
?>
<div id="vcv-posts-update-wrapper"></div>
<div class="vcv-popup-container vcv-popup-container--hidden" style="opacity: 0;visibility: hidden">
	<div class="vcv-popup-scroll-container">
		<div class="vcv-popup">
            <?php if (!$tokenHelper->isSiteAuthorized() && 'account' === vcvenv('VCV_ENV_ADDONS_ID')
                && vcvenv(
                    'VCV_ENV_LICENSES'
                )) { ?>
				<!-- Back button -->
				<button class="vcv-popup-back-button">
					<span><?php echo __('Back', 'vcwb'); ?></span>
				</button>
            <?php } ?>
			<!-- Close button -->
			<button class="vcv-popup-close-button"></button>
            <?php
            echo vcview(
                'account/partials/activation-oops',
                [
                    'controller' => $controller,
                ]
            );
            ?>
            <?php
            echo vcview(
                'account/partials/activation-thank-you',
                [
                    'controller' => $controller,
                ]
            );
            ?>
            <?php
            if (vcvenv('VCV_ENV_LICENSES') && 'account' === vcvenv('VCV_ENV_ADDONS_ID')) {
                echo vcview(
                    'account/partials/activation-intro',
                    [
                        'controller' => $controller,
                    ]
                );
                if (!$licenseHelper->isActivated()) {
                    echo vcview(
                        'account/partials/activation-about',
                        [
                            'controller' => $controller,
                        ]
                    );
                    echo vcview(
                        'account/partials/activation-go-premium',
                        [
                            'controller' => $controller,
                        ]
                    );
                }
            }
            ?>
            <?php echo vcview(
                $type !== 'standalone' ? 'account/partials/activation-login'
                    : 'account/partials/activation-login-standalone',
                [
                    'controller' => $controller,
                ]
            ); ?>
            <?php echo vcview(
                'account/partials/activation-loading',
                [
                    'controller' => $controller,
                ]
            ); ?>
            <?php echo vcview(
                'account/partials/activation-slider',
                [
                    'controller' => $controller,
                ]
            ); ?>
            <?php echo vcview(
                'account/partials/activation-slider-go-premium',
                [
                    'controller' => $controller,
                ]
            ); ?>
			<!-- Error block -->
			<div class="vcv-popup-error vcv-popup-error-with-button<?php echo $errorMsg ? ' vcv-popup-error--active'
                : ''; ?>">
				<span class="vcv-error-message"><?php echo $errorMsg ? $errorMsg : ''; ?></span>
				<a href="#" data-vcv-send-error-report class="vcv-popup-button vcv-popup-form-submit vcv-popup-form-update">
					<span>
						<?php echo __('Send error report', 'vcwb'); ?>
					</span>
				</a>
			</div>
		</div>
		<div class="vcv-hidden-helper"></div>
	</div>
</div>

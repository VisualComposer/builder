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
$assetsHelper = vchelper('Assets');

$type = isset($page, $page['type']) ? $page['type'] : 'default';
// @codingStandardsIgnoreStart
?>
<script>
  window.ajaxurl = '<?php echo admin_url('admin-ajax.php', 'relative'); ?>';
    <?php if ($optionsHelper->getTransient('vcv:activation:request')) : ?>
  window.vcvActivationRequest = 1;
    <?php endif; ?>
  window.vcvActivationUrl = '<?php echo vchelper('Url')->adminAjax(['vcv-action' => 'account:activation:adminNonce']); ?>';
  window.vcvActionsUrl = '<?php echo vchelper('Url')->adminAjax(['vcv-action' => 'hub:action:adminNonce']); ?>';
  window.vcvActivationFinishedUrl = '<?php echo vchelper('Url')->adminAjax(['vcv-action' => 'account:activation:finished:adminNonce']); ?>';
  window.vcvPluginUrl = '<?php echo VCV_PLUGIN_URL; ?>';
  window.vcvPluginSourceUrl = '<?php echo VCV_PLUGIN_URL; ?>' + 'public/sources/';
  window.vcvNonce = '<?php echo vchelper('Nonce')->admin(); ?>';
  window.vcvActivationActivePage = '<?php echo esc_attr($controller->getActivePage()); ?>';
  window.vcvActivationType = '<?php echo esc_attr($type); ?>';
  window.vcvAjaxTime = <?php echo intval($_SERVER['REQUEST_TIME']); ?>;
  window.vcvAjaxUrl = '<?php echo vchelper('Url')->ajax(); ?>';
  window.vcvAdminAjaxUrl = '<?php echo vchelper('Url')->adminAjax(); ?>';
  window.vcvDashboardUrl = '<?php echo admin_url('index.php'); ?>';
  window.vcvErrorReportUrl = '<?php echo vchelper('Url')->adminAjax(['vcv-action' => 'account:error:report:adminNonce']); ?>';
  window.vcvElementsGlobalsUrl = '<?php echo vchelper('Url')->adminAjax(['vcv-action' => 'elements:globalVariables:adminNonce']); ?>';
    <?php if (vcvenv('VCV_ENV_EXTENSION_DOWNLOAD')) : ?>
  window.vcvUpdaterUrl = '<?php echo $assetsHelper->getAssetUrl('/editor/wpPostRebuild.bundle.js'); ?>';
  window.vcvVendorUrl = '<?php echo $assetsHelper->getAssetUrl('/editor/vendor.bundle.js'); ?>';
    <?php else : ?>
  window.vcvUpdaterUrl = '<?php echo vchelper('Url')->to('public/dist/wpPostRebuild.bundle.js'); ?>';
  window.vcvVendorUrl = '<?php echo vchelper('Url')->to('public/dist/vendor.bundle.js'); ?>';
    <?php endif; ?>
</script>
<?php
// @codingStandardsIgnoreEnd
$extraOutput = vcfilter('vcv:backend:settings:extraOutput', []);
if (is_array($extraOutput)) {
    foreach ($extraOutput as $output) {
        // @codingStandardsIgnoreLine
        echo $output;
    }
}

if ($optionsHelper->getTransient('vcv:activation:request')) {
    evcview(
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
                    <span><?php echo esc_html__('Back', 'vcwb'); ?></span>
                </button>
            <?php } ?>
            <!-- Close button -->
            <button class="vcv-popup-close-button"></button>
            <?php
            evcview(
                'account/partials/activation-oops',
                [
                    'controller' => $controller,
                ]
            );
            ?>
            <?php
            evcview(
                'account/partials/activation-thank-you',
                [
                    'controller' => $controller,
                ]
            );
            ?>
            <?php
            if (vcvenv('VCV_ENV_LICENSES') && 'account' === vcvenv('VCV_ENV_ADDONS_ID')) {
                evcview(
                    'account/partials/activation-intro',
                    [
                        'controller' => $controller,
                    ]
                );
                if (!$licenseHelper->isActivated()) {
                    evcview(
                        'account/partials/activation-about',
                        [
                            'controller' => $controller,
                        ]
                    );
                    evcview(
                        'account/partials/activation-go-premium',
                        [
                            'controller' => $controller,
                        ]
                    );
                }
            }
            ?>
            <?php evcview(
                $type !== 'standalone' ? 'account/partials/activation-login'
                    : 'account/partials/activation-login-standalone',
                [
                    'controller' => $controller,
                ]
            ); ?>
            <?php evcview(
                'account/partials/activation-loading',
                [
                    'controller' => $controller,
                ]
            ); ?>
            <?php evcview(
                'account/partials/activation-slider',
                [
                    'controller' => $controller,
                ]
            ); ?>
            <?php evcview(
                'account/partials/activation-slider-go-premium',
                [
                    'controller' => $controller,
                ]
            ); ?>
            <!-- Error block -->
            <div class="vcv-popup-error vcv-popup-error-with-button">
                <span class="vcv-error-message"></span>
                <a href="#" data-vcv-send-error-report class="vcv-popup-button vcv-popup-form-submit vcv-popup-form-update">
					<span>
						<?php echo esc_html__('Send error report', 'vcwb'); ?>
					</span>
                </a>
            </div>
        </div>
        <div class="vcv-hidden-helper"></div>
    </div>
</div>

<?php
/**
 * @var \VisualComposer\Modules\Account\Pages\ActivationPage $controller
 */
$optionsHelper = vchelper('Options');

$errorMsg = $optionsHelper->getTransient('account:activation:error');
if ($errorMsg) {
    $optionsHelper->deleteTransient('account:activation:error');
}
?>
<script>
  window.vcvAccountUrl = '<?php echo vchelper('Url')->ajax(['vcv-action' => 'account:activation:adminNonce']); ?>'
  window.vcvAdminNonce = '<?php echo vchelper('Nonce')->admin(); ?>'
</script>
<div class="vcv-popup-container vcv-first-screen--active">
    <div class="vcv-popup-scroll-container">
        <div class="vcv-popup">
            <!-- Back button -->
            <!--<button class="vcv-popup-back-button">
                <span><?php /*echo __('GO BACK'); */ ?></span>
            </button>-->
            <!-- Close button -->
            <button class="vcv-popup-close-button"></button>
            <?php echo vcview(
                'account/partials/activation-login',
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
            <!-- Error block -->
            <div class="vcv-popup-error<?php echo $errorMsg ? ' vcv-popup-error--active' : ''; ?>"><?php echo $errorMsg
                    ? $errorMsg : ''; ?></div>
        </div>
        <div class="vcv-hidden-helper"></div>
    </div>
</div>

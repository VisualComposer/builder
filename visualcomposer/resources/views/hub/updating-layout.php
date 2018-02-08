<?php
if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}
/**
 * @var \VisualComposer\Modules\Account\Pages\ActivationPage $controller
 */
?>

<div class="vcv-popup-container vcv-loading-screen--active">
    <div class="vcv-popup-scroll-container">
        <div class="vcv-popup">
            <?php evcview(
                'hub/updating-content',
                [
                    'controller' => $controller,
                ]
            ); ?>
            <!-- Error block -->
            <div class="vcv-popup-error">
                <span class="vcv-error-message"></span>
            </div>
        </div>
        <div class="vcv-hidden-helper"></div>
    </div>
</div>
<div id="vcv-posts-update-wrapper"></div>

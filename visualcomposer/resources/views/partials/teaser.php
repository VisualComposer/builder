<?php
if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}
/**
 * @var array[string#premiumTitle, string#premiumDescription, string#premiumButton] $page
 */

?>
<div class="vcv-premium-teaser-inner">
    <div class="vcv-premium-teaser-image"></div>
    <header class="vcv-premium-teaser-header">
        <h2 class="vcv-premium-teaser-heading"><?php echo $page['premiumTitle']; ?></h2>
    </header>
    <div class="vcv-premium-teaser-content">
        <p class="vcv-premium-teaser-text"><?php echo $page['premiumDescription']; ?></p>
    </div>
    <div class="vcv-download-addon-button-container">
        <?php if (vchelper('License')->isPremiumActivated()) : ?>
            <a class="vcv-premium-teaser-btn vcv-premium-teaser-download-addon-btn" data-vcv-action="download" data-vcv-action-bundle="<?php echo $page['premiumActionBundle']; ?>"><?php esc_html_e('Download Addon', 'visualcomposer'); ?></a>
        <?php else : ?>
            <a class="vcv-premium-teaser-btn" href="<?php echo $page['premiumUrl']; ?>" target="_blank" rel="noopener noreferrer"><?php esc_html_e('Go Premium', 'visualcomposer'); ?></a>
            <p class="vcv-premium-teaser-text">
                <?php esc_html_e('Already have a Premium license?', 'visualcomposer'); ?> <a href="http://localhost:8888/wp-one/wp-admin/admin.php?page=vcv-activate-license&vcv-ref=elements-addelement-hub-editor" target="_blank" rel="noopener noreferrer"><?php esc_html_e('Activate here', 'visualcomposer'); ?></a>
            </p>
        <?php endif; ?>
    </div>
</div>

<?php
if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

$premiumPage = vcapp('PremiumPagesPremium');
$getPremiumPage = vcapp('PremiumPagesGetPremium');
$activationPage = vcapp('AccountPagesActivationPage');
$utmHelper = vchelper('Utm');
$requestHelper = vchelper('Request');
$loginCategoryHelper = vchelper('LoginCategory');
$loginCategories = $loginCategoryHelper->all();

if ('nav-bar' === $requestHelper->input('vcv-ref')) {
    $utm = 'goPremiumNavBar';
} elseif ('plugins-page' === $requestHelper->input('vcv-ref')) {
    $utm = 'goPremiumPluginsPage';
} elseif ('logoFrontend' === $requestHelper->input('vcv-ref')) {
    $utm = 'feNavbarLinkLogo';
} elseif ('logoBackend' === $requestHelper->input('vcv-ref')) {
    $utm = 'beNavbarLinkLogo';
} elseif ($activationPage->getSlug() === $requestHelper->input('page')) {
    $utm = 'goPremiumDashboard';
} elseif ($getPremiumPage->getSlug() === $requestHelper->input('page')) {
    $utm = 'goPremiumWpMenuSidebar';
} else {
    $utm = 'goPremiumLostRef';
}

?>
<!-- About screen -->
<div class="vcv-popup-content vcv-popup-about-screen">
    <div class="vcv-logo">
        <svg width="67px" height="69px" viewBox="0 0 36 37" version="1.1" xmlns="http://www.w3.org/2000/svg">
            <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                <g id="01-Intro-Free" transform="translate(-683.000000, -185.000000)">
                    <g id="VC-Logo" transform="translate(683.000000, 185.000000)">
                        <polygon id="Fill-1" fill="#257CA0" points="17.982 21.662 17.989 37 8.999 31.837 8.999 21.499"></polygon>
                        <polyline id="Fill-5" fill="#74953D" points="17.71 5.977 26.694 6.139 26.708 21.494 17.71 21.315 17.71 5.977"></polyline>
                        <polyline id="Fill-4" fill="#2CA2CF" points="26.708 21.494 17.982 26.656 8.999 21.498 17.72 16.315 26.708 21.494"></polyline>
                        <polyline id="Fill-6" fill="#9AC753" points="35.42 5.972 26.694 11.135 17.71 5.977 26.432 0.793 35.42 5.972"></polyline>
                        <polygon id="Fill-8" fill="#A77E2D" points="8.984 6.145 8.998 21.499 0 16.32 0 5.98"></polygon>
                        <polyline id="Fill-9" fill="#F2AE3B" points="17.71 5.977 8.984 11.139 0 5.98 8.722 0.799 17.71 5.977"></polyline>
                    </g>
                </g>
            </g>
        </svg>
    </div>
    <div class="vcv-popup-heading">
        <?php echo esc_html__('Get Premium Elements, Templates, and Support.', 'vcwb'); ?>
    </div>
    <a href="<?php
    // @codingStandardsIgnoreLine
    echo $utmHelper->get($utm);
    ?>" class="vcv-purchase-premium vcv-popup-button" target="_blank"><?php echo esc_html__('About Premium', 'vcwb'); ?></a>
    <a href="#" class="vcv-activate-premium vcv-popup-button vcv-about-button-premium"><?php echo esc_html__('Activate Premium', 'vcwb'); ?></a>
    <span class="vcv-popup-slider-item-text"><?php echo esc_html__('Unlock the most powerful and simplest way to create a professional website for your business.', 'vcwb'); ?></span>
    <div class="vcv-popup-go-premium-container"></div>
</div>

<?php
if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

/** @var string $url */
/** @var string $title */
?>
<div class="vcv-popup-slider-item">
    <div class="vcv-popup-slider-item-inner">
        <img class="vcv-popup-slider-img" src="<?php echo esc_url($url); ?>" />
        <span class="vcv-popup-slider-item-text"><?php
            // @codingStandardsIgnoreLine
            echo $title;
            ?></span>
    </div>
</div>

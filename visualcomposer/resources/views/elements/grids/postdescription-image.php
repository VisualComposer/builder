<?php
if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}
/** @var $url string - url to image */
?>
<div class="vce-post-description--background-wrapper-box">
    <div class="vce-post-description--background-wrapper">
        <div class="vce-post-description--background" style="background-image: url(<?php echo $url; ?>);"></div>
    </div>
</div>

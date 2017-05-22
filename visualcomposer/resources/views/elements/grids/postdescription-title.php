<?php
if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}
/**
 * @var $permalink
 * @var $title
 */
?>
<div class="vce-post-description--title">
    <h3 itemprop="name">
        <a href="<?php echo $permalink; ?>"><?php echo $title; ?></a>
    </h3>
</div>

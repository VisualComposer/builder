<?php
if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

/**
 * @var $teaser
 */
?>
<div class="vce-post-description--excerpt" itemprop="description"><?php echo $teaser; ?></div>

<?php
if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}
/**
 * @var $classes
 * @var $title
 * @var $excerpt
 */
?>
<div class="vce-post-description--content <?php echo $classes; ?>">
    <?php echo $title; ?>
    <?php echo $excerpt; ?>
</div>

<?php
if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}
?>
<div class="vcv-dashboards-section-content" data-section="<?php echo $slug ?>">
    <?php
    echo $content;
    ?>
</div>

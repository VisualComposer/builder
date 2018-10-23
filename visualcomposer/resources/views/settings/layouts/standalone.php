<?php
if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

evcview('settings/partials/admin-nonce');

$extraOutput = vcfilter('vcv:frontend:update:head:extraOutput', []);
if (is_array($extraOutput)) {
    foreach ($extraOutput as $output) {
        // @codingStandardsIgnoreLine
        echo $output;
    }
    unset($output);
}
?>

<script>
  window.vcvAjaxUrl = '<?php echo vchelper('Url')->ajax(); ?>';
  window.vcvAdminAjaxUrl = '<?php echo vchelper('Url')->adminAjax(); ?>';
</script>
<div class="wrap vcv-settings">
    <?php
    // @codingStandardsIgnoreLine
    echo $content;
    ?>
</div>
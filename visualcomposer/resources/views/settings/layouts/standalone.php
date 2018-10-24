<?php
if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

evcview('settings/partials/admin-nonce');
if (vcvenv('VCV_FT_ACTIVATION_REDESIGN')) {
    $extraOutput = vcfilter('vcv:frontend:update:head:extraOutput', []);
    if (is_array($extraOutput)) {
        foreach ($extraOutput as $output) {
            // @codingStandardsIgnoreLine
            echo $output;
        }
        unset($output);
    }
    $variables = vcfilter('vcv:about:variables', []);
    if (is_array($variables)) {
        foreach ($variables as $variable) {
            if (is_array($variable) && isset($variable['key'], $variable['value'])) {
                $type = isset($variable['type']) ? $variable['type'] : 'variable';
                evcview('partials/variableTypes/' . $type, $variable);
            }
        }
        unset($variable);
    }
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
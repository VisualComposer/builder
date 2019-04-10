<?php
if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}
/** @var string $key */
/** @var mixed $value */
if (!isset($addScript)) {
    $addScript = true;
}

if ($addScript) : ?>
<script id="vcv-variable-<?php echo esc_attr(vchelper('Str')->slugify($key)); ?>">
    <?php endif; ?>
    // Write-able data
    // @codingStandardsIgnoreLine
    window.<?php echo esc_attr($key); ?> = <?php echo json_encode($value); ?>;
    <?php if ($addScript) : ?>
</script>
<?php endif;

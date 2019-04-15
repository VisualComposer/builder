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
        // Read-Only data
        if(typeof window['<?php echo esc_js($key); ?>'] === 'undefined') {
          Object.defineProperty(window, '<?php echo esc_js($key); ?>', {
            value: function () {
              return <?php
                // @codingStandardsIgnoreLine
                echo json_encode($value, isset($options) ? $options : 0);
                ?> },
            writable: false
          });
        }
        <?php if ($addScript) : ?>
    </script>
<?php endif;

<?php
if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}
$optionsHelper = vchelper('Options');
$time = time();
/** @var $elements array - list of elements & data */
foreach ($elements as $key => $element) :
    if (vcfilter('vcv:hub:output:elementBundle', true, ['element' => $key])) : ?>
        <script id="vcv-hub-element-<?php echo esc_attr($key); ?>" src="<?php
        // @codingStandardsIgnoreLine
        $version = vcvenv('VCV_DEBUG') ? esc_attr($time) : esc_attr($optionsHelper->get('hubAction:element/' . $key, VCV_VERSION));
        echo set_url_scheme($element['bundlePath']) . '?v=' . $version; ?>"></script>
        <?php
    endif;
endforeach;

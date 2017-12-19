<?php
if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}
/** @var $elements array - list of elements & data */
foreach ($elements as $key => $element) :
    if (vcfilter('vcv:hub:output:elementBundle', true, ['element' => $key])) :
    ?>
		<script id="vcv-hub-element-<?php echo esc_attr($key); ?>" src="<?php echo $element['bundlePath']; ?>?v=<?php echo time(); ?>"></script>
    <?php
    endif;
endforeach;

<?php
/** @var $elements array - list of elements & data */
foreach ($elements as $key => $element) :
    ?>
    <script id="vcv-hub-element-<?php echo esc_attr($key); ?>" src="<?php echo $element['bundlePath']; ?>"></script>
    <?php
endforeach;

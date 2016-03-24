<?php

if (!defined('ABSPATH')) {
    die('-1');
}

/** @var $controller \VisualComposer\Modules\Settings\Pages\Hub */
?>
<div class="vcv-settings-page-hub">
    <?php echo json_encode($controller->getDataFromHub()); ?>
</div>

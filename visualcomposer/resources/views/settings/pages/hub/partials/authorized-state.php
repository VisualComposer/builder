<?php

if (!defined('ABSPATH')) {
    die('-1');
}

/** @var $controller \VisualComposer\Modules\Settings\Pages\Hub */
?>
<div class="vcv-settings-page-hub">
    <?php
    /** @see \VisualComposer\Modules\Settings\Pages\Hub::getDataFromHub */
    $data = vcapp()->call([$controller, 'getDataFromHub']);
    vcview('settings/pages/hub/partials/list', ['items' => $data->data]);
    ?>
</div>

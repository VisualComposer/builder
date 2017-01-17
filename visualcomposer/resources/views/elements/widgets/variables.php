<?php
$wpWidgets = vchelper('WpWidgets');
$groups = $wpWidgets->allGrouped();
if (!empty($groups['wpWidgetsCustom'])) {
    $variables = $wpWidgets->getTemplateVariables([], $groups['wpWidgetsCustom']);
    echo sprintf('window.vcvCustomWidgets=%s;', json_encode($variables['widgets']));
}

if (!empty($groups['wpWidgetsDefault'])) {
    $variables = $wpWidgets->getTemplateVariables([], $groups['wpWidgetsDefault']);
    echo sprintf('window.vcvDefaultWidgets=%s;', json_encode($variables['widgets']));
}

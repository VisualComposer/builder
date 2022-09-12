<?php

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

// Get Active Tab
$activeTab = '';
$requestHelper = vchelper('Request');
if ($requestHelper->exists('page')) {
    $activeTab = esc_attr($requestHelper->input('page'));
}
$activeClass = $activeTab === $slug ? 'vcv-dashboards-section-content--active' : '';
$outputHelper = vchelper('Output');
?>

<div class="vcv-dashboards-section-content hub <?php echo esc_attr($activeClass); ?>" data-section="<?php echo esc_attr($slug); ?>">
    <?php
    $outputHelper->printNotEscaped($content);
    ?>
</div>

<?php
$extraOutput = vcfilter('vcv:frontend:hub:extraOutput', []);
if (is_array($extraOutput)) {
    foreach ($extraOutput as $output) {
        $outputHelper->printNotEscaped($output);
    }
    unset($output);
}

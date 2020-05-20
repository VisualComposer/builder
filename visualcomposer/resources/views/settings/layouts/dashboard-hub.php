<?php
if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

// Get Active Tab
$activeTab = '';
if (isset($_GET['page'])) {
    $activeTab = esc_attr($_GET['page']);
}
$activeClass = $activeTab === $slug ? 'vcv-dashboards-section-content--active' : '';
?>

<div class="vcv-dashboards-section-content hub <?php echo $activeClass ?>" data-section="<?php echo $slug ?>">
    <?php
    echo $content;
    ?>
</div>

<?php
$extraOutput = vcfilter('vcv:frontend:hub:extraOutput', []);
if (is_array($extraOutput)) {
    foreach ($extraOutput as $output) {
        // @codingStandardsIgnoreLine
        echo $output;
    }
    unset($output);
}

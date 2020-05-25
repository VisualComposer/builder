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
$pageTitle = empty($page['subTitle']) ? $page['title'] : $page['subTitle'];
?>
<div class="vcv-dashboards-section-content <?php echo $activeClass ?>" data-section="<?php echo $slug ?>">
    <?php
    if ($pageTitle && (!isset($page['hideTitle']) || !$page['hideTitle'])) {
        echo '<h1>' . $pageTitle . '</h1>';
    }
    echo $content;
    ?>
</div>

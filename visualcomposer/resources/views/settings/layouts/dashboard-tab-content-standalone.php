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
$pageDescription = empty($page['description']) ? '' : $page['description'];
?>
<div class="vcv-dashboards-section-content vcv-dashboards-section--standalone <?php echo $activeClass ?>" data-section="<?php echo $slug ?>">
    <?php
    if ($pageTitle) {
        echo '<h1 style="' . (isset($page['hideTitle']) && $page['hideTitle'] ? 'display:none;' : '') . '">' . $pageTitle . '</h1>';
    }
    if ($pageDescription) {
        echo '<p class="description">' . $pageDescription . '</p>';
    }
    echo $content;
    ?>
</div>

<?php
if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}
/**
 * @var array[string#premiumTitle, string#premiumDescription, string#premiumButton] $page
 * @var string $slug
 * @var string $pageTitle
 */

// Get Active Tab
$activeTab = esc_attr(vchelper('Request')->input('page', ''));
$activeClass = $activeTab === $slug ? 'vcv-dashboards-section-content--active' : '';
$pageTitle = empty($page['subTitle']) ? $page['name'] : $page['subTitle'];
?>
<div class="vcv-dashboards-section-content <?php echo $activeClass; ?>" data-section="<?php echo $slug; ?>">
    <?php
    if ($pageTitle) {
        echo '<h1 style="' . (isset($page['hideTitle']) && $page['hideTitle'] ? 'display:none;' : '') . '">' . $pageTitle . '</h1>';
    }
    echo vcview(
        'partials/teaser',
        [
            'page' => $page,
        ]
    );
    ?>
</div>


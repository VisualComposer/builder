<?php
if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}
/**
 * @see \VisualComposer\Modules\Elements\Grids\PostsGridPagination
 * @var $payload array
 * @var $tag integer
 */
$id = $payload['atts']['unique_id'];

$page = (int)$tag['current_page'];
$adjacents = 1;
$limit = (int)$tag['per_page'];
$lastPage = (int)$tag['total_pages'];

$pagination = '';
$paginationHelper = vchelper('PostsGridPagination');

$urlTemplate = '<a href="%s" class="vce-posts-grid-pagination-item%s">%d</a>';
$ellipsisTemplate = '<span class="vce-posts-grid-pagination-rest-items">...</span>';
if ($lastPage > 1) {
    if ($lastPage < 7) {
        foreach (range(1, $lastPage) as $num) {
            $pagination .= sprintf(
                $urlTemplate,
                $paginationHelper->getPaginationUrl($id, $num),
                $num == $page ? ' vce-state--active' : '',
                $num
            );
        }
    } else {
        if ($page < 5) {
            foreach (range(1, 5) as $num) {
                $pagination .= sprintf(
                    $urlTemplate,
                    $paginationHelper->getPaginationUrl($id, $num),
                    $num == $page ? ' vce-state--active' : '',
                    $num
                );
            }
            $pagination .= $ellipsisTemplate;
            $pagination .= sprintf(
                $urlTemplate,
                $paginationHelper->getPaginationUrl($id, $lastPage),
                '',
                $lastPage
            );
        } elseif ($lastPage - 2 > $page && $page >= 5) {
            $pagination .= sprintf(
                $urlTemplate,
                $paginationHelper->getPaginationUrl($id, 1),
                '',
                1
            );
            $pagination .= $ellipsisTemplate;

            for ($num = $page - $adjacents; $num <= $page + $adjacents; $num++) {
                $pagination .= sprintf(
                    $urlTemplate,
                    $paginationHelper->getPaginationUrl($id, $num),
                    $num == $page ? ' vce-state--active' : '',
                    $num
                );
            }
            $pagination .= $ellipsisTemplate;
            $pagination .= sprintf(
                $urlTemplate,
                $paginationHelper->getPaginationUrl($id, $lastPage),
                '',
                $lastPage
            );
        } else {
            $pagination .= sprintf(
                $urlTemplate,
                $paginationHelper->getPaginationUrl($id, 1),
                '',
                1
            );
            $pagination .= $ellipsisTemplate;
            for ($num = $lastPage - (1 + ($adjacents * 3)); $num <= $lastPage; $num++) {
                $pagination .= sprintf(
                    $urlTemplate,
                    $paginationHelper->getPaginationUrl($id, $num),
                    $num == $page ? ' vce-state--active' : '',
                    $num
                );
            }
        }
    }
}
?>
<div class="vce-posts-grid-pagination">
    <?php echo $pagination; ?>
</div>
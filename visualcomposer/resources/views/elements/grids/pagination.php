<?php
/**
 * @see \VisualComposer\Modules\Elements\Grids\PostsGridPagination
 * @var $payload array
 */
$id = $payload['atts']['unique_id'];
?>
<div class="vce-posts-grids-pagination <?php echo $payload['atts']['pagination_color']; ?>">
    <a href="#<?php echo $id; ?>">1</a>
    <a href="#<?php echo $id; ?>">2</a>
    <a href="#<?php echo $id; ?>">3</a>
    <a href="#<?php echo $id; ?>">4</a>
    <a href="#<?php echo $id; ?>">...</a>
    <a href="#<?php echo $id; ?>">8</a>
</div>
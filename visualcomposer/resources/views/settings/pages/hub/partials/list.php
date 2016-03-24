<?php
/** @var $items array - list of items */

?>
<ul class="elements-list">
    <?php foreach ($items as $item) : ?>
        <li class="element">
            <div class="media">
                <div class="media-img">
                    <img src="<?php echo $item->thumbnail->small; ?>" width="42" heigh="42" alt=""/>
                </div>
                <div class="media-body">
                    <div class="element-title">
                        <div><?php echo $item->title; ?></div>
                    </div>
                    <div class="element-meta">
                        <div>by <?php echo $item->user->name; ?></div>
                        <div>in <?php echo $item->category->title; ?></div>
                    </div>
                </div>
            </div>
        </li>
    <?php endforeach; ?>
</ul>
<?php
/** @var $items array - list of items */

?>
<style>
    .media {
        display: flex;
        align-items: flex-start;
    }

    .media-img {
        margin-right: 1em;
    }

    .media-body {
        flex: 1;
    }

    .elements-list {
        list-style: none;
        overflow: hidden;
        padding: 0;
    }

    .element {
        background-color: #e4e4e4;
        border-radius: 3px;
        margin-bottom: 8px;
        line-height: 1.2;
        margin-right: 1%;
        padding: 5px;
        float: left;
        width: 24%;
    }

    .element-title {
        margin-bottom: 5px;
        overflow: hidden;
        height: 35px;
    }

    .element-meta {
        font-size: 12px;
    }
</style>
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
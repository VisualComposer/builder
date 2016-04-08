<?php

if (!defined('ABSPATH')) {
    die('-1');
}

?>
<div class="vcv-settings-page-hub">
    <script>
        window.vcv_api = {
            token: "<?php echo vcapp()->call([vchelper('Token'), 'getToken']); ?>"
        };
    </script>
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

    <script type="text/template" id="vcv-elements-template">
        <ul class="elements-list">
            <% _.each(items, function(item){ %>
            <li class="element">
                <div class="media">
                    <div class="media-img">
                        <img src="<%= item.thumbnail.small %>" width="42" heigh="42" alt=""/>
                    </div>
                    <div class="media-body">
                        <div class="element-title">
                            <div><%= item.title %></div>
                        </div>
                        <div class="element-meta">
                            <div>by <%= item.user.name %></div>
                            <div>in <%= item.category.title %></div>
                        </div>
                    </div>
                </div>
            </li>
            <% }); %>
        </ul>
    </script>
    <?php
    /** @var \VisualComposer\Helpers\Url $urlHelper */
    $urlHelper = vchelper('Url');
    wp_enqueue_script('vcv:hub-js', $urlHelper->assetUrl('scripts/hub.js'));

    ?>
    <div id="vcv-hub-content">Loading...</div>
</div>

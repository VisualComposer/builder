<?php

namespace VisualComposer\Modules\Editors\Backend;

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Traits\EventsFilters;

class BackendController extends Container implements Module
{
    use EventsFilters;

    public function __construct()
    {
        $this->addFilter('vcv:editors:backend:addMetabox', 'checkPostType');
        $this->addFilter('vcv:editors:backend:addMetabox', 'checkToggleFeature');
    }

    public function checkPostType($status, $payload)
    {
        return $status && post_type_supports($payload['postType'], 'editor');
    }

    public function checkToggleFeature($status, $payload)
    {
        return $status && true;
    }
}

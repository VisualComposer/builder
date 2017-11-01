<?php

namespace VisualComposer\Modules\Editors\Backend;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Traits\EventsFilters;

class BackendController extends Container implements Module
{
    use EventsFilters;

    public function __construct()
    {
        /** @see \VisualComposer\Modules\Editors\Backend\BackendController::checkPostType */
        $this->addFilter('vcv:editors:backend:addMetabox', 'checkPostType');
        /** @see \VisualComposer\Modules\Editors\Backend\BackendController::checkToggleFeature */
        $this->addFilter('vcv:editors:backend:addMetabox', 'checkToggleFeature');
    }

    protected function checkPostType($status, $payload)
    {
        return intval(get_option('page_for_posts')) !== get_the_ID() && $status && post_type_supports($payload['postType'], 'editor');
    }

    protected function checkToggleFeature($status, $payload)
    {
        return $status && true;
    }
}

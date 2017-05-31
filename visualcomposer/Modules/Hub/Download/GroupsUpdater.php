<?php

namespace VisualComposer\Modules\Hub\Download;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Differ;
use VisualComposer\Helpers\Traits\EventsFilters;

class GroupsUpdater extends Container implements Module
{
    use EventsFilters;

    public function __construct()
    {
        /** @see \VisualComposer\Modules\Hub\Download\GroupsUpdater::updateGroups */
        $this->addFilter('vcv:hub:download:bundle', 'updateGroups');
    }

    protected function updateGroups($response, $payload)
    {
        $bundleJson = $payload['archive'];
        if (!$response || is_wp_error($bundleJson)) {
            return false;
        }
        $hubHelper = vchelper('HubGroups');
        /** @var Differ $groupsDiffer */
        $hubGroups = $hubHelper->getGroups();

        $groupsDiffer = vchelper('Differ');
        if (!empty($hubGroups)) {
            $groupsDiffer->set($hubGroups);
        }

        $groupsDiffer->onUpdate(
            [$hubHelper, 'updateGroup']
        )->set(
            $bundleJson['groups']
        );
        $hubHelper->setGroups($groupsDiffer->get());

        return true;
    }
}

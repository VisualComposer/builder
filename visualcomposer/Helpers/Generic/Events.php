<?php
namespace VisualComposer\Helpers\Generic;

class Events
{
    public function getEventManager()
    {
        return vcapp('events');
    }
}

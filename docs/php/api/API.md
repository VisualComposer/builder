#API
Plugin/Helpers/Module API

##WordPress Filters and Actions usage:
- All filters and actions __MUST__ use `vc:v:` prefix
- Prefer to use Inner __EVENTS__ manager to trigger/listen actions


##Inner Events usage
- $eventManager can be accessed by `vcapp('eventsHelper')` or
- `\VisualComposer\Framework\Illuminate\Contracts\Dispatcher $eventManager` have methods `listen` and `fire`
	- Use inner events manager for inner Modules
	- This events CAN be used by 3rd plugins
- Example by using DI:

		use \VisualComposer\Framework\Illuminate\Contracts\Dispatcher;
		....
	    public function __construct(Dispatcher $event)
        {
            $this->event = $event;
    
            $this->event->listen(
                'vc:v:postAjax:setPostData',
                function ($data) {
                }
            );
            $someData = [ 'data' => 'hello!' ];
            $this->event->fire('vc:v:myModules:init', $someData);
        }
        
- By Using `vcapp()`:

	    public function __construct()
        {
            $this->event = vcapp('eventsHelper'); // vcapp('\VisualComposer\Framework\Illuminate\Contracts\Dispatcher');
    
            $this->event->listen(
                'vc:v:postAjax:setPostData',
                function ($data) {
                }
            );
            $someData = [ 'data' => 'hello!' ];
            $this->event->fire('vc:v:myModules:init', $someData);
        }

##Modules API
- Any module can be retreived by `vcapp(moduleName)`
- Public function can be called directly (Note: this will not call method injection)
- Or by using `$this->call([vcapp(moduleName),'methodName'], $args=[]);` This is more __prefered__ way because this also 
	will inject method dependencies
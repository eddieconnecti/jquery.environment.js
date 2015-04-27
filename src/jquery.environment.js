/*!
 * jQuery Environment
 * Copyright 2015 K. Feldmaier (eddieconnecti@googlemail.com)
 * Licensed under MIT (http://opensource.org/licenses/MIT)
 */

 (function($) {		 
	var Environment = function(element, options)
	{
		var __e = $(element);
		var __o = this;
					
		/**
		 * @private
		 * Settings NS 
		 */
		var __s = $.extend({
						development: {
							flag: true,
							explicit: false,
							uri: 'http://dev.mydomain.com',
							links: {
								'a#mylink':'http://dev.mydomain.com/home'
							},
							hidden: null
						},
						review: {
							flag: true,
							explicit: false,
							uri: 'http://rvw.mydomain.com',
							links: {
								'a#mylink':'http://rvw.mydomain.com/home'
							},
							hidden: null
						},
						productive: {
							flag: false,
							explicit: false,
							uri: null,
							links: null,
							hidden: null
						}
					}, options || {});
					
		/**
		 * @private
		 * Class Variables NS 
		 */
		var __c = {
			devtools: false,
			environment: null,
			prev_environment: null,
			flag: null
		};

		/*
		 * Change the current environment to match the 
		 * given key
		 */
		this.setEnvironment = function(key)
		{
			if (!__s.hasOwnProperty(key) || __c.environment == key)
				return;

			__c.prev_environment = __c.environment;
			__c.environment = key;

			if (__c.prev_environment)
			{
				__updateLinks(__c.prev_environment, false);
				__updateHidden(__c.prev_environment, false);
			}

			__updateLinks(__c.environment, true);
			__updateHidden(__c.environment, true);

			__showFlag(__s[__c.environment].flag);

		}

		/*
		 * 
		 */
		this.setDevtools = function (active) 
		{  
			if (active == __c.devtools)
				return;

			__c.devtools = active;

			if (__c.environment && __s[__c.environment])
				__showFlag(__s[__c.environment].flag);
		}

		/*
		 * Setup an explicit environment.
		 */
		this.setExplicitEnvironment = function (key) 
		{
			var env = __getExplicitEnvironment();
			if (key == env)
				return;

			if (__s.hasOwnProperty(env))
				__s[env].explicit = false;

			if (__s.hasOwnProperty(key))
			{
				__s[key].explicit = true;
				__o.setEnvironment(key);
			}
		}

		/*
		 * Update selectors configured as "hidden"
		 */
		var __updateHidden = function(environment, current)
		{
			if (!environment || !__s.hasOwnProperty(environment) || !__s[environment].hidden || !$.isArray(__s[environment].hidden))
				return;

			for (var i=0; i < __s[environment].hidden.length; i++)
			{
				var e = __e.find(__s[environment].hidden[i]);
				if (e && e.length)
				{
					if (current)
					{
						e.each(function(){
							$(this).data('prev-hidden', $(this).is(':hidden'));
							$(this).hide();
						});
					} else {
						e.each(function(){
							if (!$(this).data('prev-hidden'))
								$(this).show();

							$(this).removeData('prev-hidden');
						});
					}
				}
					
			}
		}

		/*
		 * Update selectors configured as "links"
		 */
		var __updateLinks = function(environment, current)
		{
			if (!environment || !__s.hasOwnProperty(environment) || !__s[environment].links)
				return;

			for (var selector in __s[environment].links)
			{
				if (current)
				{
					__e.find(selector).each(function(){
						$(this).data('prev-href', $(this).attr('href'));
						$(this).attr('href', __s[environment].links[selector]);
					});

				} else {
					__e.find(selector).each(function(){
						$(this).attr('href', $(this).data('prev-href'));
						$(this).data('prev-href', null);
					});
				}					
			}

		}

		/*
		 * Show/hide the status box in the upper right corner
		 */
		var __showFlag = function(show)
		{
			if (!__c.devtools)
				return;

			if (!__c.flag)
			{
				var styles = [
					'<style>',
					'  .environment-flag {',
					'    background: #ff0000;',
					'    color: #fff;',

					'    position: fixed;',
					'    top: 2%;',
					'    padding: 6px;',
					'    right: 2%;',
					'    z-index: 5000;',
					'    -webkit-box-shadow: 2px 4px 16px -2px rgba(0,0,0,0.75);',
					'    -moz-box-shadow: 2px 4px 16px -2px rgba(0,0,0,0.75);',
					'    box-shadow: 2px 4px 16px -2px rgba(0,0,0,0.75);',
					'    border-radius: 5px;',
					'    -moz-border-radius: 5px;',
					'    -webkit-border-radius: 5px; ',
					'    border: 1px solid #ff4040;',					
					'  }',
					'  .environment-flag .body {',
					'    text-transform: capitalize;',
					'    text-shadow: 0 0 2px #910000;',
					'  }',
					'  .environment-flag .footer {',
					'    color: #910000;',
					'    padding-top: 6px;',
					'  }',
					'  .environment-flag .footer a {',
					'    background: #ff4040;',
					'    color: #910000;',
					'    font-size: 9px;',
					'    padding: 2px;',
					'    text-transform: capitalize;',
					'  }',
					'  .environment-flag .footer a:hover {',
					'    background: #910000;',
					'    color: #ff4040;',
					'  }',
					'</style>'
				].join('\n');
				__e.append($(styles));
				__c.flag = $('<div class="environment-flag"><div class="body"></div><div class="footer"></div></div>');
				__c.flag.appendTo(__e);
			}

			var links, env;

			__c.flag.find('.body').text(__c.environment ? __capitalizeFirstLetter(__c.environment) : '').attr('title', __c.environment ? 'Panel defined by jquery.environment Plugin' : '');

			links = [];
			for (env in __s)
			{
				if (env == __c.environment)
					continue;

				links.push('<a href="#" data-environment="'+env+'" title="Change current Environment to '+__capitalizeFirstLetter(env)+'">'+__capitalizeFirstLetter(env)+'</a>');
			}

			__c.flag.find('.footer').html(links.join(' | '));

			__c.flag.find('a').on('click', function(event){
				event.preventDefault();
				if ($(this).attr('data-environment'))
					__o.setExplicitEnvironment($(this).attr('data-environment'));
			});

			if (show)
			{
				__c.flag.show();
			} else {
				__c.flag.hide();
			}
		}

		/*
		 * @private
		 */
		var __capitalizeFirstLetter = function(string) 
		{
    		return string.charAt(0).toUpperCase() + string.slice(1);
		}

		/*
		 * Find the current environment by comparing window location and 
		 * the uri of each environment setting.
		 */
		var __autoDetectEnvironment = function()
		{
			var env = __getExplicitEnvironment();
			if (env)
				return env;

			var location = window.location.toString().toLowerCase();
			for (env in __s)
			{
				if (__s[env].uri && location.indexOf(__s[env].uri.toLowerCase()) > -1)
					return env;
			}

			return null;
		}
		
		/*
		 * Find the current environment by comparing window location and 
		 * the uri of each environment setting.
		 */
		var __getExplicitEnvironment = function()
		{
			for (var env in __s)
			{
				if (__s[env].explicit)
					return env;
			}
			return null;
		}

		/**
		 *  Constructor
		 */
		var __construct = function()
		{
			setInterval(function (plugin) 
			{
				var threshold = 160;
				if ((window.Firebug && window.Firebug.chrome && window.Firebug.chrome.isInitialized) || window.outerWidth - window.innerWidth > threshold || window.outerHeight - window.innerHeight > threshold) {
					plugin.setDevtools(true);
				} else {
					plugin.setDevtools(false);
				}
			}, 500, __o);

			if (environment = __autoDetectEnvironment())
			{
				__o.setEnvironment(environment);
			} else {
				__o.setEnvironment('productive');
			}
		}
		
		/**
		 *  @private
		 */
		var __debug = function () 
		{
			if (window.console && window.console.log)
				window.console.log(arguments);
		};
		
		__construct();

	};

	$.environment = function (options)
	{
		return $('body').each(function()
		{
			var e = $(this);
			if (e.data('environmentPlugin')) 
				return;
			var environmentPlugin = new Environment(this, options);
			e.data('environmentPlugin', environmentPlugin);
		});
	};
	
})(jQuery);

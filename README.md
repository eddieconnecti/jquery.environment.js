# jquery.environment.js
Environment JavaScript Injector

## Installation

Include the script *after* the jQuery library

```html
<script src="/path/to/jquery.environment.js"></script>
```

## Usage

Initialize the plugin and put the code inside the jQuery document.ready callback like here:

```javascript
$(function(){        
    $.environment({
        development:{
            flag: true,
            explicit: false,
            uri: 'dev.mysite.com',
            links: {
                'a.home-link':          'http://dev.mysite.com/',
                'a.sitemap-link':       'http://dev.mysite.com/sitemap.html'
            },
            hidden: [
                'a.faq-link',
                'a.newsletter-link'
            ]
        },
        productive:{
            flag: false,
            explicit: false,
            uri: 'mysite.com',
            links: {
                'a.home-link':          'http://mysite.com/',
                'a.sitemap-link':       'http://mysite.com/sitemap.html'
            }
        }         
    });
});
```

## Supported Environments

The Plugin supports the three most common environments when developing web applications:
- Development
- Review
- Productive

Each environment is already pre-configured and all you have to do is overwrite their settings.

## Environment Configuration

To configure an environment for usage in your application, the following options can be used:

### flag
Shows/Hides the status block in the upper right corner of the browser window. The flag also displays links to other configured environments which allows switching without reloading the page.

### explicit


### uri 

Identificator for the environment. Compared to the current url of the window.

### links

A collection of key-value pairs, where key describes an Selector for a Link Element and the value contains the Link value for the href attribute.

### hidden

A simple array of selectors to DOM Elements which have to be hidden in the current Environment.

## Authors

[K. Feldmaier](https://github.com/eddieconnecti)

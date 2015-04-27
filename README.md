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

## Authors

[K. Feldmaier](https://github.com/eddieconnecti)

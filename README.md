pat-packery
===========

This is a simple Patternslib plugin for [packery](http://packery.metafizzy.co/).

If you want to use this pattern stand-alone you will need to build the
pat-packery mini-bundle. You will need to have [nodejs](http://nodejs.org)
installed to do this. Just run these commands:

```
npm install
gulp bower
gulp
```

This will create a ``dist/pat-packery.js`` file you can include in your HTML
files in addition to the standard Patterns bundle:

```html
<script type="text/javascript" charset="utf-8" src="patterns.js"></script>
<script type="text/javascript" charset="utf-8" src="pat-packery.js"></script>
```



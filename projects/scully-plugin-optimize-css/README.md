# Scully Plugin Optimize CSS

This plugin optimizes the CSS in the following way:

- Takes only the CSS required to render the static page and puts it in an inline style element
- Defers any existing application CSS files using the google lighthouse recommended way.
- I also add a noscript alternative for when there is no javascript.

installing:
```
npm install scully-plugin-optimize-css --save-dev
```

```javascript
const { OptimizeCSSPlugin } = required('scully-plugin-optimize-css');

exports.config = {
    projectRoot: './src/app',
    defaultPostRenderers: [
        OptimizeCSSPlugin
    ]
    routes: [
        ...
    ],
    
}
```

# PEACE Dashboard

*Web-based interactive dashboard for process engine benchmarks*

## Working with gulp

First install Gulp globally using `npm install -g gulp`

Run `npm install` to install all dependencies.

After installing all dependencies, run `npm start` or `gulp` which will start the default task

### Tasks
- default: Runs the following taks: styles, templates, browser-sync, watch
- browser-sync: Tests the website on a local server running on http://localhost:3000/
- scripts: Concats all `./src/*.js` files into a compressed/uncompresed javascript file stored in `./js/peace.js`
- styles: Compiles all sass files in `./sass/*.css` and merges them into `css/main.css`
- templates: Precompiles handlebars' template files  `./templates/*.hbs` and stores them `./js/templates.js`  
- watch: Runs a specific task whenever a css, js, or template file has changed


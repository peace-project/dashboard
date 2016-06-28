# PEACE Dashboard

*Web-based interactive dashboard for process engine benchmarks*

## Working with gulp

First install Gulp globally using `npm install -g gulp`

Run `npm install` to install all dependencies.

After installing all dependencies, run `npm start` or `gulp` which will start the default task

### Tasks
- default: Runs the build and test task
- build: Runs the following tasks: clean, pages, libs, styles, templates and scripts 
- test: Tests the website on a local server running on http://localhost:3000/
- clean: Removes all files in the `dist` folder
- pages: Moves static HTML pages to the `dist`  folder
- libs:
- templates: 
- scripts
- scripts: Concats all `./src/*.js` files into a compressed/uncompresed javascript file stored in `./dist/js/peace.js`
- styles: Compiles all sass files in `./sass/*.css` and merges them into `-/dist/css/peace.css`
- templates: Precompiles handlebars' template files  `./templates/*.hbs` and stores them `./dist/js/peacetpl.js`  
- watch: Runs a specific task whenever a css, js, or template file has changed


export default {
    entry: 'src/js/index.js',
    dest: 'dist/js/peace.js',
    format: 'iife',
    plugins: [ babel() ],
    sourceMap: 'inline',
};
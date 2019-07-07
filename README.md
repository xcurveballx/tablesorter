# Tablesorter

**TableSorter** is a jQuery plugin to sort tabular data in the web UI. It requires jQuery and consists of 3 cornerstones - markup, styles and javascript. While styles and javascript parts are provided out of the box, making the right markup is of plugin users' concern. More on this below.

It can sort table's content as a whole by some (all, if you wish) columns values in ASC or DESC order. Also you can divide all the rows into groups and rows will be sorted within those groups.

## How to import?

Use `npm i @curveballerpacks/tablesorter` to install the package. To include the plugin in your bundles:

- The Sass preprocessor is used for styles. The source file can be imported into your styles via `@import '@curveballerpacks/tablesorter/src/sass/tablesorter'` and then processed and bundled into your styles. It is worth mentioning that you should set the path for your bundler. For example, for `gulp-sass` it might look like:
```js
...
.pipe(sass({
              outputStyle: 'compressed',
              includePaths: ['node_modules']
           }).on('error', sass.logError))
...
```
or just indicate the full path inside sass `@import` statement.

- Tablesorter makes use of Node's modules. It requires its only dependency - jQuery - and can be required itself in your script via `require("@curveballerpacks/tablesorter");` NPM will manage possible duplicates/conflicts of jQuery versions in its dependency graph mostly on its own.

## Usage

The table itself must have `tablesorter` class. The control row (`<tr>` with `<th>`-s) should have `tsTitles` class (customizable via settings) and the data should be placed inside `<tbody>` with `tsGroup` class (customizable via settings). In this simple case the 1st and 8st columns of the table will become "sortable" with indicated initial sorting order. In other words, after clicking, for example, on the 1st column's header the table rows will be sorted by the 1st column values in the given order (desc).

```js
$("table.example1").tablesorter({tablesorterColumns: [{col: 0, order: 'desc'}, {col: 7, order: 'asc'}]});
```

## Settings

Besides `tablesorterColumns`, it is possible, as mentioned above, to pass into the plugin `tablesorterTitlesClass` (defaults to 'tsTitles') and  `tablesorterGroupsClass` (defaults to 'tsGroup') settings with corresponding changes in the page markup.

## More examples

Examples in action and more detailed explanation can be found on [codepen](https://codepen.io/curveball/full/yxewyO) or [example page](../example.html) inside this package.

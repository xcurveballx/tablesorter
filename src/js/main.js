var $ = require("jquery");

require("./tablesorter.js");

$(document).ready(function() {
    $("table.example1").tablesorter({
      tablesorterColumns: [{col: 0, order: 'desc'}, {col: 7, order: 'asc'}]
    });

    $("table.example2").tablesorter({
      tablesorterColumns: [{col: 0, order: 'desc'}, {col: 1, order: 'desc'}]
    });
});


/**
 * tablesorter.js
 * Simple jquery plugin to sort tabular data.
 *
 * @license The MIT License, https://github.com/xcurveballx/tablesorter/blob/master/LICENSE
 * @version 1.0
 * @author  xcurveballx, https://github.com/xcurveballx
 * @updated 2017-08-08
 * @link    https://github.com/xcurveballx/tablesorter
 *
 */
(function($, window, document, undefined) {
    "use strict";
    $.fn._init = $.fn.init
    $.fn.init = function(selector, context, root) {
        return (typeof selector === 'string') ? new $.fn._init(selector, context, root).data('selector', selector) : new $.fn._init(selector, context, root);
    };
    $.fn.getSelector = function() {
        return $(this).data('selector');
    };
    $.fn.tablesorter = function(options) {
      var settings = {
        tablesorterTitlesClass: 'tsTitles',
        tablesorterGroupsClass: 'tsGroup',
        tablesorterColumns: []
      },
      settings = $.extend(true, {}, settings, options);
      var selector = $(this).getSelector(),
          ths = " ." + settings.tablesorterTitlesClass,
          trs = " ." + settings.tablesorterGroupsClass,
          busy = false;

      (function() {
        if(settings.tablesorterColumns.length === 0) return;
        var cells = $(selector + ths)[0].cells;
        for(var i = 0; i < settings.tablesorterColumns.length; i++) {
          $(cells[settings.tablesorterColumns[i].col]).addClass('sortable').data('sortOrder', settings.tablesorterColumns[i].order);
        }
        $("body").on( "click", selector + ths, function(event) {
          init(event);
        });
      })();

      function init(event) {
        if(busy || !$(event.target).hasClass('sortable')) return;
        toggleBusy();
        var index = getColIndex($(event.target)[0]),
            type = getValuesType(index);
        if(index === null || (type !== 'number' && type !== 'string')) return;
        var rows = $(selector + trs + " tr");
        $(event.target).removeClass($(event.target).data("sortOrder") === 'asc' ? 'desc' : 'asc').addClass($(event.target).data("sortOrder"));
        sortRows(rows, index, type, $(event.target).data('sortOrder'));
        $(selector + trs).empty().append(rows);
        toggleOrder($(event.target));
        toggleBusy();
      }
      function toggleBusy() {
        if(busy === true) busy = false; else busy = true;
      }
      function toggleOrder(element) {
        if(element.data('sortOrder') === 'desc') element.data('sortOrder', 'asc'); else element.data('sortOrder', 'desc');
      }
      function sortRows(rows, index, type, order) { 
        rows.sort(function(row1, row2) {
          var val1 = type === 'number' ? parseFloat(row1.cells[index].textContent) : row1.cells[index].textContent,
              val2 = type === 'number' ? parseFloat(row2.cells[index].textContent) : row2.cells[index].textContent;
          if(order === 'asc')  return (val1 > val2) ? 1 : (val1 < val2) ? -1 : row1.sectionRowIndex - row2.sectionRowIndex;
          if(order === 'desc') return (val2 > val1) ? 1 : (val2 < val1) ? -1 : row1.sectionRowIndex - row2.sectionRowIndex;
        });
      }
      function getValuesType(index) {
        return $.isNumeric($(selector + " tr").not(ths)[0].cells[index].textContent) ? 'number' : 'string';
      }
      function getColIndex(element) {
        var allths = element.parentElement.cells, pos = null;
        $.each(allths, function(index, cell) {
          if(element === cell) pos = index;
          $(cell).removeClass( "desc asc" );
        });
        return pos;
      }
      return this;
    }
})(jQuery, window, document);
/*
todo:
2) sort by group
*/

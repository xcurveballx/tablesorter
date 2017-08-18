
/**
 * tablesorter.js
 * Simple jquery plugin to sort table data.
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
        tablesortTitlesClass: 'js-tsTitles',
        tablesortGroupClass: 'js-tsGroup',
      },
      selector = $(this).getSelector();
      settings = $.extend(true, {}, settings, options);

      $("body").on( "click", selector + " ." + settings.tablesortTitlesClass, function(event) {
        sortTable(event);
      });
      function sortTable(event) {
        var index = getIndex($(event.target)[0]);
        var type = getType(index);
        if(index === null || (type !== 'number' && type !== 'string')) return;
        toggleASCDESC($(event.target));
        var rows = $(selector + " ." + settings.tablesortGroupClass + " tr");
        if(type === 'number') sortRows(rows, index, type, $(event.target).data('sortOrder'));
        if(type === 'string') sortRows(rows, index, type, $(event.target).data('sortOrder'));
        $(selector + " ." + settings.tablesortGroupClass).empty().append(rows);
      }
      function toggleASCDESC(element) {
        if(element.data('sortOrder') === undefined || element.data('sortOrder') === 'desc')  element.data('sortOrder', 'asc'); else element.data('sortOrder', 'desc');
      }
      function sortRows(rows, index, type, order) {
        rows.sort(function(row1, row2) {
          var val1 = type === 'number' ? parseFloat(row1.cells[index].textContent) : row1.cells[index].textContent,
              val2 = type === 'number' ? parseFloat(row2.cells[index].textContent) : row2.cells[index].textContent;
          if(order === 'asc')  return (val1 > val2) ? 1 : (val1 < val2) ? -1 : row1.sectionRowIndex - row2.sectionRowIndex;
          if(order === 'desc') return (val2 > val1) ? 1 : (val2 < val1) ? -1 : row1.sectionRowIndex - row2.sectionRowIndex;
        });
      }
      function getType(index) {
        return $.isNumeric($(selector + " tr").not("." + settings.tablesortTitlesClass)[0].cells[index].textContent) ? 'number' : 'string';
      }
      function getIndex(element) {
        var allElements = element.parentElement.cells, pos = null;
        $.each(allElements, function(index, cell) {
          if(element === cell) {
            pos = index;
            return false;
          }
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


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
        tablesorterGroupClass: 'tsGroup',
        tablesorterColumns: []
      },
      selector = $(this).getSelector();
      settings = $.extend(true, {}, settings, options);

      (function() {
        if(settings.tablesorterColumns.length === 0) return;
        var cells = $(selector + " ." + settings.tablesorterTitlesClass)[0].cells;
        for(var i = 0; i < settings.tablesorterColumns.length; i++) {
          $(cells[settings.tablesorterColumns[i].col]).addClass('sort').data('sortOrder', settings.tablesorterColumns[i].order);
        }
        $("body").on( "click", selector + " ." + settings.tablesorterTitlesClass, function(event) {
          init(event);
        });
      })();

      function init(event) {
        var index = getColIndex($(event.target)[0]);
        if(!isSortable(index)) return;
        var type = getValuesType(index);
        if(index === null || (type !== 'number' && type !== 'string')) return;
        var rows = $(selector + " ." + settings.tablesorterGroupClass + " tr");
        $(event.target).removeClass($(event.target).data("sortOrder") === 'asc' ? 'desc' : 'asc').addClass($(event.target).data("sortOrder"));
        sortRows(rows, index, type, $(event.target).data('sortOrder'));
        $(selector + " ." + settings.tablesorterGroupClass).empty().append(rows);
        toggleASCDESC($(event.target));
      }
      function isSortable(index) {
        for(var i = 0; i < settings.tablesorterColumns.length; i++) {
          if(index === settings.tablesorterColumns[i].col) return true;
        }
        return false;
      }
      function toggleASCDESC(element) {
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
        return $.isNumeric($(selector + " tr").not("." + settings.tablesorterTitlesClass)[0].cells[index].textContent) ? 'number' : 'string';
      }
      function getColIndex(element) {
        var allElements = element.parentElement.cells, pos = null;
        $.each(allElements, function(index, cell) {
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

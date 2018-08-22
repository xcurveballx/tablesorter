/**
 * tablesorter.js
 * Simple jquery plugin to sort tabular data.
 *
 * @license The MIT License, https://github.com/xcurveballx/tablesorter/blob/master/LICENSE
 * @version 1.1
 * @author  xcurveballx, https://github.com/xcurveballx
 * @updated 2018-08-23
 * @link    https://github.com/xcurveballx/tablesorter
 *
 */
(function($, window, document, undefined) {
    "use strict";
    $.fn._init = $.fn.init;
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
        };
        settings = $.extend(true, {}, settings, options);

        var selector = $(this).getSelector(),
            ths = " ." + settings.tablesorterTitlesClass,
            trs = " ." + settings.tablesorterGroupsClass,
            cells = $(selector + ths)[0].cells,
            columns = settings.tablesorterColumns,
            curIndex = null,
            curType = null,
            curOrder = null,
            curElem = null,
            busy = false;

        function tablesorter(event) {
            if(busy || !$(event.target).hasClass('sortable')) return;
            toggleBusyFlag();
            curElem = $(event.target);
            curOrder = curElem.data('sortOrder');
            curIndex = getColIndex();
            curType = getValuesType();

            if(curIndex === null || (curType !== 'number' && curType !== 'string')) return;

            curElem.removeClass(curOrder === 'asc' ? 'desc' : 'asc').addClass(curOrder);

            sortRows();
            toggleSortingOrderForCol();
            toggleBusyFlag();
        }

        function toggleBusyFlag() {
            busy = busy === true ? false : true;
        }

        function toggleSortingOrderForCol() {
            if(curElem.data('sortOrder') === 'desc') curElem.data('sortOrder', 'asc'); else curElem.data('sortOrder', 'desc');
        }

        function sortRows() {
            var rowBlocks = $(selector + trs);
            $.each(rowBlocks, function(index, rowBlock) {
                var rows = $(rowBlock).find("tr");
                if(curType === 'number') {
                    rows.sort(sortAsNumbers);
                } else {
                    rows.sort(sortAsStrings);
                }
                $(rowBlock).empty().append(rows);
            });
        }

        function sortAsNumbers(rowA, rowB) {
            var valA = parseFloat(rowA.cells[curIndex].textContent),
                valB = parseFloat(rowB.cells[curIndex].textContent);
            if(curOrder === 'asc')  return (valA > valB) ? 1 : (valA < valB) ? -1 : rowA.sectionRowIndex - rowB.sectionRowIndex;
            if(curOrder === 'desc') return (valB > valA) ? 1 : (valB < valA) ? -1 : rowA.sectionRowIndex - rowB.sectionRowIndex;
        }

        function sortAsStrings(rowA, rowB) {
            var valA = rowA.cells[curIndex].textContent,
                valB = rowB.cells[curIndex].textContent;
            if(curOrder === 'asc')  return (valA > valB) ? 1 : (valA < valB) ? -1 : rowA.sectionRowIndex - rowB.sectionRowIndex;
            if(curOrder === 'desc') return (valB > valA) ? 1 : (valB < valA) ? -1 : rowA.sectionRowIndex - rowB.sectionRowIndex;
        }

        function getValuesType() {
            return $.isNumeric($(selector + trs + " tr")[0].cells[curIndex].textContent) ? 'number' : 'string';
        }

        function getColIndex() {
            var allths = curElem[0].parentElement.cells, colIndex = null;
            $.each(allths, function(index, cell) {
                if(curElem[0] === cell) colIndex = index;
                $(cell).removeClass( "desc asc" );
            });
            return colIndex;
        }

        (function() {
            if(columns.length === 0) return;
            for(var i = 0; i < columns.length; i++) {
                $(cells[columns[i].col]).addClass('sortable').data('sortOrder', columns[i].order);
            }
            $("body").on( "click", selector + ths, function(event) {
                tablesorter(event);
            });
        })();

        return this;
    };
})(jQuery, window, document);

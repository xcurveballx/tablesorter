/***
 * The only plugin's dependency - jQuery. It is required before
 * creating the plugin.
 */
var jQuery = require("jquery");

/**
 * There is an IIFE around the plugin.
 * The IIFE contains several helper functions.
 * The plugin gets assigned to `$.fn.tablesorter`.
 * @namespace TablesorterIIFE
 * @author Curveball <x.curveball.x@gmail.com>
 * @license MIT
 *
 */
(function($, window, document, undefined) {
    "use strict";
    $.fn._init = $.fn.init;

    /**
     * Makes possible to get selector string later by attaching it to the jQuery object.
     * Wrapper around original init() function.
     * @function TablesorterIIFE~init
     * @param {string|*} selector selector string
     * @param {object} context an object serving as context for selectors search. The match will be searched for in its children instead of the entire page.
     * @param {object} root usually $(document).
     * @returns {object} a jQuery object
     */
    $.fn.init = function(selector, context, root) {
        return (typeof selector === 'string') ? new $.fn._init(selector, context, root).data('selector', selector) : new $.fn._init(selector, context, root);
    };

    /**
     * Gets selector string passed to the plugin.
     * @function TablesorterIIFE~getSelector
     * @returns {string} selector string passed to the plugin.
     */
    $.fn.getSelector = function() {
        return $(this).data('selector');
    };

    /**
     * The plugin function assigned to `$.fn.tablesorter`.
     * Below go inner helper functions inside the plugin.
     * @namespace Tablesorter
     * @author Curveball <x.curveball.x@gmail.com>
     * @license MIT
     * @param {object.<string, *>} [options] object passed to the plugin upon calling
     * @returns {object} returns collection of matched elements.
     */
    $.fn.tablesorter = function(options) {

        var settings = $.extend({}, $.fn.tablesorter.settings, options);

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

        /**
         * Handles clicks on columns' headers. Does some checks and invokes row sorting.
         * @function Tablesorter~tablesorter
         * @param {MouseEvent} event event object corresponding to click on controls
         * @returns {undefined}
         */
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

        /**
         * Toggles plugin's busy flag.
         * @function Tablesorter~toggleBusyFlag
         * @returns {undefined}
         */
        function toggleBusyFlag() {
            busy = busy === true ? false : true;
        }

        /**
         * Toggles column's sorting order flag.
         * @function Tablesorter~toggleSortingOrderForCol
         * @returns {undefined}
         */
        function toggleSortingOrderForCol() {
            if(curElem.data('sortOrder') === 'desc') {
                curElem.data('sortOrder', 'asc');
            } else {
                curElem.data('sortOrder', 'desc');
            }
        }

        /**
         * Sorts table rows.
         * @function Tablesorter~sortRows
         * @returns {undefined}
         */
        function sortRows() {
            var rowsBlocks = $(selector + trs);
            $.each(rowsBlocks, function(index, rowsBlock) {
                var rows = $(rowsBlock).find("tr");
                if(curType === 'number') {
                    rows.sort(sortAsNumbers);
                } else {
                    rows.sort(sortAsStrings);
                }
                $(rowsBlock).empty().append(rows);
            });
        }

        /**
         * Sorting function. Compares two rows' cells with numeric content.
         * @function Tablesorter~sortAsNumbers
         * @param {HTMLTableRowElement} rowA one row object
         * @param {HTMLTableRowElement} rowB another row object
         * @returns {number} number, depending on what value is greater given the sorting order.
         */
        function sortAsNumbers(rowA, rowB) {
            var valA = parseFloat(rowA.cells[curIndex].textContent),
                valB = parseFloat(rowB.cells[curIndex].textContent);
            if(curOrder === 'asc')  return (valA > valB) ? 1 : (valA < valB) ? -1 : rowA.sectionRowIndex - rowB.sectionRowIndex;
            if(curOrder === 'desc') return (valB > valA) ? 1 : (valB < valA) ? -1 : rowA.sectionRowIndex - rowB.sectionRowIndex;
        }

        /**
         * Sorting function. Compares two rows' cells with textual content.
         * @function Tablesorter~sortAsStrings
         * @param {HTMLTableRowElement} rowA one row object
         * @param {HTMLTableRowElement} rowB another row object
         * @returns {number} number, depending on what value is greater given the sorting order.
         */
        function sortAsStrings(rowA, rowB) {
            var valA = rowA.cells[curIndex].textContent,
                valB = rowB.cells[curIndex].textContent;
            if(curOrder === 'asc')  return (valA > valB) ? 1 : (valA < valB) ? -1 : rowA.sectionRowIndex - rowB.sectionRowIndex;
            if(curOrder === 'desc') return (valB > valA) ? 1 : (valB < valA) ? -1 : rowA.sectionRowIndex - rowB.sectionRowIndex;
        }

        /**
         * Gets column values' datatype.
         * @function Tablesorter~getValuesType
         * @returns {string} column values' datatype.
         */
        function getValuesType() {
            return $.isNumeric($(selector + trs + " tr")[0].cells[curIndex].textContent) ? 'number' : 'string';
        }

        /**
         * Gets column's index.
         * @function Tablesorter~getColIndex
         * @returns {number} column's index.
         */
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

    /*** Plugin's default settings*/
    $.fn.tablesorter.settings = {
        tablesorterTitlesClass: 'tsTitles',
        tablesorterGroupsClass: 'tsGroup',
        tablesorterColumns: []
    };

})(jQuery, window, document);

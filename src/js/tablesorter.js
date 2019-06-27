/**
 * Plugin's dependency jquery
 */
var $ = require("jquery");

/**
 * Tablesorter - simple jQuery plugin to sort tabular data.
 *
 * @author Curveball <x.curveball.x@gmail.com>
 * @license MIT
 *
 */
(function($, window, document, undefined) {
    "use strict";
    $.fn._init = $.fn.init;

    /**
     * Makes possible to get selector string later.
     * Wrapper around original init function.
     * @returns {undefined}
     */
    $.fn.init = function(selector, context, root) {
        return (typeof selector === 'string') ? new $.fn._init(selector, context, root).data('selector', selector) : new $.fn._init(selector, context, root);
    };

    /**
     * Gets selector string passed to the plugin.
     * @returns {string} selector string passed to the plugin.
     */
    $.fn.getSelector = function() {
        return $(this).data('selector');
    };

    /**
     * Sets the plugin and makes it chainable by returning `this`.
     * @this collection of matched elements.
     * @returns {object} returns collection of matched elements.
     */
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

        /**
         * Handles clicks on columns' headers. Does some checks
         * and invokes row sorting.
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
         * @returns {undefined}
         */
        function toggleBusyFlag() {
            busy = busy === true ? false : true;
        }

        /**
         * Toggles column's sorting order flag.
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
         * @returns {undefined}
         */
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

        /**
         * Sorting function. Compares two rows' cells with numeric content.
         * @param {HTMLTableRowElement} one row object
         * @param {HTMLTableRowElement} another row object
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
         * @param {HTMLTableRowElement} one row object
         * @param {HTMLTableRowElement} another row object
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
         * @returns {string} column values' datatype.
         */
        function getValuesType() {
            return $.isNumeric($(selector + trs + " tr")[0].cells[curIndex].textContent) ? 'number' : 'string';
        }

        /**
         * Gets column's index.
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
})($, window, document);

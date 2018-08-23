// ==UserScript==
// @name         Count Asana
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Count asana board columns
// @author       You
// @match        https://app.asana.com/0/*/board
// @grant        none
// ==/UserScript==

function addCount(element, number) {
    var span = document.createElement("span");
    var spanText = document.createTextNode(" (" + number + ") ");
    span.appendChild(spanText);
    span.className = "BoardColumnHeaderTitle"
    if (element.children.length < 3)
    {
        element.insertBefore(span, element.children[0]);
    }
    else
    {
        element.children[0] = span;
    }
}

setInterval(function() {
    'use strict';
    var titles = document.getElementsByClassName("BoardColumnHeader BoardColumn-header");
    var columns = document.getElementsByClassName("SortableList-itemContainer SortableList-itemContainer--column");
    for (var i = 0; i < columns.length; i++)
    {
        var childs = columns[i].childNodes;
        var titleChild = titles.childNodes;
        addCount(titles[i], childs.length);
    }
}, 5000);

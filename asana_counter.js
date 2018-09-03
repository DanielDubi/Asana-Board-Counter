// ==UserScript==
// @name         Count Asana
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Count asana board columns
// @author       You
// @match        https://app.asana.com/0/*/board
// @grant        none
// ==/UserScript==

var checkButtonAdded = false;

function checkLaunchpad(title, column) {
    return "";
}

function checkColumn(title, column) {
    var currentItems = column.childNodes.length;
    var titile = title.children[1].innerHTML;
    var max = titile.match(/\d+/g);
    if (max === null)
    {
        max = 0;
    }
    console.log(titile + " max=" + max + " current=" + currentItems);
    if (max === 0)
    {
        return "";
    }
    if (currentItems > max)
    {
        return titile + " is overflowing\n";
    }
    return "";
}

function checkBoard() {
    var result = "";
    var titles = document.getElementsByClassName("BoardColumnHeader BoardColumn-header");
    var columns = document.getElementsByClassName("SortableList-itemContainer SortableList-itemContainer--column");
    if (columns[0].childNodes.length > 0)
    {
        result += titles[0].children[1].innerHTML + " is overflowing\n";
    }
    for (var i = 1; i < columns.length; i++)
    {
        result += checkColumn(titles[i], columns[i]);
    }
    result += checkLaunchpad(titles[1], columns[1]);
    if (result === "")
    {
        window.confirm("Board is good!");
    }
    else
    {
        window.confirm(result);
    }
}

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

function addCheckButton() {
    'use strict';
    if (checkButtonAdded)
    {
        return;
    }
    var boardHeader = document.getElementsByClassName("BoardHeader Board-header");
    var btn = document.createElement("BUTTON");
    var text = document.createTextNode("Check Board");
    btn.appendChild(text);
    btn.onclick = function() { checkBoard(); }
    boardHeader[0].appendChild(btn);
    checkButtonAdded = true;
}

setInterval(function() {
    'use strict';
    var titles = document.getElementsByClassName("BoardColumnHeader BoardColumn-header");
    var columns = document.getElementsByClassName("SortableList-itemContainer SortableList-itemContainer--column");
    for (var i = 0; i < columns.length; i++)
    {
        var childs = columns[i].childNodes;
        addCount(titles[i], childs.length);
    }
    addCheckButton();
}, 5000);

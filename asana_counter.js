// ==UserScript==
// @name         Count Asana
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Count asana board columns
// @author       You
// @match        https://app.asana.com/0/*/board
// @grant        none
// ==/UserScript==


function isTeeShirtSizeInName(name) {
    var tee_shirt_size = name.match(/^\[[SML]\]+/g);
    if (tee_shirt_size === null) {
        return false;
    }
    var size = tee_shirt_size[0];
    if ("[S][M][L]".indexOf(size) === -1) {
        return false;
    }
    return true;
}

function checkLaunchpad(title, column) {
    var lunchpad_status = ""
    var titleText = title.children[1].innerHTML;
    var max_values = titleText.match(/\d+/g);
    var currentItems = column.childNodes.length;
    if (currentItems > max_values[0]) {
        lunchpad_status += titleText + " is overflowing, but only if this is a sprint meeting\n";
    }
    else if (currentItems > max_values[1]) {
        lunchpad_status += titleText + " is overflowing";
    }
    var tasks_missing_size = []
    var task_names = column.getElementsByClassName("BoardCardWithCustomProperties-name");
    for (var i = 0; i < task_names.length; i++) {
        var hasSize = isTeeShirtSizeInName(task_names[i].innerHTML);
        if (!hasSize)
        {
            tasks_missing_size.push(task_names[i].innerHTML);
        }
    }
    if ( tasks_missing_size.length != 0) {
        lunchpad_status += "\nThe following tasks have not tee-shirt size:\n";
    }
    for (var j = 0; j < tasks_missing_size.length; j++) {
        lunchpad_status += "  *  " + tasks_missing_size[j] + "\n"
    }
    return lunchpad_status;
}

function checkColumn(title, column) {
    var currentItems = column.childNodes.length;
    var titleText = title.children[1].innerHTML;
    var max = titleText.match(/\d+/g);
    if (max === null) {
        max = 0;
    }
    if (max === 0) {
        return "";
    }
    if (currentItems > max) {
        return titleText + " is overflowing\n";
    }
    return "";
}

function checkBoard() {
    var result = "";
    var titles = document.getElementsByClassName("BoardColumnHeader BoardColumn-header");
    var columns = document.getElementsByClassName("SortableList-itemContainer SortableList-itemContainer--column");
    if (columns[0].childNodes.length > 0) {
        result += titles[0].children[1].innerHTML + " is overflowing\n";
    }
    for (var i = 1; i < columns.length; i++) {
        result += checkColumn(titles[i], columns[i]);
    }
    result += checkLaunchpad(titles[1], columns[1]);
    if (result === "") {
        window.confirm("Board is good!");
    } else {
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
    } else {
        element.children[0] = span;
    }
}

function addCheckButton() {
    'use strict';
    var boardHeader = document.getElementsByClassName("BoardHeader Board-header");
    var existing_btns = document.getElementsByTagName("BUTTON");
    if (existing_btns.length !== 0) {
        return;
    }
    var btn = document.createElement("BUTTON");
    var text = document.createTextNode("Check Board");
    btn.appendChild(text);
    btn.onclick = function() { checkBoard(); }
    boardHeader[0].appendChild(btn);
}

setInterval(function() {
    'use strict';
    var titles = document.getElementsByClassName("BoardColumnHeader BoardColumn-header");
    var columns = document.getElementsByClassName("SortableList-itemContainer SortableList-itemContainer--column");
    for (var i = 0; i < columns.length; i++) {
        var childs = columns[i].childNodes;
        addCount(titles[i], childs.length);
    }
    addCheckButton();
}, 1000);

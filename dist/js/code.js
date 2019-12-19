var rows = 25;
var cols = 60;
var playing = false;
var grid = new Array(rows);
var nextGrid = new Array(rows);
var timer;
var reproductionTime = 100;
function initializeGrids() {
    for (var i = 0; i < rows; i++) {
        grid[i] = new Array(cols);
        nextGrid[i] = new Array(cols);
    }
}
function resetGrids() {
    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
            grid[i][j] = 0;
            nextGrid[i][j] = 0;
        }
    }
}
function copyAndResetGrid() {
    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
            grid[i][j] = nextGrid[i][j];
            nextGrid[i][j] = 0;
        }
    }
}
function initialize() {
    createTable();
    initializeGrids();
    resetGrids();
    setupControlButtons();
}
function setSize() {
    n_rows = document.getElementById("heightIn").value;
    n_cols = document.getElementById("widthIn").value;
    rows = n_rows;
    cols = n_cols;
    var emptyTable = document.getElementById("gridContainer").innerHTML = "";
    var gridContainer = document.getElementById('gridContainer');
    if (!gridContainer) {
        console.error("Problem: No div for the drid table!");
    } else {
        var table = document.createElement("table");
        for (var i = 0; i < rows; i++) {
            var tr = document.createElement("tr");
            for (var j = 0; j < cols; j++) {
                var cell = document.createElement("td");
                cell.setAttribute("id", i + "_" + j);
                cell.setAttribute("class", "dead");
                cell.onclick = cellClickHandler;
                tr.appendChild(cell);
            }
            table.appendChild(tr);
        }
        gridContainer.appendChild(table);
    }
}
function createTable() {
    var gridContainer = document.getElementById('gridContainer');
    if (!gridContainer) {
        console.error("Problem: No div for the drid table!");
    }
    var table = document.createElement("table");
    rows = document.getElementById("heightIn").value;
    cols = document.getElementById("widthIn").value;
    for (var i = 0; i < rows; i++) {
        var tr = document.createElement("tr");
        for (var j = 0; j < cols; j++) {
            var cell = document.createElement("td");
            cell.setAttribute("id", i + "_" + j);
            cell.setAttribute("class", "dead");
            cell.onclick = cellClickHandler;
            tr.appendChild(cell);
        }
        table.appendChild(tr);
    }
    gridContainer.appendChild(table);
}
function cellClickHandler() {
    var rowcol = this.id.split("_");
    var row = rowcol[0];
    var col = rowcol[1];
    var classes = this.getAttribute("class");
    if (classes.indexOf("live") > -1) {
        this.setAttribute("class", "dead");
        grid[row][col] = 0;
    } else {
        this.setAttribute("class", "live");
        grid[row][col] = 1;
    }
}
function updateView() {
    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
            var cell = document.getElementById(i + "_" + j);
            if (grid[i][j] == 0) {
                cell.setAttribute("class", "dead");
            } else {
                cell.setAttribute("class", "live");
            }
        }
    }
}
function setupControlButtons() {
    var startButton = document.getElementById('start');
    startButton.onclick = startButtonHandler;
    var clearButton = document.getElementById('clear');
    clearButton.onclick = clearButtonHandler;
    var randomButton = document.getElementById("random");
    randomButton.onclick = randomButtonHandler;
}
function randomButtonHandler() {
    if (playing) return;
    clearButtonHandler();
    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
            var isLive = Math.round(Math.random());
            if (isLive == 1) {
                var cell = document.getElementById(i + "_" + j);
                cell.setAttribute("class", "live");
                grid[i][j] = 1;
            }
        }
    }
}
function levelChange() {
    var levelLoad = document.getElementById("level").value;
    levelLoad.split("\n");
    for (var x = 0; x < levelLoad.length; x++) {
        for (var i = 0; i < rows; i++) {
            for (var j = 0; j < cols; j++) {
                var isLive = levelLoad[j][i];
                if (isLive == 1) {
                    var cell = document.getElementById(i + "_" + j);
                    cell.setAttribute("class", "live");
                } else if (isLive == 0 || "") {
                    var cell = document.getElementById(i + "_" + j);
                    cell.setAttribute("class", "dead");
                }
            }
    }
    }
}
function clearButtonHandler() {
    console.log("Clear the game: stop playing, clear the grid");
    playing = false;
    var startButton = document.getElementById('start');
    startButton.innerHTML = "Start";
    clearTimeout(timer);
    var cellsList = document.getElementsByClassName("live");
    var cells = [];
    for (var i = 0; i < cellsList.length; i++) {
        cells.push(cellsList[i]);
    }
    for (var i = 0; i < cells.length; i++) {
        cells[i].setAttribute("class", "dead");
    }
    resetGrids;
}
function startButtonHandler() {
    if (playing) {
        console.log("Pause the game");
        playing = false;
        this.innerHTML = "Continue";
        clearTimeout(timer);
    } else {
        console.log("Continue the game");
        playing = true;
        this.innerHTML = "Pause";
        play();
    }
}
function play() {
    computeNextGen();
    if (playing) {
        timer = setTimeout(play, reproductionTime);
    }
}
function computeNextGen() {
    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
            applyRules(i, j);
        }
    }
    copyAndResetGrid();
    updateView();
}
function applyRules(row, col) {
    var numNeighbors = countNeighbors(row, col);
    if (grid[row][col] == 1) {
        if (numNeighbors < 2) {
            nextGrid[row][col] = 0;
        } else if (numNeighbors == 2 || numNeighbors == 3) {
            nextGrid[row][col] = 1;
        } else if (numNeighbors > 3) {
            nextGrid[row][col] = 0;
        }
    } else if (grid[row][col] == 0) {
        if (numNeighbors == 3) {
            nextGrid[row][col] = 1;
        }
    }
}
function countNeighbors(row, col) {
    var count = 0;
    if (row - 1 >= 0) {
        if (grid[row - 1][col] == 1) count++;
    }
    if (row - 1 >= 0 && col - 1 >= 0) {
        if (grid[row - 1][col - 1] == 1) count++;
    }
    if (row - 1 >= 0 && col + 1 < cols) {
        if (grid[row - 1][col + 1] == 1) count++;
    }
    if (col - 1 >= 0) {
        if (grid[row][col - 1] == 1) count++;
    }
    if (col + 1 < cols) {
        if (grid[row][col + 1] == 1) count++;
    }
    if (row + 1 < rows) {
        if (grid[row + 1][col] == 1) count++;
    }
    if (row + 1 < rows && col - 1 >= 0) {
        if (grid[row + 1][col - 1] == 1) count++;
    }
    if (row + 1 < rows && col + 1 < cols) {
        if (grid[row + 1][col + 1] == 1) count++;
    }
    return count;
}
window.onload = initialize;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvZGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImNvZGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgcm93cyA9IDI1O1xyXG52YXIgY29scyA9IDYwO1xyXG5cclxudmFyIHBsYXlpbmcgPSBmYWxzZTtcclxuXHJcbnZhciBncmlkID0gbmV3IEFycmF5KHJvd3MpO1xyXG52YXIgbmV4dEdyaWQgPSBuZXcgQXJyYXkocm93cyk7XHJcblxyXG52YXIgdGltZXI7XHJcbnZhciByZXByb2R1Y3Rpb25UaW1lID0gMTAwO1xyXG5cclxuZnVuY3Rpb24gaW5pdGlhbGl6ZUdyaWRzKCkge1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCByb3dzOyBpKyspIHtcclxuICAgICAgICBncmlkW2ldID0gbmV3IEFycmF5KGNvbHMpO1xyXG4gICAgICAgIG5leHRHcmlkW2ldID0gbmV3IEFycmF5KGNvbHMpO1xyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiByZXNldEdyaWRzKCkge1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCByb3dzOyBpKyspIHtcclxuICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IGNvbHM7IGorKykge1xyXG4gICAgICAgICAgICBncmlkW2ldW2pdID0gMDtcclxuICAgICAgICAgICAgbmV4dEdyaWRbaV1bal0gPSAwO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gY29weUFuZFJlc2V0R3JpZCgpIHtcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcm93czsgaSsrKSB7XHJcbiAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBjb2xzOyBqKyspIHtcclxuICAgICAgICAgICAgZ3JpZFtpXVtqXSA9IG5leHRHcmlkW2ldW2pdO1xyXG4gICAgICAgICAgICBuZXh0R3JpZFtpXVtqXSA9IDA7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG4vLyBJbml0aWFsaXplXHJcbmZ1bmN0aW9uIGluaXRpYWxpemUoKSB7XHJcbiAgICBjcmVhdGVUYWJsZSgpO1xyXG4gICAgaW5pdGlhbGl6ZUdyaWRzKCk7XHJcbiAgICByZXNldEdyaWRzKCk7XHJcbiAgICBzZXR1cENvbnRyb2xCdXR0b25zKCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHNldFNpemUoKSB7XHJcblxyXG4gICAgbl9yb3dzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJoZWlnaHRJblwiKS52YWx1ZTtcclxuICAgIG5fY29scyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwid2lkdGhJblwiKS52YWx1ZTtcclxuICAgIHJvd3MgPSBuX3Jvd3M7XHJcbiAgICBjb2xzID0gbl9jb2xzO1xyXG5cclxuICAgIHZhciBlbXB0eVRhYmxlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJncmlkQ29udGFpbmVyXCIpLmlubmVySFRNTCA9IFwiXCI7XHJcbiAgICB2YXIgZ3JpZENvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdncmlkQ29udGFpbmVyJyk7XHJcblxyXG4gICAgaWYgKCFncmlkQ29udGFpbmVyKSB7XHJcbiAgICAgICAgLy8gVGhyb3cgZXJyb3JcclxuICAgICAgICBjb25zb2xlLmVycm9yKFwiUHJvYmxlbTogTm8gZGl2IGZvciB0aGUgZHJpZCB0YWJsZSFcIik7XHJcbiAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICB2YXIgdGFibGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwidGFibGVcIik7XHJcblxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcm93czsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhciB0ciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJ0clwiKTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBjb2xzOyBqKyspIHsvL1xyXG4gICAgICAgICAgICAgICAgdmFyIGNlbGwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwidGRcIik7XHJcbiAgICAgICAgICAgICAgICBjZWxsLnNldEF0dHJpYnV0ZShcImlkXCIsIGkgKyBcIl9cIiArIGopO1xyXG4gICAgICAgICAgICAgICAgY2VsbC5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBcImRlYWRcIik7XHJcbiAgICAgICAgICAgICAgICBjZWxsLm9uY2xpY2sgPSBjZWxsQ2xpY2tIYW5kbGVyO1xyXG4gICAgICAgICAgICAgICAgdHIuYXBwZW5kQ2hpbGQoY2VsbCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGFibGUuYXBwZW5kQ2hpbGQodHIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBncmlkQ29udGFpbmVyLmFwcGVuZENoaWxkKHRhYmxlKTtcclxuICAgIH1cclxuXHJcbn1cclxuXHJcbi8vIExheSBvdXQgdGhlIGJvYXJkXHJcbmZ1bmN0aW9uIGNyZWF0ZVRhYmxlKCkge1xyXG4gICAgdmFyIGdyaWRDb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZ3JpZENvbnRhaW5lcicpO1xyXG4gICAgaWYgKCFncmlkQ29udGFpbmVyKSB7XHJcbiAgICAgICAgLy8gVGhyb3cgZXJyb3JcclxuICAgICAgICBjb25zb2xlLmVycm9yKFwiUHJvYmxlbTogTm8gZGl2IGZvciB0aGUgZHJpZCB0YWJsZSFcIik7XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIHRhYmxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInRhYmxlXCIpO1xyXG5cclxuICAgIHJvd3MgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImhlaWdodEluXCIpLnZhbHVlO1xyXG4gICAgY29scyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwid2lkdGhJblwiKS52YWx1ZTtcclxuXHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHJvd3M7IGkrKykge1xyXG4gICAgICAgIHZhciB0ciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJ0clwiKTtcclxuICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IGNvbHM7IGorKykgey8vXHJcbiAgICAgICAgICAgIHZhciBjZWxsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInRkXCIpO1xyXG4gICAgICAgICAgICBjZWxsLnNldEF0dHJpYnV0ZShcImlkXCIsIGkgKyBcIl9cIiArIGopO1xyXG4gICAgICAgICAgICBjZWxsLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIFwiZGVhZFwiKTtcclxuICAgICAgICAgICAgY2VsbC5vbmNsaWNrID0gY2VsbENsaWNrSGFuZGxlcjtcclxuICAgICAgICAgICAgdHIuYXBwZW5kQ2hpbGQoY2VsbCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRhYmxlLmFwcGVuZENoaWxkKHRyKTtcclxuICAgIH1cclxuXHJcbiAgICBncmlkQ29udGFpbmVyLmFwcGVuZENoaWxkKHRhYmxlKTtcclxuXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNlbGxDbGlja0hhbmRsZXIoKSB7XHJcbiAgICB2YXIgcm93Y29sID0gdGhpcy5pZC5zcGxpdChcIl9cIik7XHJcbiAgICB2YXIgcm93ID0gcm93Y29sWzBdO1xyXG4gICAgdmFyIGNvbCA9IHJvd2NvbFsxXTtcclxuXHJcbiAgICB2YXIgY2xhc3NlcyA9IHRoaXMuZ2V0QXR0cmlidXRlKFwiY2xhc3NcIik7XHJcbiAgICBpZiAoY2xhc3Nlcy5pbmRleE9mKFwibGl2ZVwiKSA+IC0xKSB7XHJcbiAgICAgICAgdGhpcy5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBcImRlYWRcIik7XHJcbiAgICAgICAgZ3JpZFtyb3ddW2NvbF0gPSAwO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIFwibGl2ZVwiKTtcclxuICAgICAgICBncmlkW3Jvd11bY29sXSA9IDE7XHJcbiAgICB9XHJcblxyXG59XHJcblxyXG5mdW5jdGlvbiB1cGRhdGVWaWV3KCkge1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCByb3dzOyBpKyspIHtcclxuICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IGNvbHM7IGorKykge1xyXG4gICAgICAgICAgICB2YXIgY2VsbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGkgKyBcIl9cIiArIGopO1xyXG4gICAgICAgICAgICBpZiAoZ3JpZFtpXVtqXSA9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICBjZWxsLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIFwiZGVhZFwiKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNlbGwuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJsaXZlXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBzZXR1cENvbnRyb2xCdXR0b25zKCkge1xyXG4gICAgLy8gYnV0dG9uIHRvIHN0YXJ0XHJcbiAgICB2YXIgc3RhcnRCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3RhcnQnKTtcclxuICAgIHN0YXJ0QnV0dG9uLm9uY2xpY2sgPSBzdGFydEJ1dHRvbkhhbmRsZXI7XHJcblxyXG4gICAgLy8gYnV0dG9uIHRvIGNsZWFyXHJcbiAgICB2YXIgY2xlYXJCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2xlYXInKTtcclxuICAgIGNsZWFyQnV0dG9uLm9uY2xpY2sgPSBjbGVhckJ1dHRvbkhhbmRsZXI7XHJcblxyXG4gICAgLy8gYnV0dG9uIHRvIHNldCByYW5kb20gaW5pdGlhbCBzdGF0ZVxyXG4gICAgdmFyIHJhbmRvbUJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicmFuZG9tXCIpO1xyXG4gICAgcmFuZG9tQnV0dG9uLm9uY2xpY2sgPSByYW5kb21CdXR0b25IYW5kbGVyO1xyXG59XHJcblxyXG5mdW5jdGlvbiByYW5kb21CdXR0b25IYW5kbGVyKCkge1xyXG4gICAgaWYgKHBsYXlpbmcpIHJldHVybjtcclxuICAgIGNsZWFyQnV0dG9uSGFuZGxlcigpO1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCByb3dzOyBpKyspIHtcclxuICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IGNvbHM7IGorKykge1xyXG4gICAgICAgICAgICB2YXIgaXNMaXZlID0gTWF0aC5yb3VuZChNYXRoLnJhbmRvbSgpKTtcclxuICAgICAgICAgICAgaWYgKGlzTGl2ZSA9PSAxKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgY2VsbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGkgKyBcIl9cIiArIGopO1xyXG4gICAgICAgICAgICAgICAgY2VsbC5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBcImxpdmVcIik7XHJcbiAgICAgICAgICAgICAgICBncmlkW2ldW2pdID0gMTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuXHJcbmZ1bmN0aW9uIGxldmVsQ2hhbmdlKCkge1xyXG4gICAgdmFyIGxldmVsTG9hZCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibGV2ZWxcIikudmFsdWU7XHJcbiAgICBsZXZlbExvYWQuc3BsaXQoXCJcXG5cIik7XHJcblxyXG4gICAgZm9yICh2YXIgeCA9IDA7IHggPCBsZXZlbExvYWQubGVuZ3RoOyB4KyspIHtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHJvd3M7IGkrKykge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IGNvbHM7IGorKykge1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciBpc0xpdmUgPSBsZXZlbExvYWRbal1baV07XHJcbiAgICAgICAgICAgICAgICBpZiAoaXNMaXZlID09IDEpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgY2VsbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGkgKyBcIl9cIiArIGopO1xyXG4gICAgICAgICAgICAgICAgICAgIGNlbGwuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJsaXZlXCIpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChpc0xpdmUgPT0gMCB8fCBcIlwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNlbGwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpICsgXCJfXCIgKyBqKTtcclxuICAgICAgICAgICAgICAgICAgICBjZWxsLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIFwiZGVhZFwiKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBcclxuICAgICBcclxuICAgIHZhciBsZXZlbExvYWQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImxldmVsXCIpLnZhbHVlO1xyXG4gICAgdmFyIHRvdGFsQ2hhciA9IGxldmVsTG9hZC5sZW5ndGg7XHJcblxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcm93czsgaSsrKSB7XHJcbiAgICAgICAgIC8vICAgbGV2ZWxMb2FkLnNwbGl0KFwiXFxuXCIpO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IGNvbHM7IGorKykge1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICB2YXIgaXNMaXZlID0gbGV2ZWxMb2FkW2pdW2ldO1xyXG4gICAgICAgICAgICAgICAgaWYgKGlzTGl2ZSA9PSAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNlbGwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpICsgXCJfXCIgKyBqKTtcclxuICAgICAgICAgICAgICAgICAgICBjZWxsLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIFwibGl2ZVwiKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2VsbC5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBcImRlYWRcIik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiovXHJcbn1cclxuXHJcbi8vIGNsZWFyIHRoZSBncmlkXHJcbmZ1bmN0aW9uIGNsZWFyQnV0dG9uSGFuZGxlcigpIHtcclxuICAgIGNvbnNvbGUubG9nKFwiQ2xlYXIgdGhlIGdhbWU6IHN0b3AgcGxheWluZywgY2xlYXIgdGhlIGdyaWRcIik7XHJcblxyXG5cclxuICAgIHBsYXlpbmcgPSBmYWxzZTtcclxuICAgIHZhciBzdGFydEJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdGFydCcpO1xyXG4gICAgc3RhcnRCdXR0b24uaW5uZXJIVE1MID0gXCJTdGFydFwiO1xyXG4gICAgY2xlYXJUaW1lb3V0KHRpbWVyKTtcclxuXHJcbiAgICB2YXIgY2VsbHNMaXN0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcImxpdmVcIik7XHJcbiAgICAvLyBjb252ZXJ0IHRvIGFycmF5IGZpcnN0LCBvdGhlcndpc2UsIHlvdSdyZSB3b3JraW5nIG9uIGEgbGl2ZSBub2RlIGxpc3RcclxuICAgIC8vIGFuZCB0aGUgdXBkYXRlIGRvZXNuJ3Qgd29yayFcclxuICAgIHZhciBjZWxscyA9IFtdO1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjZWxsc0xpc3QubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBjZWxscy5wdXNoKGNlbGxzTGlzdFtpXSk7XHJcbiAgICB9XHJcblxyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjZWxscy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGNlbGxzW2ldLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIFwiZGVhZFwiKTtcclxuICAgIH1cclxuICAgIHJlc2V0R3JpZHM7XHJcbn1cclxuXHJcbi8vIHN0YXJ0L3BhdXNlL2NvbnRpbnVlIHRoZSBnYW1lXHJcbmZ1bmN0aW9uIHN0YXJ0QnV0dG9uSGFuZGxlcigpIHtcclxuICAgIGlmIChwbGF5aW5nKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJQYXVzZSB0aGUgZ2FtZVwiKTtcclxuICAgICAgICBwbGF5aW5nID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5pbm5lckhUTUwgPSBcIkNvbnRpbnVlXCI7XHJcbiAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVyKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJDb250aW51ZSB0aGUgZ2FtZVwiKTtcclxuICAgICAgICBwbGF5aW5nID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLmlubmVySFRNTCA9IFwiUGF1c2VcIjtcclxuICAgICAgICBwbGF5KCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8vIHJ1biB0aGUgbGlmZSBnYW1lXHJcbmZ1bmN0aW9uIHBsYXkoKSB7XHJcbiAgICBjb21wdXRlTmV4dEdlbigpO1xyXG5cclxuICAgIGlmIChwbGF5aW5nKSB7XHJcbiAgICAgICAgdGltZXIgPSBzZXRUaW1lb3V0KHBsYXksIHJlcHJvZHVjdGlvblRpbWUpO1xyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBjb21wdXRlTmV4dEdlbigpIHtcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcm93czsgaSsrKSB7XHJcbiAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBjb2xzOyBqKyspIHtcclxuICAgICAgICAgICAgYXBwbHlSdWxlcyhpLCBqKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gY29weSBOZXh0R3JpZCB0byBncmlkLCBhbmQgcmVzZXQgbmV4dEdyaWRcclxuICAgIGNvcHlBbmRSZXNldEdyaWQoKTtcclxuICAgIC8vIGNvcHkgYWxsIDEgdmFsdWVzIHRvIFwibGl2ZVwiIGluIHRoZSB0YWJsZVxyXG4gICAgdXBkYXRlVmlldygpO1xyXG59XHJcblxyXG4vLyBSVUxFU1xyXG4vLyBBbnkgbGl2ZSBjZWxsIHdpdGggZmV3ZXIgdGhhbiB0d28gbGl2ZSBuZWlnaGJvdXJzIGRpZXMsIGFzIGlmIGNhdXNlZCBieSB1bmRlci1wb3B1bGF0aW9uLlxyXG4vLyBBbnkgbGl2ZSBjZWxsIHdpdGggdHdvIG9yIHRocmVlIGxpdmUgbmVpZ2hib3VycyBsaXZlcyBvbiB0byB0aGUgbmV4dCBnZW5lcmF0aW9uLlxyXG4vLyBBbnkgbGl2ZSBjZWxsIHdpdGggbW9yZSB0aGFuIHRocmVlIGxpdmUgbmVpZ2hib3VycyBkaWVzLCBhcyBpZiBieSBvdmVyY3Jvd2RpbmcuXHJcbi8vIEFueSBkZWFkIGNlbGwgd2l0aCBleGFjdGx5IHRocmVlIGxpdmUgbmVpZ2hib3VycyBiZWNvbWVzIGEgbGl2ZSBjZWxsLCBhcyBpZiBieSByZXByb2R1Y3Rpb24uXHJcblxyXG5mdW5jdGlvbiBhcHBseVJ1bGVzKHJvdywgY29sKSB7XHJcbiAgICB2YXIgbnVtTmVpZ2hib3JzID0gY291bnROZWlnaGJvcnMocm93LCBjb2wpO1xyXG4gICAgaWYgKGdyaWRbcm93XVtjb2xdID09IDEpIHtcclxuICAgICAgICBpZiAobnVtTmVpZ2hib3JzIDwgMikge1xyXG4gICAgICAgICAgICBuZXh0R3JpZFtyb3ddW2NvbF0gPSAwO1xyXG4gICAgICAgIH0gZWxzZSBpZiAobnVtTmVpZ2hib3JzID09IDIgfHwgbnVtTmVpZ2hib3JzID09IDMpIHtcclxuICAgICAgICAgICAgbmV4dEdyaWRbcm93XVtjb2xdID0gMTtcclxuICAgICAgICB9IGVsc2UgaWYgKG51bU5laWdoYm9ycyA+IDMpIHtcclxuICAgICAgICAgICAgbmV4dEdyaWRbcm93XVtjb2xdID0gMDtcclxuICAgICAgICB9XHJcbiAgICB9IGVsc2UgaWYgKGdyaWRbcm93XVtjb2xdID09IDApIHtcclxuICAgICAgICBpZiAobnVtTmVpZ2hib3JzID09IDMpIHtcclxuICAgICAgICAgICAgbmV4dEdyaWRbcm93XVtjb2xdID0gMTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNvdW50TmVpZ2hib3JzKHJvdywgY29sKSB7XHJcbiAgICB2YXIgY291bnQgPSAwO1xyXG4gICAgaWYgKHJvdyAtIDEgPj0gMCkge1xyXG4gICAgICAgIGlmIChncmlkW3JvdyAtIDFdW2NvbF0gPT0gMSkgY291bnQrKztcclxuICAgIH1cclxuICAgIGlmIChyb3cgLSAxID49IDAgJiYgY29sIC0gMSA+PSAwKSB7XHJcbiAgICAgICAgaWYgKGdyaWRbcm93IC0gMV1bY29sIC0gMV0gPT0gMSkgY291bnQrKztcclxuICAgIH1cclxuICAgIGlmIChyb3cgLSAxID49IDAgJiYgY29sICsgMSA8IGNvbHMpIHtcclxuICAgICAgICBpZiAoZ3JpZFtyb3cgLSAxXVtjb2wgKyAxXSA9PSAxKSBjb3VudCsrO1xyXG4gICAgfVxyXG4gICAgaWYgKGNvbCAtIDEgPj0gMCkge1xyXG4gICAgICAgIGlmIChncmlkW3Jvd11bY29sIC0gMV0gPT0gMSkgY291bnQrKztcclxuICAgIH1cclxuICAgIGlmIChjb2wgKyAxIDwgY29scykge1xyXG4gICAgICAgIGlmIChncmlkW3Jvd11bY29sICsgMV0gPT0gMSkgY291bnQrKztcclxuICAgIH1cclxuICAgIGlmIChyb3cgKyAxIDwgcm93cykge1xyXG4gICAgICAgIGlmIChncmlkW3JvdyArIDFdW2NvbF0gPT0gMSkgY291bnQrKztcclxuICAgIH1cclxuICAgIGlmIChyb3cgKyAxIDwgcm93cyAmJiBjb2wgLSAxID49IDApIHtcclxuICAgICAgICBpZiAoZ3JpZFtyb3cgKyAxXVtjb2wgLSAxXSA9PSAxKSBjb3VudCsrO1xyXG4gICAgfVxyXG4gICAgaWYgKHJvdyArIDEgPCByb3dzICYmIGNvbCArIDEgPCBjb2xzKSB7XHJcbiAgICAgICAgaWYgKGdyaWRbcm93ICsgMV1bY29sICsgMV0gPT0gMSkgY291bnQrKztcclxuICAgIH1cclxuICAgIHJldHVybiBjb3VudDtcclxufVxyXG5cclxuLy8gU3RhcnQgZXZlcnl0aGluZ1xyXG53aW5kb3cub25sb2FkID0gaW5pdGlhbGl6ZTsiXX0=
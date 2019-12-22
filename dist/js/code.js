var rows = 10;
var cols = 600;
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
    resetGrids();
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
var snowStorm = (function(window, document) {
  this.autoStart = true;          
  this.excludeMobile = true;      
  this.flakesMax = 128;           
  this.flakesMaxActive = 64;      
  this.animationInterval = 33;    
  this.useGPU = true;             
  this.className = null;          
  this.excludeMobile = true;      
  this.flakeBottom = null;        
  this.followMouse = true;        
  this.snowColor = '#fff';        
  this.snowCharacter = '&bull;';  
  this.snowStick = true;          
  this.targetElement = null;      
  this.useMeltEffect = true;      
  this.useTwinkleEffect = false;  
  this.usePositionFixed = false;  
  this.usePixelPosition = false;  
  this.freezeOnBlur = true;       
  this.flakeLeftOffset = 0;       
  this.flakeRightOffset = 0;      
  this.flakeWidth = 8;            
  this.flakeHeight = 8;           
  this.vMaxX = 5;                 
  this.vMaxY = 4;                 
  this.zIndex = 0;                
  var storm = this,
  features,
  isIE = navigator.userAgent.match(/msie/i),
  isIE6 = navigator.userAgent.match(/msie 6/i),
  isMobile = navigator.userAgent.match(/mobile|opera m(ob|in)/i),
  isBackCompatIE = (isIE && document.compatMode === 'BackCompat'),
  noFixed = (isBackCompatIE || isIE6),
  screenX = null, screenX2 = null, screenY = null, scrollY = null, docHeight = null, vRndX = null, vRndY = null,
  windOffset = 1,
  windMultiplier = 2,
  flakeTypes = 6,
  fixedForEverything = false,
  targetElementIsRelative = false,
  opacitySupported = (function(){
    try {
      document.createElement('div').style.opacity = '0.5';
    } catch(e) {
      return false;
    }
    return true;
  }()),
  didInit = false,
  docFrag = document.createDocumentFragment();
  features = (function() {
    var getAnimationFrame;
    function timeoutShim(callback) {
      window.setTimeout(callback, 1000/(storm.animationInterval || 20));
    }
    var _animationFrame = (window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        timeoutShim);
    getAnimationFrame = _animationFrame ? function() {
      return _animationFrame.apply(window, arguments);
    } : null;
    var testDiv;
    testDiv = document.createElement('div');
    function has(prop) {
      var result = testDiv.style[prop];
      return (result !== undefined ? prop : null);
    }
    var localFeatures = {
      transform: {
        ie:  has('-ms-transform'),
        moz: has('MozTransform'),
        opera: has('OTransform'),
        webkit: has('webkitTransform'),
        w3: has('transform'),
        prop: null 
      },
      getAnimationFrame: getAnimationFrame
    };
    localFeatures.transform.prop = (
      localFeatures.transform.w3 || 
      localFeatures.transform.moz ||
      localFeatures.transform.webkit ||
      localFeatures.transform.ie ||
      localFeatures.transform.opera
    );
    testDiv = null;
    return localFeatures;
  }());
  this.timer = null;
  this.flakes = [];
  this.disabled = false;
  this.active = false;
  this.meltFrameCount = 20;
  this.meltFrames = [];
  this.setXY = function(o, x, y) {
    if (!o) {
      return false;
    }
    if (storm.usePixelPosition || targetElementIsRelative) {
      o.style.left = (x - storm.flakeWidth) + 'px';
      o.style.top = (y - storm.flakeHeight) + 'px';
    } else if (noFixed) {
      o.style.right = (100-(x/screenX*100)) + '%';
      o.style.top = (Math.min(y, docHeight-storm.flakeHeight)) + 'px';
    } else {
      if (!storm.flakeBottom) {
        o.style.right = (100-(x/screenX*100)) + '%';
        o.style.bottom = (100-(y/screenY*100)) + '%';
      } else {
        o.style.right = (100-(x/screenX*100)) + '%';
        o.style.top = (Math.min(y, docHeight-storm.flakeHeight)) + 'px';
      }
    }
  };
  this.events = (function() {
    var old = (!window.addEventListener && window.attachEvent), slice = Array.prototype.slice,
    evt = {
      add: (old?'attachEvent':'addEventListener'),
      remove: (old?'detachEvent':'removeEventListener')
    };
    function getArgs(oArgs) {
      var args = slice.call(oArgs), len = args.length;
      if (old) {
        args[1] = 'on' + args[1]; 
        if (len > 3) {
          args.pop(); 
        }
      } else if (len === 3) {
        args.push(false);
      }
      return args;
    }
    function apply(args, sType) {
      var element = args.shift(),
          method = [evt[sType]];
      if (old) {
        element[method](args[0], args[1]);
      } else {
        element[method].apply(element, args);
      }
    }
    function addEvent() {
      apply(getArgs(arguments), 'add');
    }
    function removeEvent() {
      apply(getArgs(arguments), 'remove');
    }
    return {
      add: addEvent,
      remove: removeEvent
    };
  }());
  function rnd(n,min) {
    if (isNaN(min)) {
      min = 0;
    }
    return (Math.random()*n)+min;
  }
  function plusMinus(n) {
    return (parseInt(rnd(2),10)===1?n*-1:n);
  }
  this.randomizeWind = function() {
    var i;
    vRndX = plusMinus(rnd(storm.vMaxX,0.2));
    vRndY = rnd(storm.vMaxY,0.2);
    if (this.flakes) {
      for (i=0; i<this.flakes.length; i++) {
        if (this.flakes[i].active) {
          this.flakes[i].setVelocities();
        }
      }
    }
  };
  this.scrollHandler = function() {
    var i;
    scrollY = (storm.flakeBottom ? 0 : parseInt(window.scrollY || document.documentElement.scrollTop || (noFixed ? document.body.scrollTop : 0), 10));
    if (isNaN(scrollY)) {
      scrollY = 0; 
    }
    if (!fixedForEverything && !storm.flakeBottom && storm.flakes) {
      for (i=0; i<storm.flakes.length; i++) {
        if (storm.flakes[i].active === 0) {
          storm.flakes[i].stick();
        }
      }
    }
  };
  this.resizeHandler = function() {
    if (window.innerWidth || window.innerHeight) {
      screenX = window.innerWidth - 16 - storm.flakeRightOffset;
      screenY = (storm.flakeBottom || window.innerHeight);
    } else {
      screenX = (document.documentElement.clientWidth || document.body.clientWidth || document.body.scrollWidth) - (!isIE ? 8 : 0) - storm.flakeRightOffset;
      screenY = storm.flakeBottom || document.documentElement.clientHeight || document.body.clientHeight || document.body.scrollHeight;
    }
    docHeight = document.body.offsetHeight;
    screenX2 = parseInt(screenX/2,10);
  };
  this.resizeHandlerAlt = function() {
    screenX = storm.targetElement.offsetWidth - storm.flakeRightOffset;
    screenY = storm.flakeBottom || storm.targetElement.offsetHeight;
    screenX2 = parseInt(screenX/2,10);
    docHeight = document.body.offsetHeight;
  };
  this.freeze = function() {
    if (!storm.disabled) {
      storm.disabled = 1;
    } else {
      return false;
    }
    storm.timer = null;
  };
  this.resume = function() {
    if (storm.disabled) {
       storm.disabled = 0;
    } else {
      return false;
    }
    storm.timerInit();
  };
  this.toggleSnow = function() {
    if (!storm.flakes.length) {
      storm.start();
    } else {
      storm.active = !storm.active;
      if (storm.active) {
        storm.show();
        storm.resume();
      } else {
        storm.stop();
        storm.freeze();
      }
    }
  };
  this.stop = function() {
    var i;
    this.freeze();
    for (i=0; i<this.flakes.length; i++) {
      this.flakes[i].o.style.display = 'none';
    }
    storm.events.remove(window,'scroll',storm.scrollHandler);
    storm.events.remove(window,'resize',storm.resizeHandler);
    if (storm.freezeOnBlur) {
      if (isIE) {
        storm.events.remove(document,'focusout',storm.freeze);
        storm.events.remove(document,'focusin',storm.resume);
      } else {
        storm.events.remove(window,'blur',storm.freeze);
        storm.events.remove(window,'focus',storm.resume);
      }
    }
  };
  this.show = function() {
    var i;
    for (i=0; i<this.flakes.length; i++) {
      this.flakes[i].o.style.display = 'block';
    }
  };
  this.SnowFlake = function(type,x,y) {
    var s = this;
    this.type = type;
    this.x = x||parseInt(rnd(screenX-20),10);
    this.y = (!isNaN(y)?y:-rnd(screenY)-12);
    this.vX = null;
    this.vY = null;
    this.vAmpTypes = [1,1.2,1.4,1.6,1.8]; 
    this.vAmp = this.vAmpTypes[this.type] || 1;
    this.melting = false;
    this.meltFrameCount = storm.meltFrameCount;
    this.meltFrames = storm.meltFrames;
    this.meltFrame = 0;
    this.twinkleFrame = 0;
    this.active = 1;
    this.fontSize = (10+(this.type/5)*10);
    this.o = document.createElement('div');
    this.o.innerHTML = storm.snowCharacter;
    if (storm.className) {
      this.o.setAttribute('class', storm.className);
    }
    this.o.style.color = storm.snowColor;
    this.o.style.position = (fixedForEverything?'fixed':'absolute');
    if (storm.useGPU && features.transform.prop) {
      this.o.style[features.transform.prop] = 'translate3d(0px, 0px, 0px)';
    }
    this.o.style.width = storm.flakeWidth+'px';
    this.o.style.height = storm.flakeHeight+'px';
    this.o.style.fontFamily = 'arial,verdana';
    this.o.style.cursor = 'default';
    this.o.style.overflow = 'hidden';
    this.o.style.fontWeight = 'normal';
    this.o.style.zIndex = storm.zIndex;
    docFrag.appendChild(this.o);
    this.refresh = function() {
      if (isNaN(s.x) || isNaN(s.y)) {
        return false;
      }
      storm.setXY(s.o, s.x, s.y);
    };
    this.stick = function() {
      if (noFixed || (storm.targetElement !== document.documentElement && storm.targetElement !== document.body)) {
        s.o.style.top = (screenY+scrollY-storm.flakeHeight)+'px';
      } else if (storm.flakeBottom) {
        s.o.style.top = storm.flakeBottom+'px';
      } else {
        s.o.style.display = 'none';
        s.o.style.bottom = '0%';
        s.o.style.position = 'fixed';
        s.o.style.display = 'block';
      }
    };
    this.vCheck = function() {
      if (s.vX>=0 && s.vX<0.2) {
        s.vX = 0.2;
      } else if (s.vX<0 && s.vX>-0.2) {
        s.vX = -0.2;
      }
      if (s.vY>=0 && s.vY<0.2) {
        s.vY = 0.2;
      }
    };
    this.move = function() {
      var vX = s.vX*windOffset, yDiff;
      s.x += vX;
      s.y += (s.vY*s.vAmp);
      if (s.x >= screenX || screenX-s.x < storm.flakeWidth) { 
        s.x = 0;
      } else if (vX < 0 && s.x-storm.flakeLeftOffset < -storm.flakeWidth) {
        s.x = screenX-storm.flakeWidth-1; 
      }
      s.refresh();
      yDiff = screenY+scrollY-s.y+storm.flakeHeight;
      if (yDiff<storm.flakeHeight) {
        s.active = 0;
        if (storm.snowStick) {
          s.stick();
        } else {
          s.recycle();
        }
      } else {
        if (storm.useMeltEffect && s.active && s.type < 3 && !s.melting && Math.random()>0.998) {
          s.melting = true;
          s.melt();
        }
        if (storm.useTwinkleEffect) {
          if (s.twinkleFrame < 0) {
            if (Math.random() > 0.97) {
              s.twinkleFrame = parseInt(Math.random() * 8, 10);
            }
          } else {
            s.twinkleFrame--;
            if (!opacitySupported) {
              s.o.style.visibility = (s.twinkleFrame && s.twinkleFrame % 2 === 0 ? 'hidden' : 'visible');
            } else {
              s.o.style.opacity = (s.twinkleFrame && s.twinkleFrame % 2 === 0 ? 0 : 1);
            }
          }
        }
      }
    };
    this.animate = function() {
      s.move();
    };
    this.setVelocities = function() {
      s.vX = vRndX+rnd(storm.vMaxX*0.12,0.1);
      s.vY = vRndY+rnd(storm.vMaxY*0.12,0.1);
    };
    this.setOpacity = function(o,opacity) {
      if (!opacitySupported) {
        return false;
      }
      o.style.opacity = opacity;
    };
    this.melt = function() {
      if (!storm.useMeltEffect || !s.melting) {
        s.recycle();
      } else {
        if (s.meltFrame < s.meltFrameCount) {
          s.setOpacity(s.o,s.meltFrames[s.meltFrame]);
          s.o.style.fontSize = s.fontSize-(s.fontSize*(s.meltFrame/s.meltFrameCount))+'px';
          s.o.style.lineHeight = storm.flakeHeight+2+(storm.flakeHeight*0.75*(s.meltFrame/s.meltFrameCount))+'px';
          s.meltFrame++;
        } else {
          s.recycle();
        }
      }
    };
    this.recycle = function() {
      s.o.style.display = 'none';
      s.o.style.position = (fixedForEverything?'fixed':'absolute');
      s.o.style.bottom = 'auto';
      s.setVelocities();
      s.vCheck();
      s.meltFrame = 0;
      s.melting = false;
      s.setOpacity(s.o,1);
      s.o.style.padding = '0px';
      s.o.style.margin = '0px';
      s.o.style.fontSize = s.fontSize+'px';
      s.o.style.lineHeight = (storm.flakeHeight+2)+'px';
      s.o.style.textAlign = 'center';
      s.o.style.verticalAlign = 'baseline';
      s.x = parseInt(rnd(screenX-storm.flakeWidth-20),10);
      s.y = parseInt(rnd(screenY)*-1,10)-storm.flakeHeight;
      s.refresh();
      s.o.style.display = 'block';
      s.active = 1;
    };
    this.recycle(); 
    this.refresh();
  };
  this.snow = function() {
    var active = 0, flake = null, i, j;
    for (i=0, j=storm.flakes.length; i<j; i++) {
      if (storm.flakes[i].active === 1) {
        storm.flakes[i].move();
        active++;
      }
      if (storm.flakes[i].melting) {
        storm.flakes[i].melt();
      }
    }
    if (active<storm.flakesMaxActive) {
      flake = storm.flakes[parseInt(rnd(storm.flakes.length),10)];
      if (flake.active === 0) {
        flake.melting = true;
      }
    }
    if (storm.timer) {
      features.getAnimationFrame(storm.snow);
    }
  };
  this.mouseMove = function(e) {
    if (!storm.followMouse) {
      return true;
    }
    var x = parseInt(e.clientX,10);
    if (x<screenX2) {
      windOffset = -windMultiplier+(x/screenX2*windMultiplier);
    } else {
      x -= screenX2;
      windOffset = (x/screenX2)*windMultiplier;
    }
  };
  this.createSnow = function(limit,allowInactive) {
    var i;
    for (i=0; i<limit; i++) {
      storm.flakes[storm.flakes.length] = new storm.SnowFlake(parseInt(rnd(flakeTypes),10));
      if (allowInactive || i>storm.flakesMaxActive) {
        storm.flakes[storm.flakes.length-1].active = -1;
      }
    }
    storm.targetElement.appendChild(docFrag);
  };
  this.timerInit = function() {
    storm.timer = true;
    storm.snow();
  };
  this.init = function() {
    var i;
    for (i=0; i<storm.meltFrameCount; i++) {
      storm.meltFrames.push(1-(i/storm.meltFrameCount));
    }
    storm.randomizeWind();
    storm.createSnow(storm.flakesMax); 
    storm.events.add(window,'resize',storm.resizeHandler);
    storm.events.add(window,'scroll',storm.scrollHandler);
    if (storm.freezeOnBlur) {
      if (isIE) {
        storm.events.add(document,'focusout',storm.freeze);
        storm.events.add(document,'focusin',storm.resume);
      } else {
        storm.events.add(window,'blur',storm.freeze);
        storm.events.add(window,'focus',storm.resume);
      }
    }
    storm.resizeHandler();
    storm.scrollHandler();
    if (storm.followMouse) {
      storm.events.add(isIE?document:window,'mousemove',storm.mouseMove);
    }
    storm.animationInterval = Math.max(20,storm.animationInterval);
    storm.timerInit();
  };
  this.start = function(bFromOnLoad) {
    if (!didInit) {
      didInit = true;
    } else if (bFromOnLoad) {
      return true;
    }
    if (typeof storm.targetElement === 'string') {
      var targetID = storm.targetElement;
      storm.targetElement = document.getElementById(targetID);
      if (!storm.targetElement) {
        throw new Error('Snowstorm: Unable to get targetElement "'+targetID+'"');
      }
    }
    if (!storm.targetElement) {
      storm.targetElement = (document.body || document.documentElement);
    }
    if (storm.targetElement !== document.documentElement && storm.targetElement !== document.body) {
      storm.resizeHandler = storm.resizeHandlerAlt;
      storm.usePixelPosition = true;
    }
    storm.resizeHandler(); 
    storm.usePositionFixed = (storm.usePositionFixed && !noFixed && !storm.flakeBottom); 
    if (window.getComputedStyle) {
      try {
        targetElementIsRelative = (window.getComputedStyle(storm.targetElement, null).getPropertyValue('position') === 'relative');
      } catch(e) {
        targetElementIsRelative = false;
      }
    }
    fixedForEverything = storm.usePositionFixed;
    if (screenX && screenY && !storm.disabled) {
      storm.init();
      storm.active = true;
    }
  };
  function doDelayedStart() {
    window.setTimeout(function() {
      storm.start(true);
    }, 20);
    storm.events.remove(isIE?document:window,'mousemove',doDelayedStart);
  }
  function doStart() {
    if (!storm.excludeMobile || !isMobile) {
      doDelayedStart();
    }
    storm.events.remove(window, 'load', doStart);
  }
  if (storm.autoStart) {
    storm.events.add(window, 'load', doStart, false);
  }
  return this;
}(window, document));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvZGUuanMiLCJrYXJfMy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN2VEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiY29kZS5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciByb3dzID0gMTA7XHJcbnZhciBjb2xzID0gNjAwO1xyXG5cclxuXHJcbnZhciBwbGF5aW5nID0gZmFsc2U7XHJcblxyXG52YXIgZ3JpZCA9IG5ldyBBcnJheShyb3dzKTtcclxudmFyIG5leHRHcmlkID0gbmV3IEFycmF5KHJvd3MpO1xyXG5cclxudmFyIHRpbWVyO1xyXG52YXIgcmVwcm9kdWN0aW9uVGltZSA9IDEwMDtcclxuXHJcbmZ1bmN0aW9uIGluaXRpYWxpemVHcmlkcygpIHtcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcm93czsgaSsrKSB7XHJcbiAgICAgICAgZ3JpZFtpXSA9IG5ldyBBcnJheShjb2xzKTtcclxuICAgICAgICBuZXh0R3JpZFtpXSA9IG5ldyBBcnJheShjb2xzKTtcclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gcmVzZXRHcmlkcygpIHtcclxuXHJcblxyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCByb3dzOyBpKyspIHtcclxuICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IGNvbHM7IGorKykge1xyXG4gICAgICAgICAgICBncmlkW2ldW2pdID0gMDtcclxuICAgICAgICAgICAgbmV4dEdyaWRbaV1bal0gPSAwO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gY29weUFuZFJlc2V0R3JpZCgpIHtcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcm93czsgaSsrKSB7XHJcbiAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBjb2xzOyBqKyspIHtcclxuICAgICAgICAgICAgZ3JpZFtpXVtqXSA9IG5leHRHcmlkW2ldW2pdO1xyXG4gICAgICAgICAgICBuZXh0R3JpZFtpXVtqXSA9IDA7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG4vLyBJbml0aWFsaXplXHJcbmZ1bmN0aW9uIGluaXRpYWxpemUoKSB7XHJcbiAgICBjcmVhdGVUYWJsZSgpO1xyXG4gICAgaW5pdGlhbGl6ZUdyaWRzKCk7XHJcbiAgICByZXNldEdyaWRzKCk7XHJcbiAgICBzZXR1cENvbnRyb2xCdXR0b25zKCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHNldFNpemUoKSB7XHJcblxyXG4gICAgbl9yb3dzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJoZWlnaHRJblwiKS52YWx1ZTtcclxuICAgIG5fY29scyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwid2lkdGhJblwiKS52YWx1ZTtcclxuICAgIHJvd3MgPSBuX3Jvd3M7XHJcbiAgICBjb2xzID0gbl9jb2xzO1xyXG5cclxuICAgIHZhciBlbXB0eVRhYmxlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJncmlkQ29udGFpbmVyXCIpLmlubmVySFRNTCA9IFwiXCI7XHJcbiAgICB2YXIgZ3JpZENvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdncmlkQ29udGFpbmVyJyk7XHJcblxyXG4gICAgaWYgKCFncmlkQ29udGFpbmVyKSB7XHJcbiAgICAgICAgLy8gVGhyb3cgZXJyb3JcclxuICAgICAgICBjb25zb2xlLmVycm9yKFwiUHJvYmxlbTogTm8gZGl2IGZvciB0aGUgZHJpZCB0YWJsZSFcIik7XHJcbiAgICB9IGVsc2Uge1xyXG5cclxuXHJcbiAgICAgICAgdmFyIHRhYmxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInRhYmxlXCIpO1xyXG5cclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHJvd3M7IGkrKykge1xyXG4gICAgICAgICAgICB2YXIgdHIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwidHJcIik7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgY29sczsgaisrKSB7Ly9cclxuICAgICAgICAgICAgICAgIHZhciBjZWxsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInRkXCIpO1xyXG4gICAgICAgICAgICAgICAgY2VsbC5zZXRBdHRyaWJ1dGUoXCJpZFwiLCBpICsgXCJfXCIgKyBqKTtcclxuICAgICAgICAgICAgICAgIGNlbGwuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJkZWFkXCIpO1xyXG4gICAgICAgICAgICAgICAgY2VsbC5vbmNsaWNrID0gY2VsbENsaWNrSGFuZGxlcjtcclxuICAgICAgICAgICAgICAgIHRyLmFwcGVuZENoaWxkKGNlbGwpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRhYmxlLmFwcGVuZENoaWxkKHRyKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZ3JpZENvbnRhaW5lci5hcHBlbmRDaGlsZCh0YWJsZSk7XHJcbiAgICB9XHJcblxyXG59XHJcblxyXG4vLyBMYXkgb3V0IHRoZSBib2FyZFxyXG5mdW5jdGlvbiBjcmVhdGVUYWJsZSgpIHtcclxuXHJcbiAgICB2YXIgZ3JpZENvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdncmlkQ29udGFpbmVyJyk7XHJcbiAgICBpZiAoIWdyaWRDb250YWluZXIpIHtcclxuICAgICAgICAvLyBUaHJvdyBlcnJvclxyXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXCJQcm9ibGVtOiBObyBkaXYgZm9yIHRoZSBkcmlkIHRhYmxlIVwiKTtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgdGFibGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwidGFibGVcIik7XHJcblxyXG4gICAgcm93cyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaGVpZ2h0SW5cIikudmFsdWU7XHJcbiAgICBjb2xzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ3aWR0aEluXCIpLnZhbHVlO1xyXG5cclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcm93czsgaSsrKSB7XHJcbiAgICAgICAgdmFyIHRyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInRyXCIpO1xyXG4gICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgY29sczsgaisrKSB7Ly9cclxuICAgICAgICAgICAgdmFyIGNlbGwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwidGRcIik7XHJcbiAgICAgICAgICAgIGNlbGwuc2V0QXR0cmlidXRlKFwiaWRcIiwgaSArIFwiX1wiICsgaik7XHJcbiAgICAgICAgICAgIGNlbGwuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJkZWFkXCIpO1xyXG4gICAgICAgICAgICBjZWxsLm9uY2xpY2sgPSBjZWxsQ2xpY2tIYW5kbGVyO1xyXG4gICAgICAgICAgICB0ci5hcHBlbmRDaGlsZChjZWxsKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGFibGUuYXBwZW5kQ2hpbGQodHIpO1xyXG4gICAgfVxyXG5cclxuICAgIGdyaWRDb250YWluZXIuYXBwZW5kQ2hpbGQodGFibGUpO1xyXG5cclxufVxyXG5cclxuZnVuY3Rpb24gY2VsbENsaWNrSGFuZGxlcigpIHtcclxuICAgIHZhciByb3djb2wgPSB0aGlzLmlkLnNwbGl0KFwiX1wiKTtcclxuICAgIHZhciByb3cgPSByb3djb2xbMF07XHJcbiAgICB2YXIgY29sID0gcm93Y29sWzFdO1xyXG5cclxuICAgIHZhciBjbGFzc2VzID0gdGhpcy5nZXRBdHRyaWJ1dGUoXCJjbGFzc1wiKTtcclxuICAgIGlmIChjbGFzc2VzLmluZGV4T2YoXCJsaXZlXCIpID4gLTEpIHtcclxuICAgICAgICB0aGlzLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIFwiZGVhZFwiKTtcclxuICAgICAgICBncmlkW3Jvd11bY29sXSA9IDA7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJsaXZlXCIpO1xyXG4gICAgICAgIGdyaWRbcm93XVtjb2xdID0gMTtcclxuICAgIH1cclxuXHJcbn1cclxuXHJcbmZ1bmN0aW9uIHVwZGF0ZVZpZXcoKSB7XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHJvd3M7IGkrKykge1xyXG4gICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgY29sczsgaisrKSB7XHJcbiAgICAgICAgICAgIHZhciBjZWxsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaSArIFwiX1wiICsgaik7XHJcbiAgICAgICAgICAgIGlmIChncmlkW2ldW2pdID09IDApIHtcclxuICAgICAgICAgICAgICAgIGNlbGwuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJkZWFkXCIpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgY2VsbC5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBcImxpdmVcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHNldHVwQ29udHJvbEJ1dHRvbnMoKSB7XHJcbiAgICAvLyBidXR0b24gdG8gc3RhcnRcclxuICAgIHZhciBzdGFydEJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdGFydCcpO1xyXG4gICAgc3RhcnRCdXR0b24ub25jbGljayA9IHN0YXJ0QnV0dG9uSGFuZGxlcjtcclxuXHJcbiAgICAvLyBidXR0b24gdG8gY2xlYXJcclxuICAgIHZhciBjbGVhckJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjbGVhcicpO1xyXG4gICAgY2xlYXJCdXR0b24ub25jbGljayA9IGNsZWFyQnV0dG9uSGFuZGxlcjtcclxuXHJcbiAgICAvLyBidXR0b24gdG8gc2V0IHJhbmRvbSBpbml0aWFsIHN0YXRlXHJcbiAgICB2YXIgcmFuZG9tQnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyYW5kb21cIik7XHJcbiAgICByYW5kb21CdXR0b24ub25jbGljayA9IHJhbmRvbUJ1dHRvbkhhbmRsZXI7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJhbmRvbUJ1dHRvbkhhbmRsZXIoKSB7XHJcbiAgICBpZiAocGxheWluZykgcmV0dXJuO1xyXG5cclxuICAgIGNsZWFyQnV0dG9uSGFuZGxlcigpO1xyXG5cclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcm93czsgaSsrKSB7XHJcbiAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBjb2xzOyBqKyspIHtcclxuICAgICAgICAgICAgdmFyIGlzTGl2ZSA9IE1hdGgucm91bmQoTWF0aC5yYW5kb20oKSk7XHJcbiAgICAgICAgICAgIGlmIChpc0xpdmUgPT0gMSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGNlbGwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpICsgXCJfXCIgKyBqKTtcclxuICAgICAgICAgICAgICAgIGNlbGwuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJsaXZlXCIpO1xyXG4gICAgICAgICAgICAgICAgZ3JpZFtpXVtqXSA9IDE7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG5mdW5jdGlvbiBsZXZlbENoYW5nZSgpIHtcclxuICAgIHZhciBsZXZlbExvYWQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImxldmVsXCIpLnZhbHVlO1xyXG4gICAgbGV2ZWxMb2FkLnNwbGl0KFwiXFxuXCIpO1xyXG5cclxuICAgIGZvciAodmFyIHggPSAwOyB4IDwgbGV2ZWxMb2FkLmxlbmd0aDsgeCsrKSB7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCByb3dzOyBpKyspIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBjb2xzOyBqKyspIHtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgaXNMaXZlID0gbGV2ZWxMb2FkW2pdW2ldO1xyXG4gICAgICAgICAgICAgICAgaWYgKGlzTGl2ZSA9PSAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNlbGwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpICsgXCJfXCIgKyBqKTtcclxuICAgICAgICAgICAgICAgICAgICBjZWxsLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIFwibGl2ZVwiKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoaXNMaXZlID09IDAgfHwgXCJcIikge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBjZWxsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaSArIFwiX1wiICsgaik7XHJcbiAgICAgICAgICAgICAgICAgICAgY2VsbC5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBcImRlYWRcIik7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbn1cclxuXHJcbi8vIGNsZWFyIHRoZSBncmlkXHJcbmZ1bmN0aW9uIGNsZWFyQnV0dG9uSGFuZGxlcigpIHtcclxuICAgIGNvbnNvbGUubG9nKFwiQ2xlYXIgdGhlIGdhbWU6IHN0b3AgcGxheWluZywgY2xlYXIgdGhlIGdyaWRcIik7XHJcblxyXG4gICAgcmVzZXRHcmlkcygpO1xyXG4gICAgcGxheWluZyA9IGZhbHNlO1xyXG4gICAgdmFyIHN0YXJ0QnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N0YXJ0Jyk7XHJcbiAgICBzdGFydEJ1dHRvbi5pbm5lckhUTUwgPSBcIlN0YXJ0XCI7XHJcbiAgICBjbGVhclRpbWVvdXQodGltZXIpO1xyXG5cclxuICAgIHZhciBjZWxsc0xpc3QgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwibGl2ZVwiKTtcclxuICAgIC8vIGNvbnZlcnQgdG8gYXJyYXkgZmlyc3QsIG90aGVyd2lzZSwgeW91J3JlIHdvcmtpbmcgb24gYSBsaXZlIG5vZGUgbGlzdFxyXG4gICAgLy8gYW5kIHRoZSB1cGRhdGUgZG9lc24ndCB3b3JrIVxyXG4gICAgdmFyIGNlbGxzID0gW107XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNlbGxzTGlzdC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGNlbGxzLnB1c2goY2VsbHNMaXN0W2ldKTtcclxuICAgIH1cclxuXHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNlbGxzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgY2VsbHNbaV0uc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJkZWFkXCIpO1xyXG4gICAgfVxyXG4gICAgcmVzZXRHcmlkcztcclxufVxyXG5cclxuLy8gc3RhcnQvcGF1c2UvY29udGludWUgdGhlIGdhbWVcclxuZnVuY3Rpb24gc3RhcnRCdXR0b25IYW5kbGVyKCkge1xyXG4gICAgaWYgKHBsYXlpbmcpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcIlBhdXNlIHRoZSBnYW1lXCIpO1xyXG4gICAgICAgIHBsYXlpbmcgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgdGhpcy5pbm5lckhUTUwgPSBcIkNvbnRpbnVlXCI7XHJcbiAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVyKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJDb250aW51ZSB0aGUgZ2FtZVwiKTtcclxuICAgICAgICBwbGF5aW5nID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLmlubmVySFRNTCA9IFwiUGF1c2VcIjtcclxuICAgICAgICBwbGF5KCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8vIHJ1biB0aGUgbGlmZSBnYW1lXHJcbmZ1bmN0aW9uIHBsYXkoKSB7XHJcbiAgICBjb21wdXRlTmV4dEdlbigpO1xyXG5cclxuICAgIGlmIChwbGF5aW5nKSB7XHJcbiAgICAgICAgdGltZXIgPSBzZXRUaW1lb3V0KHBsYXksIHJlcHJvZHVjdGlvblRpbWUpO1xyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBjb21wdXRlTmV4dEdlbigpIHtcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcm93czsgaSsrKSB7XHJcbiAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBjb2xzOyBqKyspIHtcclxuICAgICAgICAgICAgYXBwbHlSdWxlcyhpLCBqKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gY29weSBOZXh0R3JpZCB0byBncmlkLCBhbmQgcmVzZXQgbmV4dEdyaWRcclxuICAgIGNvcHlBbmRSZXNldEdyaWQoKTtcclxuICAgIC8vIGNvcHkgYWxsIDEgdmFsdWVzIHRvIFwibGl2ZVwiIGluIHRoZSB0YWJsZVxyXG4gICAgdXBkYXRlVmlldygpO1xyXG59XHJcblxyXG4vLyBSVUxFU1xyXG4vLyBBbnkgbGl2ZSBjZWxsIHdpdGggZmV3ZXIgdGhhbiB0d28gbGl2ZSBuZWlnaGJvdXJzIGRpZXMsIGFzIGlmIGNhdXNlZCBieSB1bmRlci1wb3B1bGF0aW9uLlxyXG4vLyBBbnkgbGl2ZSBjZWxsIHdpdGggdHdvIG9yIHRocmVlIGxpdmUgbmVpZ2hib3VycyBsaXZlcyBvbiB0byB0aGUgbmV4dCBnZW5lcmF0aW9uLlxyXG4vLyBBbnkgbGl2ZSBjZWxsIHdpdGggbW9yZSB0aGFuIHRocmVlIGxpdmUgbmVpZ2hib3VycyBkaWVzLCBhcyBpZiBieSBvdmVyY3Jvd2RpbmcuXHJcbi8vIEFueSBkZWFkIGNlbGwgd2l0aCBleGFjdGx5IHRocmVlIGxpdmUgbmVpZ2hib3VycyBiZWNvbWVzIGEgbGl2ZSBjZWxsLCBhcyBpZiBieSByZXByb2R1Y3Rpb24uXHJcblxyXG5mdW5jdGlvbiBhcHBseVJ1bGVzKHJvdywgY29sKSB7XHJcbiAgICB2YXIgbnVtTmVpZ2hib3JzID0gY291bnROZWlnaGJvcnMocm93LCBjb2wpO1xyXG4gICAgaWYgKGdyaWRbcm93XVtjb2xdID09IDEpIHtcclxuICAgICAgICBpZiAobnVtTmVpZ2hib3JzIDwgMikge1xyXG4gICAgICAgICAgICBuZXh0R3JpZFtyb3ddW2NvbF0gPSAwO1xyXG4gICAgICAgIH0gZWxzZSBpZiAobnVtTmVpZ2hib3JzID09IDIgfHwgbnVtTmVpZ2hib3JzID09IDMpIHtcclxuICAgICAgICAgICAgbmV4dEdyaWRbcm93XVtjb2xdID0gMTtcclxuICAgICAgICB9IGVsc2UgaWYgKG51bU5laWdoYm9ycyA+IDMpIHtcclxuICAgICAgICAgICAgbmV4dEdyaWRbcm93XVtjb2xdID0gMDtcclxuICAgICAgICB9XHJcbiAgICB9IGVsc2UgaWYgKGdyaWRbcm93XVtjb2xdID09IDApIHtcclxuICAgICAgICBpZiAobnVtTmVpZ2hib3JzID09IDMpIHtcclxuICAgICAgICAgICAgbmV4dEdyaWRbcm93XVtjb2xdID0gMTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNvdW50TmVpZ2hib3JzKHJvdywgY29sKSB7XHJcbiAgICB2YXIgY291bnQgPSAwO1xyXG4gICAgaWYgKHJvdyAtIDEgPj0gMCkge1xyXG4gICAgICAgIGlmIChncmlkW3JvdyAtIDFdW2NvbF0gPT0gMSkgY291bnQrKztcclxuICAgIH1cclxuICAgIGlmIChyb3cgLSAxID49IDAgJiYgY29sIC0gMSA+PSAwKSB7XHJcbiAgICAgICAgaWYgKGdyaWRbcm93IC0gMV1bY29sIC0gMV0gPT0gMSkgY291bnQrKztcclxuICAgIH1cclxuICAgIGlmIChyb3cgLSAxID49IDAgJiYgY29sICsgMSA8IGNvbHMpIHtcclxuICAgICAgICBpZiAoZ3JpZFtyb3cgLSAxXVtjb2wgKyAxXSA9PSAxKSBjb3VudCsrO1xyXG4gICAgfVxyXG4gICAgaWYgKGNvbCAtIDEgPj0gMCkge1xyXG4gICAgICAgIGlmIChncmlkW3Jvd11bY29sIC0gMV0gPT0gMSkgY291bnQrKztcclxuICAgIH1cclxuICAgIGlmIChjb2wgKyAxIDwgY29scykge1xyXG4gICAgICAgIGlmIChncmlkW3Jvd11bY29sICsgMV0gPT0gMSkgY291bnQrKztcclxuICAgIH1cclxuICAgIGlmIChyb3cgKyAxIDwgcm93cykge1xyXG4gICAgICAgIGlmIChncmlkW3JvdyArIDFdW2NvbF0gPT0gMSkgY291bnQrKztcclxuICAgIH1cclxuICAgIGlmIChyb3cgKyAxIDwgcm93cyAmJiBjb2wgLSAxID49IDApIHtcclxuICAgICAgICBpZiAoZ3JpZFtyb3cgKyAxXVtjb2wgLSAxXSA9PSAxKSBjb3VudCsrO1xyXG4gICAgfVxyXG4gICAgaWYgKHJvdyArIDEgPCByb3dzICYmIGNvbCArIDEgPCBjb2xzKSB7XHJcbiAgICAgICAgaWYgKGdyaWRbcm93ICsgMV1bY29sICsgMV0gPT0gMSkgY291bnQrKztcclxuICAgIH1cclxuICAgIHJldHVybiBjb3VudDtcclxufVxyXG5cclxuLy8gU3RhcnQgZXZlcnl0aGluZ1xyXG53aW5kb3cub25sb2FkID0gaW5pdGlhbGl6ZTsiLCIvKiogQGxpY2Vuc2VcclxuICogREhUTUwgU25vd3N0b3JtISBKYXZhU2NyaXB0LWJhc2VkIHNub3cgZm9yIHdlYiBwYWdlc1xyXG4gKiBNYWtpbmcgaXQgc25vdyBvbiB0aGUgaW50ZXJuZXRzIHNpbmNlIDIwMDMuIFlvdSdyZSB3ZWxjb21lLlxyXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gKiBWZXJzaW9uIDEuNDQuMjAxMzEyMDggKFByZXZpb3VzIHJldjogMS40NC4yMDEzMTEyNSlcclxuICogQ29weXJpZ2h0IChjKSAyMDA3LCBTY290dCBTY2hpbGxlci4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cclxuICogQ29kZSBwcm92aWRlZCB1bmRlciB0aGUgQlNEIExpY2Vuc2VcclxuICogaHR0cDovL3NjaGlsbG1hbmlhLmNvbS9wcm9qZWN0cy9zbm93c3Rvcm0vbGljZW5zZS50eHRcclxuICovXHJcblxyXG4vKmpzbGludCBub21lbjogdHJ1ZSwgcGx1c3BsdXM6IHRydWUsIHNsb3BweTogdHJ1ZSwgdmFyczogdHJ1ZSwgd2hpdGU6IHRydWUgKi9cclxuLypnbG9iYWwgd2luZG93LCBkb2N1bWVudCwgbmF2aWdhdG9yLCBjbGVhckludGVydmFsLCBzZXRJbnRlcnZhbCAqL1xyXG5cclxudmFyIHNub3dTdG9ybSA9IChmdW5jdGlvbih3aW5kb3csIGRvY3VtZW50KSB7XHJcblxyXG4gIC8vIC0tLSBjb21tb24gcHJvcGVydGllcyAtLS1cclxuXHJcbiAgdGhpcy5hdXRvU3RhcnQgPSB0cnVlOyAgICAgICAgICAvLyBXaGV0aGVyIHRoZSBzbm93IHNob3VsZCBzdGFydCBhdXRvbWF0aWNhbGx5IG9yIG5vdC5cclxuICB0aGlzLmV4Y2x1ZGVNb2JpbGUgPSB0cnVlOyAgICAgIC8vIFNub3cgaXMgbGlrZWx5IHRvIGJlIGJhZCBuZXdzIGZvciBtb2JpbGUgcGhvbmVzJyBDUFVzIChhbmQgYmF0dGVyaWVzLikgRW5hYmxlIGF0IHlvdXIgb3duIHJpc2suXHJcbiAgdGhpcy5mbGFrZXNNYXggPSAxMjg7ICAgICAgICAgICAvLyBMaW1pdCB0b3RhbCBhbW91bnQgb2Ygc25vdyBtYWRlIChmYWxsaW5nICsgc3RpY2tpbmcpXHJcbiAgdGhpcy5mbGFrZXNNYXhBY3RpdmUgPSA2NDsgICAgICAvLyBMaW1pdCBhbW91bnQgb2Ygc25vdyBmYWxsaW5nIGF0IG9uY2UgKGxlc3MgPSBsb3dlciBDUFUgdXNlKVxyXG4gIHRoaXMuYW5pbWF0aW9uSW50ZXJ2YWwgPSAzMzsgICAgLy8gVGhlb3JldGljYWwgXCJtaWxpc2Vjb25kcyBwZXIgZnJhbWVcIiBtZWFzdXJlbWVudC4gMjAgPSBmYXN0ICsgc21vb3RoLCBidXQgaGlnaCBDUFUgdXNlLiA1MCA9IG1vcmUgY29uc2VydmF0aXZlLCBidXQgc2xvd2VyXHJcbiAgdGhpcy51c2VHUFUgPSB0cnVlOyAgICAgICAgICAgICAvLyBFbmFibGUgdHJhbnNmb3JtLWJhc2VkIGhhcmR3YXJlIGFjY2VsZXJhdGlvbiwgcmVkdWNlIENQVSBsb2FkLlxyXG4gIHRoaXMuY2xhc3NOYW1lID0gbnVsbDsgICAgICAgICAgLy8gQ1NTIGNsYXNzIG5hbWUgZm9yIGZ1cnRoZXIgY3VzdG9taXphdGlvbiBvbiBzbm93IGVsZW1lbnRzXHJcbiAgdGhpcy5leGNsdWRlTW9iaWxlID0gdHJ1ZTsgICAgICAvLyBTbm93IGlzIGxpa2VseSB0byBiZSBiYWQgbmV3cyBmb3IgbW9iaWxlIHBob25lcycgQ1BVcyAoYW5kIGJhdHRlcmllcy4pIEJ5IGRlZmF1bHQsIGJlIG5pY2UuXHJcbiAgdGhpcy5mbGFrZUJvdHRvbSA9IG51bGw7ICAgICAgICAvLyBJbnRlZ2VyIGZvciBZIGF4aXMgc25vdyBsaW1pdCwgMCBvciBudWxsIGZvciBcImZ1bGwtc2NyZWVuXCIgc25vdyBlZmZlY3RcclxuICB0aGlzLmZvbGxvd01vdXNlID0gdHJ1ZTsgICAgICAgIC8vIFNub3cgbW92ZW1lbnQgY2FuIHJlc3BvbmQgdG8gdGhlIHVzZXIncyBtb3VzZVxyXG4gIHRoaXMuc25vd0NvbG9yID0gJyNmZmYnOyAgICAgICAgLy8gRG9uJ3QgZWF0IChvciB1c2U/KSB5ZWxsb3cgc25vdy5cclxuICB0aGlzLnNub3dDaGFyYWN0ZXIgPSAnJmJ1bGw7JzsgIC8vICZidWxsOyA9IGJ1bGxldCwgJm1pZGRvdDsgaXMgc3F1YXJlIG9uIHNvbWUgc3lzdGVtcyBldGMuXHJcbiAgdGhpcy5zbm93U3RpY2sgPSB0cnVlOyAgICAgICAgICAvLyBXaGV0aGVyIG9yIG5vdCBzbm93IHNob3VsZCBcInN0aWNrXCIgYXQgdGhlIGJvdHRvbS4gV2hlbiBvZmYsIHdpbGwgbmV2ZXIgY29sbGVjdC5cclxuICB0aGlzLnRhcmdldEVsZW1lbnQgPSBudWxsOyAgICAgIC8vIGVsZW1lbnQgd2hpY2ggc25vdyB3aWxsIGJlIGFwcGVuZGVkIHRvIChudWxsID0gZG9jdW1lbnQuYm9keSkgLSBjYW4gYmUgYW4gZWxlbWVudCBJRCBlZy4gJ215RGl2Jywgb3IgYSBET00gbm9kZSByZWZlcmVuY2VcclxuICB0aGlzLnVzZU1lbHRFZmZlY3QgPSB0cnVlOyAgICAgIC8vIFdoZW4gcmVjeWNsaW5nIGZhbGxlbiBzbm93IChvciByYXJlbHksIHdoZW4gZmFsbGluZyksIGhhdmUgaXQgXCJtZWx0XCIgYW5kIGZhZGUgb3V0IGlmIGJyb3dzZXIgc3VwcG9ydHMgaXRcclxuICB0aGlzLnVzZVR3aW5rbGVFZmZlY3QgPSBmYWxzZTsgIC8vIEFsbG93IHNub3cgdG8gcmFuZG9tbHkgXCJmbGlja2VyXCIgaW4gYW5kIG91dCBvZiB2aWV3IHdoaWxlIGZhbGxpbmdcclxuICB0aGlzLnVzZVBvc2l0aW9uRml4ZWQgPSBmYWxzZTsgIC8vIHRydWUgPSBzbm93IGRvZXMgbm90IHNoaWZ0IHZlcnRpY2FsbHkgd2hlbiBzY3JvbGxpbmcuIE1heSBpbmNyZWFzZSBDUFUgbG9hZCwgZGlzYWJsZWQgYnkgZGVmYXVsdCAtIGlmIGVuYWJsZWQsIHVzZWQgb25seSB3aGVyZSBzdXBwb3J0ZWRcclxuICB0aGlzLnVzZVBpeGVsUG9zaXRpb24gPSBmYWxzZTsgIC8vIFdoZXRoZXIgdG8gdXNlIHBpeGVsIHZhbHVlcyBmb3Igc25vdyB0b3AvbGVmdCB2cy4gcGVyY2VudGFnZXMuIEF1dG8tZW5hYmxlZCBpZiBib2R5IGlzIHBvc2l0aW9uOnJlbGF0aXZlIG9yIHRhcmdldEVsZW1lbnQgaXMgc3BlY2lmaWVkLlxyXG5cclxuICAvLyAtLS0gbGVzcy11c2VkIGJpdHMgLS0tXHJcblxyXG4gIHRoaXMuZnJlZXplT25CbHVyID0gdHJ1ZTsgICAgICAgLy8gT25seSBzbm93IHdoZW4gdGhlIHdpbmRvdyBpcyBpbiBmb2N1cyAoZm9yZWdyb3VuZC4pIFNhdmVzIENQVS5cclxuICB0aGlzLmZsYWtlTGVmdE9mZnNldCA9IDA7ICAgICAgIC8vIExlZnQgbWFyZ2luL2d1dHRlciBzcGFjZSBvbiBlZGdlIG9mIGNvbnRhaW5lciAoZWcuIGJyb3dzZXIgd2luZG93LikgQnVtcCB1cCB0aGVzZSB2YWx1ZXMgaWYgc2VlaW5nIGhvcml6b250YWwgc2Nyb2xsYmFycy5cclxuICB0aGlzLmZsYWtlUmlnaHRPZmZzZXQgPSAwOyAgICAgIC8vIFJpZ2h0IG1hcmdpbi9ndXR0ZXIgc3BhY2Ugb24gZWRnZSBvZiBjb250YWluZXJcclxuICB0aGlzLmZsYWtlV2lkdGggPSA4OyAgICAgICAgICAgIC8vIE1heCBwaXhlbCB3aWR0aCByZXNlcnZlZCBmb3Igc25vdyBlbGVtZW50XHJcbiAgdGhpcy5mbGFrZUhlaWdodCA9IDg7ICAgICAgICAgICAvLyBNYXggcGl4ZWwgaGVpZ2h0IHJlc2VydmVkIGZvciBzbm93IGVsZW1lbnRcclxuICB0aGlzLnZNYXhYID0gNTsgICAgICAgICAgICAgICAgIC8vIE1heGltdW0gWCB2ZWxvY2l0eSByYW5nZSBmb3Igc25vd1xyXG4gIHRoaXMudk1heFkgPSA0OyAgICAgICAgICAgICAgICAgLy8gTWF4aW11bSBZIHZlbG9jaXR5IHJhbmdlIGZvciBzbm93XHJcbiAgdGhpcy56SW5kZXggPSAwOyAgICAgICAgICAgICAgICAvLyBDU1Mgc3RhY2tpbmcgb3JkZXIgYXBwbGllZCB0byBlYWNoIHNub3dmbGFrZVxyXG5cclxuICAvLyAtLS0gXCJObyB1c2VyLXNlcnZpY2VhYmxlIHBhcnRzIGluc2lkZVwiIHBhc3QgdGhpcyBwb2ludCwgeWFkZGEgeWFkZGEgLS0tXHJcblxyXG4gIHZhciBzdG9ybSA9IHRoaXMsXHJcbiAgZmVhdHVyZXMsXHJcbiAgLy8gVUEgc25pZmZpbmcgYW5kIGJhY2tDb21wYXQgcmVuZGVyaW5nIG1vZGUgY2hlY2tzIGZvciBmaXhlZCBwb3NpdGlvbiwgZXRjLlxyXG4gIGlzSUUgPSBuYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKC9tc2llL2kpLFxyXG4gIGlzSUU2ID0gbmF2aWdhdG9yLnVzZXJBZ2VudC5tYXRjaCgvbXNpZSA2L2kpLFxyXG4gIGlzTW9iaWxlID0gbmF2aWdhdG9yLnVzZXJBZ2VudC5tYXRjaCgvbW9iaWxlfG9wZXJhIG0ob2J8aW4pL2kpLFxyXG4gIGlzQmFja0NvbXBhdElFID0gKGlzSUUgJiYgZG9jdW1lbnQuY29tcGF0TW9kZSA9PT0gJ0JhY2tDb21wYXQnKSxcclxuICBub0ZpeGVkID0gKGlzQmFja0NvbXBhdElFIHx8IGlzSUU2KSxcclxuICBzY3JlZW5YID0gbnVsbCwgc2NyZWVuWDIgPSBudWxsLCBzY3JlZW5ZID0gbnVsbCwgc2Nyb2xsWSA9IG51bGwsIGRvY0hlaWdodCA9IG51bGwsIHZSbmRYID0gbnVsbCwgdlJuZFkgPSBudWxsLFxyXG4gIHdpbmRPZmZzZXQgPSAxLFxyXG4gIHdpbmRNdWx0aXBsaWVyID0gMixcclxuICBmbGFrZVR5cGVzID0gNixcclxuICBmaXhlZEZvckV2ZXJ5dGhpbmcgPSBmYWxzZSxcclxuICB0YXJnZXRFbGVtZW50SXNSZWxhdGl2ZSA9IGZhbHNlLFxyXG4gIG9wYWNpdHlTdXBwb3J0ZWQgPSAoZnVuY3Rpb24oKXtcclxuICAgIHRyeSB7XHJcbiAgICAgIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpLnN0eWxlLm9wYWNpdHkgPSAnMC41JztcclxuICAgIH0gY2F0Y2goZSkge1xyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdHJ1ZTtcclxuICB9KCkpLFxyXG4gIGRpZEluaXQgPSBmYWxzZSxcclxuICBkb2NGcmFnID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xyXG5cclxuICBmZWF0dXJlcyA9IChmdW5jdGlvbigpIHtcclxuXHJcbiAgICB2YXIgZ2V0QW5pbWF0aW9uRnJhbWU7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBoYXQgdGlwOiBwYXVsIGlyaXNoXHJcbiAgICAgKiBodHRwOi8vcGF1bGlyaXNoLmNvbS8yMDExL3JlcXVlc3RhbmltYXRpb25mcmFtZS1mb3Itc21hcnQtYW5pbWF0aW5nL1xyXG4gICAgICogaHR0cHM6Ly9naXN0LmdpdGh1Yi5jb20vODM4Nzg1XHJcbiAgICAgKi9cclxuXHJcbiAgICBmdW5jdGlvbiB0aW1lb3V0U2hpbShjYWxsYmFjaykge1xyXG4gICAgICB3aW5kb3cuc2V0VGltZW91dChjYWxsYmFjaywgMTAwMC8oc3Rvcm0uYW5pbWF0aW9uSW50ZXJ2YWwgfHwgMjApKTtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgX2FuaW1hdGlvbkZyYW1lID0gKHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHxcclxuICAgICAgICB3aW5kb3cud2Via2l0UmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8XHJcbiAgICAgICAgd2luZG93Lm1velJlcXVlc3RBbmltYXRpb25GcmFtZSB8fFxyXG4gICAgICAgIHdpbmRvdy5vUmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8XHJcbiAgICAgICAgd2luZG93Lm1zUmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8XHJcbiAgICAgICAgdGltZW91dFNoaW0pO1xyXG5cclxuICAgIC8vIGFwcGx5IHRvIHdpbmRvdywgYXZvaWQgXCJpbGxlZ2FsIGludm9jYXRpb25cIiBlcnJvcnMgaW4gQ2hyb21lXHJcbiAgICBnZXRBbmltYXRpb25GcmFtZSA9IF9hbmltYXRpb25GcmFtZSA/IGZ1bmN0aW9uKCkge1xyXG4gICAgICByZXR1cm4gX2FuaW1hdGlvbkZyYW1lLmFwcGx5KHdpbmRvdywgYXJndW1lbnRzKTtcclxuICAgIH0gOiBudWxsO1xyXG5cclxuICAgIHZhciB0ZXN0RGl2O1xyXG5cclxuICAgIHRlc3REaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuXHJcbiAgICBmdW5jdGlvbiBoYXMocHJvcCkge1xyXG5cclxuICAgICAgLy8gdGVzdCBmb3IgZmVhdHVyZSBzdXBwb3J0XHJcbiAgICAgIHZhciByZXN1bHQgPSB0ZXN0RGl2LnN0eWxlW3Byb3BdO1xyXG4gICAgICByZXR1cm4gKHJlc3VsdCAhPT0gdW5kZWZpbmVkID8gcHJvcCA6IG51bGwpO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICAvLyBub3RlIGxvY2FsIHNjb3BlLlxyXG4gICAgdmFyIGxvY2FsRmVhdHVyZXMgPSB7XHJcblxyXG4gICAgICB0cmFuc2Zvcm06IHtcclxuICAgICAgICBpZTogIGhhcygnLW1zLXRyYW5zZm9ybScpLFxyXG4gICAgICAgIG1vejogaGFzKCdNb3pUcmFuc2Zvcm0nKSxcclxuICAgICAgICBvcGVyYTogaGFzKCdPVHJhbnNmb3JtJyksXHJcbiAgICAgICAgd2Via2l0OiBoYXMoJ3dlYmtpdFRyYW5zZm9ybScpLFxyXG4gICAgICAgIHczOiBoYXMoJ3RyYW5zZm9ybScpLFxyXG4gICAgICAgIHByb3A6IG51bGwgLy8gdGhlIG5vcm1hbGl6ZWQgcHJvcGVydHkgdmFsdWVcclxuICAgICAgfSxcclxuXHJcbiAgICAgIGdldEFuaW1hdGlvbkZyYW1lOiBnZXRBbmltYXRpb25GcmFtZVxyXG5cclxuICAgIH07XHJcblxyXG4gICAgbG9jYWxGZWF0dXJlcy50cmFuc2Zvcm0ucHJvcCA9IChcclxuICAgICAgbG9jYWxGZWF0dXJlcy50cmFuc2Zvcm0udzMgfHwgXHJcbiAgICAgIGxvY2FsRmVhdHVyZXMudHJhbnNmb3JtLm1veiB8fFxyXG4gICAgICBsb2NhbEZlYXR1cmVzLnRyYW5zZm9ybS53ZWJraXQgfHxcclxuICAgICAgbG9jYWxGZWF0dXJlcy50cmFuc2Zvcm0uaWUgfHxcclxuICAgICAgbG9jYWxGZWF0dXJlcy50cmFuc2Zvcm0ub3BlcmFcclxuICAgICk7XHJcblxyXG4gICAgdGVzdERpdiA9IG51bGw7XHJcblxyXG4gICAgcmV0dXJuIGxvY2FsRmVhdHVyZXM7XHJcblxyXG4gIH0oKSk7XHJcblxyXG4gIHRoaXMudGltZXIgPSBudWxsO1xyXG4gIHRoaXMuZmxha2VzID0gW107XHJcbiAgdGhpcy5kaXNhYmxlZCA9IGZhbHNlO1xyXG4gIHRoaXMuYWN0aXZlID0gZmFsc2U7XHJcbiAgdGhpcy5tZWx0RnJhbWVDb3VudCA9IDIwO1xyXG4gIHRoaXMubWVsdEZyYW1lcyA9IFtdO1xyXG5cclxuICB0aGlzLnNldFhZID0gZnVuY3Rpb24obywgeCwgeSkge1xyXG5cclxuICAgIGlmICghbykge1xyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHN0b3JtLnVzZVBpeGVsUG9zaXRpb24gfHwgdGFyZ2V0RWxlbWVudElzUmVsYXRpdmUpIHtcclxuXHJcbiAgICAgIG8uc3R5bGUubGVmdCA9ICh4IC0gc3Rvcm0uZmxha2VXaWR0aCkgKyAncHgnO1xyXG4gICAgICBvLnN0eWxlLnRvcCA9ICh5IC0gc3Rvcm0uZmxha2VIZWlnaHQpICsgJ3B4JztcclxuXHJcbiAgICB9IGVsc2UgaWYgKG5vRml4ZWQpIHtcclxuXHJcbiAgICAgIG8uc3R5bGUucmlnaHQgPSAoMTAwLSh4L3NjcmVlblgqMTAwKSkgKyAnJSc7XHJcbiAgICAgIC8vIGF2b2lkIGNyZWF0aW5nIHZlcnRpY2FsIHNjcm9sbGJhcnNcclxuICAgICAgby5zdHlsZS50b3AgPSAoTWF0aC5taW4oeSwgZG9jSGVpZ2h0LXN0b3JtLmZsYWtlSGVpZ2h0KSkgKyAncHgnO1xyXG5cclxuICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICBpZiAoIXN0b3JtLmZsYWtlQm90dG9tKSB7XHJcblxyXG4gICAgICAgIC8vIGlmIG5vdCB1c2luZyBhIGZpeGVkIGJvdHRvbSBjb29yZGluYXRlLi4uXHJcbiAgICAgICAgby5zdHlsZS5yaWdodCA9ICgxMDAtKHgvc2NyZWVuWCoxMDApKSArICclJztcclxuICAgICAgICBvLnN0eWxlLmJvdHRvbSA9ICgxMDAtKHkvc2NyZWVuWSoxMDApKSArICclJztcclxuXHJcbiAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgIC8vIGFic29sdXRlIHRvcC5cclxuICAgICAgICBvLnN0eWxlLnJpZ2h0ID0gKDEwMC0oeC9zY3JlZW5YKjEwMCkpICsgJyUnO1xyXG4gICAgICAgIG8uc3R5bGUudG9wID0gKE1hdGgubWluKHksIGRvY0hlaWdodC1zdG9ybS5mbGFrZUhlaWdodCkpICsgJ3B4JztcclxuXHJcbiAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG4gIH07XHJcblxyXG4gIHRoaXMuZXZlbnRzID0gKGZ1bmN0aW9uKCkge1xyXG5cclxuICAgIHZhciBvbGQgPSAoIXdpbmRvdy5hZGRFdmVudExpc3RlbmVyICYmIHdpbmRvdy5hdHRhY2hFdmVudCksIHNsaWNlID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLFxyXG4gICAgZXZ0ID0ge1xyXG4gICAgICBhZGQ6IChvbGQ/J2F0dGFjaEV2ZW50JzonYWRkRXZlbnRMaXN0ZW5lcicpLFxyXG4gICAgICByZW1vdmU6IChvbGQ/J2RldGFjaEV2ZW50JzoncmVtb3ZlRXZlbnRMaXN0ZW5lcicpXHJcbiAgICB9O1xyXG5cclxuICAgIGZ1bmN0aW9uIGdldEFyZ3Mob0FyZ3MpIHtcclxuICAgICAgdmFyIGFyZ3MgPSBzbGljZS5jYWxsKG9BcmdzKSwgbGVuID0gYXJncy5sZW5ndGg7XHJcbiAgICAgIGlmIChvbGQpIHtcclxuICAgICAgICBhcmdzWzFdID0gJ29uJyArIGFyZ3NbMV07IC8vIHByZWZpeFxyXG4gICAgICAgIGlmIChsZW4gPiAzKSB7XHJcbiAgICAgICAgICBhcmdzLnBvcCgpOyAvLyBubyBjYXB0dXJlXHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2UgaWYgKGxlbiA9PT0gMykge1xyXG4gICAgICAgIGFyZ3MucHVzaChmYWxzZSk7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIGFyZ3M7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gYXBwbHkoYXJncywgc1R5cGUpIHtcclxuICAgICAgdmFyIGVsZW1lbnQgPSBhcmdzLnNoaWZ0KCksXHJcbiAgICAgICAgICBtZXRob2QgPSBbZXZ0W3NUeXBlXV07XHJcbiAgICAgIGlmIChvbGQpIHtcclxuICAgICAgICBlbGVtZW50W21ldGhvZF0oYXJnc1swXSwgYXJnc1sxXSk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgZWxlbWVudFttZXRob2RdLmFwcGx5KGVsZW1lbnQsIGFyZ3MpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gYWRkRXZlbnQoKSB7XHJcbiAgICAgIGFwcGx5KGdldEFyZ3MoYXJndW1lbnRzKSwgJ2FkZCcpO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHJlbW92ZUV2ZW50KCkge1xyXG4gICAgICBhcHBseShnZXRBcmdzKGFyZ3VtZW50cyksICdyZW1vdmUnKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBhZGQ6IGFkZEV2ZW50LFxyXG4gICAgICByZW1vdmU6IHJlbW92ZUV2ZW50XHJcbiAgICB9O1xyXG5cclxuICB9KCkpO1xyXG5cclxuICBmdW5jdGlvbiBybmQobixtaW4pIHtcclxuICAgIGlmIChpc05hTihtaW4pKSB7XHJcbiAgICAgIG1pbiA9IDA7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gKE1hdGgucmFuZG9tKCkqbikrbWluO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gcGx1c01pbnVzKG4pIHtcclxuICAgIHJldHVybiAocGFyc2VJbnQocm5kKDIpLDEwKT09PTE/biotMTpuKTtcclxuICB9XHJcblxyXG4gIHRoaXMucmFuZG9taXplV2luZCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgdmFyIGk7XHJcbiAgICB2Um5kWCA9IHBsdXNNaW51cyhybmQoc3Rvcm0udk1heFgsMC4yKSk7XHJcbiAgICB2Um5kWSA9IHJuZChzdG9ybS52TWF4WSwwLjIpO1xyXG4gICAgaWYgKHRoaXMuZmxha2VzKSB7XHJcbiAgICAgIGZvciAoaT0wOyBpPHRoaXMuZmxha2VzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuZmxha2VzW2ldLmFjdGl2ZSkge1xyXG4gICAgICAgICAgdGhpcy5mbGFrZXNbaV0uc2V0VmVsb2NpdGllcygpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIHRoaXMuc2Nyb2xsSGFuZGxlciA9IGZ1bmN0aW9uKCkge1xyXG4gICAgdmFyIGk7XHJcbiAgICAvLyBcImF0dGFjaFwiIHNub3dmbGFrZXMgdG8gYm90dG9tIG9mIHdpbmRvdyBpZiBubyBhYnNvbHV0ZSBib3R0b20gdmFsdWUgd2FzIGdpdmVuXHJcbiAgICBzY3JvbGxZID0gKHN0b3JtLmZsYWtlQm90dG9tID8gMCA6IHBhcnNlSW50KHdpbmRvdy5zY3JvbGxZIHx8IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxUb3AgfHwgKG5vRml4ZWQgPyBkb2N1bWVudC5ib2R5LnNjcm9sbFRvcCA6IDApLCAxMCkpO1xyXG4gICAgaWYgKGlzTmFOKHNjcm9sbFkpKSB7XHJcbiAgICAgIHNjcm9sbFkgPSAwOyAvLyBOZXRzY2FwZSA2IHNjcm9sbCBmaXhcclxuICAgIH1cclxuICAgIGlmICghZml4ZWRGb3JFdmVyeXRoaW5nICYmICFzdG9ybS5mbGFrZUJvdHRvbSAmJiBzdG9ybS5mbGFrZXMpIHtcclxuICAgICAgZm9yIChpPTA7IGk8c3Rvcm0uZmxha2VzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgaWYgKHN0b3JtLmZsYWtlc1tpXS5hY3RpdmUgPT09IDApIHtcclxuICAgICAgICAgIHN0b3JtLmZsYWtlc1tpXS5zdGljaygpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIHRoaXMucmVzaXplSGFuZGxlciA9IGZ1bmN0aW9uKCkge1xyXG4gICAgaWYgKHdpbmRvdy5pbm5lcldpZHRoIHx8IHdpbmRvdy5pbm5lckhlaWdodCkge1xyXG4gICAgICBzY3JlZW5YID0gd2luZG93LmlubmVyV2lkdGggLSAxNiAtIHN0b3JtLmZsYWtlUmlnaHRPZmZzZXQ7XHJcbiAgICAgIHNjcmVlblkgPSAoc3Rvcm0uZmxha2VCb3R0b20gfHwgd2luZG93LmlubmVySGVpZ2h0KTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHNjcmVlblggPSAoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudFdpZHRoIHx8IGRvY3VtZW50LmJvZHkuY2xpZW50V2lkdGggfHwgZG9jdW1lbnQuYm9keS5zY3JvbGxXaWR0aCkgLSAoIWlzSUUgPyA4IDogMCkgLSBzdG9ybS5mbGFrZVJpZ2h0T2Zmc2V0O1xyXG4gICAgICBzY3JlZW5ZID0gc3Rvcm0uZmxha2VCb3R0b20gfHwgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudEhlaWdodCB8fCBkb2N1bWVudC5ib2R5LmNsaWVudEhlaWdodCB8fCBkb2N1bWVudC5ib2R5LnNjcm9sbEhlaWdodDtcclxuICAgIH1cclxuICAgIGRvY0hlaWdodCA9IGRvY3VtZW50LmJvZHkub2Zmc2V0SGVpZ2h0O1xyXG4gICAgc2NyZWVuWDIgPSBwYXJzZUludChzY3JlZW5YLzIsMTApO1xyXG4gIH07XHJcblxyXG4gIHRoaXMucmVzaXplSGFuZGxlckFsdCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgc2NyZWVuWCA9IHN0b3JtLnRhcmdldEVsZW1lbnQub2Zmc2V0V2lkdGggLSBzdG9ybS5mbGFrZVJpZ2h0T2Zmc2V0O1xyXG4gICAgc2NyZWVuWSA9IHN0b3JtLmZsYWtlQm90dG9tIHx8IHN0b3JtLnRhcmdldEVsZW1lbnQub2Zmc2V0SGVpZ2h0O1xyXG4gICAgc2NyZWVuWDIgPSBwYXJzZUludChzY3JlZW5YLzIsMTApO1xyXG4gICAgZG9jSGVpZ2h0ID0gZG9jdW1lbnQuYm9keS5vZmZzZXRIZWlnaHQ7XHJcbiAgfTtcclxuXHJcbiAgdGhpcy5mcmVlemUgPSBmdW5jdGlvbigpIHtcclxuICAgIC8vIHBhdXNlIGFuaW1hdGlvblxyXG4gICAgaWYgKCFzdG9ybS5kaXNhYmxlZCkge1xyXG4gICAgICBzdG9ybS5kaXNhYmxlZCA9IDE7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbiAgICBzdG9ybS50aW1lciA9IG51bGw7XHJcbiAgfTtcclxuXHJcbiAgdGhpcy5yZXN1bWUgPSBmdW5jdGlvbigpIHtcclxuICAgIGlmIChzdG9ybS5kaXNhYmxlZCkge1xyXG4gICAgICAgc3Rvcm0uZGlzYWJsZWQgPSAwO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG4gICAgc3Rvcm0udGltZXJJbml0KCk7XHJcbiAgfTtcclxuXHJcbiAgdGhpcy50b2dnbGVTbm93ID0gZnVuY3Rpb24oKSB7XHJcbiAgICBpZiAoIXN0b3JtLmZsYWtlcy5sZW5ndGgpIHtcclxuICAgICAgLy8gZmlyc3QgcnVuXHJcbiAgICAgIHN0b3JtLnN0YXJ0KCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBzdG9ybS5hY3RpdmUgPSAhc3Rvcm0uYWN0aXZlO1xyXG4gICAgICBpZiAoc3Rvcm0uYWN0aXZlKSB7XHJcbiAgICAgICAgc3Rvcm0uc2hvdygpO1xyXG4gICAgICAgIHN0b3JtLnJlc3VtZSgpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHN0b3JtLnN0b3AoKTtcclxuICAgICAgICBzdG9ybS5mcmVlemUoKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIHRoaXMuc3RvcCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgdmFyIGk7XHJcbiAgICB0aGlzLmZyZWV6ZSgpO1xyXG4gICAgZm9yIChpPTA7IGk8dGhpcy5mbGFrZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgdGhpcy5mbGFrZXNbaV0uby5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xyXG4gICAgfVxyXG4gICAgc3Rvcm0uZXZlbnRzLnJlbW92ZSh3aW5kb3csJ3Njcm9sbCcsc3Rvcm0uc2Nyb2xsSGFuZGxlcik7XHJcbiAgICBzdG9ybS5ldmVudHMucmVtb3ZlKHdpbmRvdywncmVzaXplJyxzdG9ybS5yZXNpemVIYW5kbGVyKTtcclxuICAgIGlmIChzdG9ybS5mcmVlemVPbkJsdXIpIHtcclxuICAgICAgaWYgKGlzSUUpIHtcclxuICAgICAgICBzdG9ybS5ldmVudHMucmVtb3ZlKGRvY3VtZW50LCdmb2N1c291dCcsc3Rvcm0uZnJlZXplKTtcclxuICAgICAgICBzdG9ybS5ldmVudHMucmVtb3ZlKGRvY3VtZW50LCdmb2N1c2luJyxzdG9ybS5yZXN1bWUpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHN0b3JtLmV2ZW50cy5yZW1vdmUod2luZG93LCdibHVyJyxzdG9ybS5mcmVlemUpO1xyXG4gICAgICAgIHN0b3JtLmV2ZW50cy5yZW1vdmUod2luZG93LCdmb2N1cycsc3Rvcm0ucmVzdW1lKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIHRoaXMuc2hvdyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgdmFyIGk7XHJcbiAgICBmb3IgKGk9MDsgaTx0aGlzLmZsYWtlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICB0aGlzLmZsYWtlc1tpXS5vLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIHRoaXMuU25vd0ZsYWtlID0gZnVuY3Rpb24odHlwZSx4LHkpIHtcclxuICAgIHZhciBzID0gdGhpcztcclxuICAgIHRoaXMudHlwZSA9IHR5cGU7XHJcbiAgICB0aGlzLnggPSB4fHxwYXJzZUludChybmQoc2NyZWVuWC0yMCksMTApO1xyXG4gICAgdGhpcy55ID0gKCFpc05hTih5KT95Oi1ybmQoc2NyZWVuWSktMTIpO1xyXG4gICAgdGhpcy52WCA9IG51bGw7XHJcbiAgICB0aGlzLnZZID0gbnVsbDtcclxuICAgIHRoaXMudkFtcFR5cGVzID0gWzEsMS4yLDEuNCwxLjYsMS44XTsgLy8gXCJhbXBsaWZpY2F0aW9uXCIgZm9yIHZYL3ZZIChiYXNlZCBvbiBmbGFrZSBzaXplL3R5cGUpXHJcbiAgICB0aGlzLnZBbXAgPSB0aGlzLnZBbXBUeXBlc1t0aGlzLnR5cGVdIHx8IDE7XHJcbiAgICB0aGlzLm1lbHRpbmcgPSBmYWxzZTtcclxuICAgIHRoaXMubWVsdEZyYW1lQ291bnQgPSBzdG9ybS5tZWx0RnJhbWVDb3VudDtcclxuICAgIHRoaXMubWVsdEZyYW1lcyA9IHN0b3JtLm1lbHRGcmFtZXM7XHJcbiAgICB0aGlzLm1lbHRGcmFtZSA9IDA7XHJcbiAgICB0aGlzLnR3aW5rbGVGcmFtZSA9IDA7XHJcbiAgICB0aGlzLmFjdGl2ZSA9IDE7XHJcbiAgICB0aGlzLmZvbnRTaXplID0gKDEwKyh0aGlzLnR5cGUvNSkqMTApO1xyXG4gICAgdGhpcy5vID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICB0aGlzLm8uaW5uZXJIVE1MID0gc3Rvcm0uc25vd0NoYXJhY3RlcjtcclxuICAgIGlmIChzdG9ybS5jbGFzc05hbWUpIHtcclxuICAgICAgdGhpcy5vLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCBzdG9ybS5jbGFzc05hbWUpO1xyXG4gICAgfVxyXG4gICAgdGhpcy5vLnN0eWxlLmNvbG9yID0gc3Rvcm0uc25vd0NvbG9yO1xyXG4gICAgdGhpcy5vLnN0eWxlLnBvc2l0aW9uID0gKGZpeGVkRm9yRXZlcnl0aGluZz8nZml4ZWQnOidhYnNvbHV0ZScpO1xyXG4gICAgaWYgKHN0b3JtLnVzZUdQVSAmJiBmZWF0dXJlcy50cmFuc2Zvcm0ucHJvcCkge1xyXG4gICAgICAvLyBHUFUtYWNjZWxlcmF0ZWQgc25vdy5cclxuICAgICAgdGhpcy5vLnN0eWxlW2ZlYXR1cmVzLnRyYW5zZm9ybS5wcm9wXSA9ICd0cmFuc2xhdGUzZCgwcHgsIDBweCwgMHB4KSc7XHJcbiAgICB9XHJcbiAgICB0aGlzLm8uc3R5bGUud2lkdGggPSBzdG9ybS5mbGFrZVdpZHRoKydweCc7XHJcbiAgICB0aGlzLm8uc3R5bGUuaGVpZ2h0ID0gc3Rvcm0uZmxha2VIZWlnaHQrJ3B4JztcclxuICAgIHRoaXMuby5zdHlsZS5mb250RmFtaWx5ID0gJ2FyaWFsLHZlcmRhbmEnO1xyXG4gICAgdGhpcy5vLnN0eWxlLmN1cnNvciA9ICdkZWZhdWx0JztcclxuICAgIHRoaXMuby5zdHlsZS5vdmVyZmxvdyA9ICdoaWRkZW4nO1xyXG4gICAgdGhpcy5vLnN0eWxlLmZvbnRXZWlnaHQgPSAnbm9ybWFsJztcclxuICAgIHRoaXMuby5zdHlsZS56SW5kZXggPSBzdG9ybS56SW5kZXg7XHJcbiAgICBkb2NGcmFnLmFwcGVuZENoaWxkKHRoaXMubyk7XHJcblxyXG4gICAgdGhpcy5yZWZyZXNoID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgIGlmIChpc05hTihzLngpIHx8IGlzTmFOKHMueSkpIHtcclxuICAgICAgICAvLyBzYWZldHkgY2hlY2tcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgIH1cclxuICAgICAgc3Rvcm0uc2V0WFkocy5vLCBzLngsIHMueSk7XHJcbiAgICB9O1xyXG5cclxuICAgIHRoaXMuc3RpY2sgPSBmdW5jdGlvbigpIHtcclxuICAgICAgaWYgKG5vRml4ZWQgfHwgKHN0b3JtLnRhcmdldEVsZW1lbnQgIT09IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCAmJiBzdG9ybS50YXJnZXRFbGVtZW50ICE9PSBkb2N1bWVudC5ib2R5KSkge1xyXG4gICAgICAgIHMuby5zdHlsZS50b3AgPSAoc2NyZWVuWStzY3JvbGxZLXN0b3JtLmZsYWtlSGVpZ2h0KSsncHgnO1xyXG4gICAgICB9IGVsc2UgaWYgKHN0b3JtLmZsYWtlQm90dG9tKSB7XHJcbiAgICAgICAgcy5vLnN0eWxlLnRvcCA9IHN0b3JtLmZsYWtlQm90dG9tKydweCc7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcy5vLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XHJcbiAgICAgICAgcy5vLnN0eWxlLmJvdHRvbSA9ICcwJSc7XHJcbiAgICAgICAgcy5vLnN0eWxlLnBvc2l0aW9uID0gJ2ZpeGVkJztcclxuICAgICAgICBzLm8uc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgdGhpcy52Q2hlY2sgPSBmdW5jdGlvbigpIHtcclxuICAgICAgaWYgKHMudlg+PTAgJiYgcy52WDwwLjIpIHtcclxuICAgICAgICBzLnZYID0gMC4yO1xyXG4gICAgICB9IGVsc2UgaWYgKHMudlg8MCAmJiBzLnZYPi0wLjIpIHtcclxuICAgICAgICBzLnZYID0gLTAuMjtcclxuICAgICAgfVxyXG4gICAgICBpZiAocy52WT49MCAmJiBzLnZZPDAuMikge1xyXG4gICAgICAgIHMudlkgPSAwLjI7XHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgdGhpcy5tb3ZlID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgIHZhciB2WCA9IHMudlgqd2luZE9mZnNldCwgeURpZmY7XHJcbiAgICAgIHMueCArPSB2WDtcclxuICAgICAgcy55ICs9IChzLnZZKnMudkFtcCk7XHJcbiAgICAgIGlmIChzLnggPj0gc2NyZWVuWCB8fCBzY3JlZW5YLXMueCA8IHN0b3JtLmZsYWtlV2lkdGgpIHsgLy8gWC1heGlzIHNjcm9sbCBjaGVja1xyXG4gICAgICAgIHMueCA9IDA7XHJcbiAgICAgIH0gZWxzZSBpZiAodlggPCAwICYmIHMueC1zdG9ybS5mbGFrZUxlZnRPZmZzZXQgPCAtc3Rvcm0uZmxha2VXaWR0aCkge1xyXG4gICAgICAgIHMueCA9IHNjcmVlblgtc3Rvcm0uZmxha2VXaWR0aC0xOyAvLyBmbGFrZVdpZHRoO1xyXG4gICAgICB9XHJcbiAgICAgIHMucmVmcmVzaCgpO1xyXG4gICAgICB5RGlmZiA9IHNjcmVlblkrc2Nyb2xsWS1zLnkrc3Rvcm0uZmxha2VIZWlnaHQ7XHJcbiAgICAgIGlmICh5RGlmZjxzdG9ybS5mbGFrZUhlaWdodCkge1xyXG4gICAgICAgIHMuYWN0aXZlID0gMDtcclxuICAgICAgICBpZiAoc3Rvcm0uc25vd1N0aWNrKSB7XHJcbiAgICAgICAgICBzLnN0aWNrKCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHMucmVjeWNsZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBpZiAoc3Rvcm0udXNlTWVsdEVmZmVjdCAmJiBzLmFjdGl2ZSAmJiBzLnR5cGUgPCAzICYmICFzLm1lbHRpbmcgJiYgTWF0aC5yYW5kb20oKT4wLjk5OCkge1xyXG4gICAgICAgICAgLy8gfjEvMTAwMCBjaGFuY2Ugb2YgbWVsdGluZyBtaWQtYWlyLCB3aXRoIGVhY2ggZnJhbWVcclxuICAgICAgICAgIHMubWVsdGluZyA9IHRydWU7XHJcbiAgICAgICAgICBzLm1lbHQoKTtcclxuICAgICAgICAgIC8vIG9ubHkgaW5jcmVtZW50YWxseSBtZWx0IG9uZSBmcmFtZVxyXG4gICAgICAgICAgLy8gcy5tZWx0aW5nID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChzdG9ybS51c2VUd2lua2xlRWZmZWN0KSB7XHJcbiAgICAgICAgICBpZiAocy50d2lua2xlRnJhbWUgPCAwKSB7XHJcbiAgICAgICAgICAgIGlmIChNYXRoLnJhbmRvbSgpID4gMC45Nykge1xyXG4gICAgICAgICAgICAgIHMudHdpbmtsZUZyYW1lID0gcGFyc2VJbnQoTWF0aC5yYW5kb20oKSAqIDgsIDEwKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcy50d2lua2xlRnJhbWUtLTtcclxuICAgICAgICAgICAgaWYgKCFvcGFjaXR5U3VwcG9ydGVkKSB7XHJcbiAgICAgICAgICAgICAgcy5vLnN0eWxlLnZpc2liaWxpdHkgPSAocy50d2lua2xlRnJhbWUgJiYgcy50d2lua2xlRnJhbWUgJSAyID09PSAwID8gJ2hpZGRlbicgOiAndmlzaWJsZScpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIHMuby5zdHlsZS5vcGFjaXR5ID0gKHMudHdpbmtsZUZyYW1lICYmIHMudHdpbmtsZUZyYW1lICUgMiA9PT0gMCA/IDAgOiAxKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICB0aGlzLmFuaW1hdGUgPSBmdW5jdGlvbigpIHtcclxuICAgICAgLy8gbWFpbiBhbmltYXRpb24gbG9vcFxyXG4gICAgICAvLyBtb3ZlLCBjaGVjayBzdGF0dXMsIGRpZSBldGMuXHJcbiAgICAgIHMubW92ZSgpO1xyXG4gICAgfTtcclxuXHJcbiAgICB0aGlzLnNldFZlbG9jaXRpZXMgPSBmdW5jdGlvbigpIHtcclxuICAgICAgcy52WCA9IHZSbmRYK3JuZChzdG9ybS52TWF4WCowLjEyLDAuMSk7XHJcbiAgICAgIHMudlkgPSB2Um5kWStybmQoc3Rvcm0udk1heFkqMC4xMiwwLjEpO1xyXG4gICAgfTtcclxuXHJcbiAgICB0aGlzLnNldE9wYWNpdHkgPSBmdW5jdGlvbihvLG9wYWNpdHkpIHtcclxuICAgICAgaWYgKCFvcGFjaXR5U3VwcG9ydGVkKSB7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICB9XHJcbiAgICAgIG8uc3R5bGUub3BhY2l0eSA9IG9wYWNpdHk7XHJcbiAgICB9O1xyXG5cclxuICAgIHRoaXMubWVsdCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICBpZiAoIXN0b3JtLnVzZU1lbHRFZmZlY3QgfHwgIXMubWVsdGluZykge1xyXG4gICAgICAgIHMucmVjeWNsZSgpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGlmIChzLm1lbHRGcmFtZSA8IHMubWVsdEZyYW1lQ291bnQpIHtcclxuICAgICAgICAgIHMuc2V0T3BhY2l0eShzLm8scy5tZWx0RnJhbWVzW3MubWVsdEZyYW1lXSk7XHJcbiAgICAgICAgICBzLm8uc3R5bGUuZm9udFNpemUgPSBzLmZvbnRTaXplLShzLmZvbnRTaXplKihzLm1lbHRGcmFtZS9zLm1lbHRGcmFtZUNvdW50KSkrJ3B4JztcclxuICAgICAgICAgIHMuby5zdHlsZS5saW5lSGVpZ2h0ID0gc3Rvcm0uZmxha2VIZWlnaHQrMisoc3Rvcm0uZmxha2VIZWlnaHQqMC43NSoocy5tZWx0RnJhbWUvcy5tZWx0RnJhbWVDb3VudCkpKydweCc7XHJcbiAgICAgICAgICBzLm1lbHRGcmFtZSsrO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBzLnJlY3ljbGUoKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgdGhpcy5yZWN5Y2xlID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgIHMuby5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xyXG4gICAgICBzLm8uc3R5bGUucG9zaXRpb24gPSAoZml4ZWRGb3JFdmVyeXRoaW5nPydmaXhlZCc6J2Fic29sdXRlJyk7XHJcbiAgICAgIHMuby5zdHlsZS5ib3R0b20gPSAnYXV0byc7XHJcbiAgICAgIHMuc2V0VmVsb2NpdGllcygpO1xyXG4gICAgICBzLnZDaGVjaygpO1xyXG4gICAgICBzLm1lbHRGcmFtZSA9IDA7XHJcbiAgICAgIHMubWVsdGluZyA9IGZhbHNlO1xyXG4gICAgICBzLnNldE9wYWNpdHkocy5vLDEpO1xyXG4gICAgICBzLm8uc3R5bGUucGFkZGluZyA9ICcwcHgnO1xyXG4gICAgICBzLm8uc3R5bGUubWFyZ2luID0gJzBweCc7XHJcbiAgICAgIHMuby5zdHlsZS5mb250U2l6ZSA9IHMuZm9udFNpemUrJ3B4JztcclxuICAgICAgcy5vLnN0eWxlLmxpbmVIZWlnaHQgPSAoc3Rvcm0uZmxha2VIZWlnaHQrMikrJ3B4JztcclxuICAgICAgcy5vLnN0eWxlLnRleHRBbGlnbiA9ICdjZW50ZXInO1xyXG4gICAgICBzLm8uc3R5bGUudmVydGljYWxBbGlnbiA9ICdiYXNlbGluZSc7XHJcbiAgICAgIHMueCA9IHBhcnNlSW50KHJuZChzY3JlZW5YLXN0b3JtLmZsYWtlV2lkdGgtMjApLDEwKTtcclxuICAgICAgcy55ID0gcGFyc2VJbnQocm5kKHNjcmVlblkpKi0xLDEwKS1zdG9ybS5mbGFrZUhlaWdodDtcclxuICAgICAgcy5yZWZyZXNoKCk7XHJcbiAgICAgIHMuby5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcclxuICAgICAgcy5hY3RpdmUgPSAxO1xyXG4gICAgfTtcclxuXHJcbiAgICB0aGlzLnJlY3ljbGUoKTsgLy8gc2V0IHVwIHgveSBjb29yZHMgZXRjLlxyXG4gICAgdGhpcy5yZWZyZXNoKCk7XHJcblxyXG4gIH07XHJcblxyXG4gIHRoaXMuc25vdyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgdmFyIGFjdGl2ZSA9IDAsIGZsYWtlID0gbnVsbCwgaSwgajtcclxuICAgIGZvciAoaT0wLCBqPXN0b3JtLmZsYWtlcy5sZW5ndGg7IGk8ajsgaSsrKSB7XHJcbiAgICAgIGlmIChzdG9ybS5mbGFrZXNbaV0uYWN0aXZlID09PSAxKSB7XHJcbiAgICAgICAgc3Rvcm0uZmxha2VzW2ldLm1vdmUoKTtcclxuICAgICAgICBhY3RpdmUrKztcclxuICAgICAgfVxyXG4gICAgICBpZiAoc3Rvcm0uZmxha2VzW2ldLm1lbHRpbmcpIHtcclxuICAgICAgICBzdG9ybS5mbGFrZXNbaV0ubWVsdCgpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBpZiAoYWN0aXZlPHN0b3JtLmZsYWtlc01heEFjdGl2ZSkge1xyXG4gICAgICBmbGFrZSA9IHN0b3JtLmZsYWtlc1twYXJzZUludChybmQoc3Rvcm0uZmxha2VzLmxlbmd0aCksMTApXTtcclxuICAgICAgaWYgKGZsYWtlLmFjdGl2ZSA9PT0gMCkge1xyXG4gICAgICAgIGZsYWtlLm1lbHRpbmcgPSB0cnVlO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBpZiAoc3Rvcm0udGltZXIpIHtcclxuICAgICAgZmVhdHVyZXMuZ2V0QW5pbWF0aW9uRnJhbWUoc3Rvcm0uc25vdyk7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgdGhpcy5tb3VzZU1vdmUgPSBmdW5jdGlvbihlKSB7XHJcbiAgICBpZiAoIXN0b3JtLmZvbGxvd01vdXNlKSB7XHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG4gICAgdmFyIHggPSBwYXJzZUludChlLmNsaWVudFgsMTApO1xyXG4gICAgaWYgKHg8c2NyZWVuWDIpIHtcclxuICAgICAgd2luZE9mZnNldCA9IC13aW5kTXVsdGlwbGllcisoeC9zY3JlZW5YMip3aW5kTXVsdGlwbGllcik7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB4IC09IHNjcmVlblgyO1xyXG4gICAgICB3aW5kT2Zmc2V0ID0gKHgvc2NyZWVuWDIpKndpbmRNdWx0aXBsaWVyO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIHRoaXMuY3JlYXRlU25vdyA9IGZ1bmN0aW9uKGxpbWl0LGFsbG93SW5hY3RpdmUpIHtcclxuICAgIHZhciBpO1xyXG4gICAgZm9yIChpPTA7IGk8bGltaXQ7IGkrKykge1xyXG4gICAgICBzdG9ybS5mbGFrZXNbc3Rvcm0uZmxha2VzLmxlbmd0aF0gPSBuZXcgc3Rvcm0uU25vd0ZsYWtlKHBhcnNlSW50KHJuZChmbGFrZVR5cGVzKSwxMCkpO1xyXG4gICAgICBpZiAoYWxsb3dJbmFjdGl2ZSB8fCBpPnN0b3JtLmZsYWtlc01heEFjdGl2ZSkge1xyXG4gICAgICAgIHN0b3JtLmZsYWtlc1tzdG9ybS5mbGFrZXMubGVuZ3RoLTFdLmFjdGl2ZSA9IC0xO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBzdG9ybS50YXJnZXRFbGVtZW50LmFwcGVuZENoaWxkKGRvY0ZyYWcpO1xyXG4gIH07XHJcblxyXG4gIHRoaXMudGltZXJJbml0ID0gZnVuY3Rpb24oKSB7XHJcbiAgICBzdG9ybS50aW1lciA9IHRydWU7XHJcbiAgICBzdG9ybS5zbm93KCk7XHJcbiAgfTtcclxuXHJcbiAgdGhpcy5pbml0ID0gZnVuY3Rpb24oKSB7XHJcbiAgICB2YXIgaTtcclxuICAgIGZvciAoaT0wOyBpPHN0b3JtLm1lbHRGcmFtZUNvdW50OyBpKyspIHtcclxuICAgICAgc3Rvcm0ubWVsdEZyYW1lcy5wdXNoKDEtKGkvc3Rvcm0ubWVsdEZyYW1lQ291bnQpKTtcclxuICAgIH1cclxuICAgIHN0b3JtLnJhbmRvbWl6ZVdpbmQoKTtcclxuICAgIHN0b3JtLmNyZWF0ZVNub3coc3Rvcm0uZmxha2VzTWF4KTsgLy8gY3JlYXRlIGluaXRpYWwgYmF0Y2hcclxuICAgIHN0b3JtLmV2ZW50cy5hZGQod2luZG93LCdyZXNpemUnLHN0b3JtLnJlc2l6ZUhhbmRsZXIpO1xyXG4gICAgc3Rvcm0uZXZlbnRzLmFkZCh3aW5kb3csJ3Njcm9sbCcsc3Rvcm0uc2Nyb2xsSGFuZGxlcik7XHJcbiAgICBpZiAoc3Rvcm0uZnJlZXplT25CbHVyKSB7XHJcbiAgICAgIGlmIChpc0lFKSB7XHJcbiAgICAgICAgc3Rvcm0uZXZlbnRzLmFkZChkb2N1bWVudCwnZm9jdXNvdXQnLHN0b3JtLmZyZWV6ZSk7XHJcbiAgICAgICAgc3Rvcm0uZXZlbnRzLmFkZChkb2N1bWVudCwnZm9jdXNpbicsc3Rvcm0ucmVzdW1lKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBzdG9ybS5ldmVudHMuYWRkKHdpbmRvdywnYmx1cicsc3Rvcm0uZnJlZXplKTtcclxuICAgICAgICBzdG9ybS5ldmVudHMuYWRkKHdpbmRvdywnZm9jdXMnLHN0b3JtLnJlc3VtZSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHN0b3JtLnJlc2l6ZUhhbmRsZXIoKTtcclxuICAgIHN0b3JtLnNjcm9sbEhhbmRsZXIoKTtcclxuICAgIGlmIChzdG9ybS5mb2xsb3dNb3VzZSkge1xyXG4gICAgICBzdG9ybS5ldmVudHMuYWRkKGlzSUU/ZG9jdW1lbnQ6d2luZG93LCdtb3VzZW1vdmUnLHN0b3JtLm1vdXNlTW92ZSk7XHJcbiAgICB9XHJcbiAgICBzdG9ybS5hbmltYXRpb25JbnRlcnZhbCA9IE1hdGgubWF4KDIwLHN0b3JtLmFuaW1hdGlvbkludGVydmFsKTtcclxuICAgIHN0b3JtLnRpbWVySW5pdCgpO1xyXG4gIH07XHJcblxyXG4gIHRoaXMuc3RhcnQgPSBmdW5jdGlvbihiRnJvbU9uTG9hZCkge1xyXG4gICAgaWYgKCFkaWRJbml0KSB7XHJcbiAgICAgIGRpZEluaXQgPSB0cnVlO1xyXG4gICAgfSBlbHNlIGlmIChiRnJvbU9uTG9hZCkge1xyXG4gICAgICAvLyBhbHJlYWR5IGxvYWRlZCBhbmQgcnVubmluZ1xyXG4gICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuICAgIGlmICh0eXBlb2Ygc3Rvcm0udGFyZ2V0RWxlbWVudCA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgdmFyIHRhcmdldElEID0gc3Rvcm0udGFyZ2V0RWxlbWVudDtcclxuICAgICAgc3Rvcm0udGFyZ2V0RWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRhcmdldElEKTtcclxuICAgICAgaWYgKCFzdG9ybS50YXJnZXRFbGVtZW50KSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdTbm93c3Rvcm06IFVuYWJsZSB0byBnZXQgdGFyZ2V0RWxlbWVudCBcIicrdGFyZ2V0SUQrJ1wiJyk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGlmICghc3Rvcm0udGFyZ2V0RWxlbWVudCkge1xyXG4gICAgICBzdG9ybS50YXJnZXRFbGVtZW50ID0gKGRvY3VtZW50LmJvZHkgfHwgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50KTtcclxuICAgIH1cclxuICAgIGlmIChzdG9ybS50YXJnZXRFbGVtZW50ICE9PSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQgJiYgc3Rvcm0udGFyZ2V0RWxlbWVudCAhPT0gZG9jdW1lbnQuYm9keSkge1xyXG4gICAgICAvLyByZS1tYXAgaGFuZGxlciB0byBnZXQgZWxlbWVudCBpbnN0ZWFkIG9mIHNjcmVlbiBkaW1lbnNpb25zXHJcbiAgICAgIHN0b3JtLnJlc2l6ZUhhbmRsZXIgPSBzdG9ybS5yZXNpemVIYW5kbGVyQWx0O1xyXG4gICAgICAvL2FuZCBmb3JjZS1lbmFibGUgcGl4ZWwgcG9zaXRpb25pbmdcclxuICAgICAgc3Rvcm0udXNlUGl4ZWxQb3NpdGlvbiA9IHRydWU7XHJcbiAgICB9XHJcbiAgICBzdG9ybS5yZXNpemVIYW5kbGVyKCk7IC8vIGdldCBib3VuZGluZyBib3ggZWxlbWVudHNcclxuICAgIHN0b3JtLnVzZVBvc2l0aW9uRml4ZWQgPSAoc3Rvcm0udXNlUG9zaXRpb25GaXhlZCAmJiAhbm9GaXhlZCAmJiAhc3Rvcm0uZmxha2VCb3R0b20pOyAvLyB3aGV0aGVyIG9yIG5vdCBwb3NpdGlvbjpmaXhlZCBpcyB0byBiZSB1c2VkXHJcbiAgICBpZiAod2luZG93LmdldENvbXB1dGVkU3R5bGUpIHtcclxuICAgICAgLy8gYXR0ZW1wdCB0byBkZXRlcm1pbmUgaWYgYm9keSBvciB1c2VyLXNwZWNpZmllZCBzbm93IHBhcmVudCBlbGVtZW50IGlzIHJlbGF0bGl2ZWx5LXBvc2l0aW9uZWQuXHJcbiAgICAgIHRyeSB7XHJcbiAgICAgICAgdGFyZ2V0RWxlbWVudElzUmVsYXRpdmUgPSAod2luZG93LmdldENvbXB1dGVkU3R5bGUoc3Rvcm0udGFyZ2V0RWxlbWVudCwgbnVsbCkuZ2V0UHJvcGVydHlWYWx1ZSgncG9zaXRpb24nKSA9PT0gJ3JlbGF0aXZlJyk7XHJcbiAgICAgIH0gY2F0Y2goZSkge1xyXG4gICAgICAgIC8vIG9oIHdlbGxcclxuICAgICAgICB0YXJnZXRFbGVtZW50SXNSZWxhdGl2ZSA9IGZhbHNlO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBmaXhlZEZvckV2ZXJ5dGhpbmcgPSBzdG9ybS51c2VQb3NpdGlvbkZpeGVkO1xyXG4gICAgaWYgKHNjcmVlblggJiYgc2NyZWVuWSAmJiAhc3Rvcm0uZGlzYWJsZWQpIHtcclxuICAgICAgc3Rvcm0uaW5pdCgpO1xyXG4gICAgICBzdG9ybS5hY3RpdmUgPSB0cnVlO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIGZ1bmN0aW9uIGRvRGVsYXllZFN0YXJ0KCkge1xyXG4gICAgd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcbiAgICAgIHN0b3JtLnN0YXJ0KHRydWUpO1xyXG4gICAgfSwgMjApO1xyXG4gICAgLy8gZXZlbnQgY2xlYW51cFxyXG4gICAgc3Rvcm0uZXZlbnRzLnJlbW92ZShpc0lFP2RvY3VtZW50OndpbmRvdywnbW91c2Vtb3ZlJyxkb0RlbGF5ZWRTdGFydCk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBkb1N0YXJ0KCkge1xyXG4gICAgaWYgKCFzdG9ybS5leGNsdWRlTW9iaWxlIHx8ICFpc01vYmlsZSkge1xyXG4gICAgICBkb0RlbGF5ZWRTdGFydCgpO1xyXG4gICAgfVxyXG4gICAgLy8gZXZlbnQgY2xlYW51cFxyXG4gICAgc3Rvcm0uZXZlbnRzLnJlbW92ZSh3aW5kb3csICdsb2FkJywgZG9TdGFydCk7XHJcbiAgfVxyXG5cclxuICAvLyBob29rcyBmb3Igc3RhcnRpbmcgdGhlIHNub3dcclxuICBpZiAoc3Rvcm0uYXV0b1N0YXJ0KSB7XHJcbiAgICBzdG9ybS5ldmVudHMuYWRkKHdpbmRvdywgJ2xvYWQnLCBkb1N0YXJ0LCBmYWxzZSk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gdGhpcztcclxuXHJcbn0od2luZG93LCBkb2N1bWVudCkpO1xyXG4iXX0=

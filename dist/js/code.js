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
                levelLoad.split("\n");
                var isLive = levelLoad[j][i];
                if (isLive == 1) {
                    var cell = document.getElementById(i + "_" + j);
                    cell.setAttribute("class", "live");
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvZGUuanMiLCJrYXJfMy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiY29kZS5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciByb3dzID0gMTA7XHJcbnZhciBjb2xzID0gNjAwO1xyXG5cclxuXHJcbnZhciBwbGF5aW5nID0gZmFsc2U7XHJcblxyXG52YXIgZ3JpZCA9IG5ldyBBcnJheShyb3dzKTtcclxudmFyIG5leHRHcmlkID0gbmV3IEFycmF5KHJvd3MpO1xyXG5cclxudmFyIHRpbWVyO1xyXG52YXIgcmVwcm9kdWN0aW9uVGltZSA9IDEwMDtcclxuXHJcbmZ1bmN0aW9uIGluaXRpYWxpemVHcmlkcygpIHtcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcm93czsgaSsrKSB7XHJcbiAgICAgICAgZ3JpZFtpXSA9IG5ldyBBcnJheShjb2xzKTtcclxuICAgICAgICBuZXh0R3JpZFtpXSA9IG5ldyBBcnJheShjb2xzKTtcclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gcmVzZXRHcmlkcygpIHtcclxuXHJcblxyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCByb3dzOyBpKyspIHtcclxuICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IGNvbHM7IGorKykge1xyXG4gICAgICAgICAgICBncmlkW2ldW2pdID0gMDtcclxuICAgICAgICAgICAgbmV4dEdyaWRbaV1bal0gPSAwO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gY29weUFuZFJlc2V0R3JpZCgpIHtcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcm93czsgaSsrKSB7XHJcbiAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBjb2xzOyBqKyspIHtcclxuICAgICAgICAgICAgZ3JpZFtpXVtqXSA9IG5leHRHcmlkW2ldW2pdO1xyXG4gICAgICAgICAgICBuZXh0R3JpZFtpXVtqXSA9IDA7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG4vLyBJbml0aWFsaXplXHJcbmZ1bmN0aW9uIGluaXRpYWxpemUoKSB7XHJcbiAgICBjcmVhdGVUYWJsZSgpO1xyXG4gICAgaW5pdGlhbGl6ZUdyaWRzKCk7XHJcbiAgICByZXNldEdyaWRzKCk7XHJcbiAgICBzZXR1cENvbnRyb2xCdXR0b25zKCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHNldFNpemUoKSB7XHJcblxyXG4gICAgbl9yb3dzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJoZWlnaHRJblwiKS52YWx1ZTtcclxuICAgIG5fY29scyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwid2lkdGhJblwiKS52YWx1ZTtcclxuICAgIHJvd3MgPSBuX3Jvd3M7XHJcbiAgICBjb2xzID0gbl9jb2xzO1xyXG5cclxuICAgIHZhciBlbXB0eVRhYmxlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJncmlkQ29udGFpbmVyXCIpLmlubmVySFRNTCA9IFwiXCI7XHJcbiAgICB2YXIgZ3JpZENvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdncmlkQ29udGFpbmVyJyk7XHJcblxyXG4gICAgaWYgKCFncmlkQ29udGFpbmVyKSB7XHJcbiAgICAgICAgLy8gVGhyb3cgZXJyb3JcclxuICAgICAgICBjb25zb2xlLmVycm9yKFwiUHJvYmxlbTogTm8gZGl2IGZvciB0aGUgZHJpZCB0YWJsZSFcIik7XHJcbiAgICB9IGVsc2Uge1xyXG5cclxuXHJcbiAgICAgICAgdmFyIHRhYmxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInRhYmxlXCIpO1xyXG5cclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHJvd3M7IGkrKykge1xyXG4gICAgICAgICAgICB2YXIgdHIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwidHJcIik7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgY29sczsgaisrKSB7Ly9cclxuICAgICAgICAgICAgICAgIHZhciBjZWxsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInRkXCIpO1xyXG4gICAgICAgICAgICAgICAgY2VsbC5zZXRBdHRyaWJ1dGUoXCJpZFwiLCBpICsgXCJfXCIgKyBqKTtcclxuICAgICAgICAgICAgICAgIGNlbGwuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJkZWFkXCIpO1xyXG4gICAgICAgICAgICAgICAgY2VsbC5vbmNsaWNrID0gY2VsbENsaWNrSGFuZGxlcjtcclxuICAgICAgICAgICAgICAgIHRyLmFwcGVuZENoaWxkKGNlbGwpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRhYmxlLmFwcGVuZENoaWxkKHRyKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZ3JpZENvbnRhaW5lci5hcHBlbmRDaGlsZCh0YWJsZSk7XHJcbiAgICB9XHJcblxyXG59XHJcblxyXG4vLyBMYXkgb3V0IHRoZSBib2FyZFxyXG5mdW5jdGlvbiBjcmVhdGVUYWJsZSgpIHtcclxuXHJcbiAgICB2YXIgZ3JpZENvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdncmlkQ29udGFpbmVyJyk7XHJcbiAgICBpZiAoIWdyaWRDb250YWluZXIpIHtcclxuICAgICAgICAvLyBUaHJvdyBlcnJvclxyXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXCJQcm9ibGVtOiBObyBkaXYgZm9yIHRoZSBkcmlkIHRhYmxlIVwiKTtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgdGFibGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwidGFibGVcIik7XHJcblxyXG4gICAgcm93cyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaGVpZ2h0SW5cIikudmFsdWU7XHJcbiAgICBjb2xzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ3aWR0aEluXCIpLnZhbHVlO1xyXG5cclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcm93czsgaSsrKSB7XHJcbiAgICAgICAgdmFyIHRyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInRyXCIpO1xyXG4gICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgY29sczsgaisrKSB7Ly9cclxuICAgICAgICAgICAgdmFyIGNlbGwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwidGRcIik7XHJcbiAgICAgICAgICAgIGNlbGwuc2V0QXR0cmlidXRlKFwiaWRcIiwgaSArIFwiX1wiICsgaik7XHJcbiAgICAgICAgICAgIGNlbGwuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJkZWFkXCIpO1xyXG4gICAgICAgICAgICBjZWxsLm9uY2xpY2sgPSBjZWxsQ2xpY2tIYW5kbGVyO1xyXG4gICAgICAgICAgICB0ci5hcHBlbmRDaGlsZChjZWxsKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGFibGUuYXBwZW5kQ2hpbGQodHIpO1xyXG4gICAgfVxyXG5cclxuICAgIGdyaWRDb250YWluZXIuYXBwZW5kQ2hpbGQodGFibGUpO1xyXG5cclxufVxyXG5cclxuZnVuY3Rpb24gY2VsbENsaWNrSGFuZGxlcigpIHtcclxuICAgIHZhciByb3djb2wgPSB0aGlzLmlkLnNwbGl0KFwiX1wiKTtcclxuICAgIHZhciByb3cgPSByb3djb2xbMF07XHJcbiAgICB2YXIgY29sID0gcm93Y29sWzFdO1xyXG5cclxuICAgIHZhciBjbGFzc2VzID0gdGhpcy5nZXRBdHRyaWJ1dGUoXCJjbGFzc1wiKTtcclxuICAgIGlmIChjbGFzc2VzLmluZGV4T2YoXCJsaXZlXCIpID4gLTEpIHtcclxuICAgICAgICB0aGlzLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIFwiZGVhZFwiKTtcclxuICAgICAgICBncmlkW3Jvd11bY29sXSA9IDA7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJsaXZlXCIpO1xyXG4gICAgICAgIGdyaWRbcm93XVtjb2xdID0gMTtcclxuICAgIH1cclxuXHJcbn1cclxuXHJcbmZ1bmN0aW9uIHVwZGF0ZVZpZXcoKSB7XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHJvd3M7IGkrKykge1xyXG4gICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgY29sczsgaisrKSB7XHJcbiAgICAgICAgICAgIHZhciBjZWxsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaSArIFwiX1wiICsgaik7XHJcbiAgICAgICAgICAgIGlmIChncmlkW2ldW2pdID09IDApIHtcclxuICAgICAgICAgICAgICAgIGNlbGwuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJkZWFkXCIpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgY2VsbC5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBcImxpdmVcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHNldHVwQ29udHJvbEJ1dHRvbnMoKSB7XHJcbiAgICAvLyBidXR0b24gdG8gc3RhcnRcclxuICAgIHZhciBzdGFydEJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdGFydCcpO1xyXG4gICAgc3RhcnRCdXR0b24ub25jbGljayA9IHN0YXJ0QnV0dG9uSGFuZGxlcjtcclxuXHJcbiAgICAvLyBidXR0b24gdG8gY2xlYXJcclxuICAgIHZhciBjbGVhckJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjbGVhcicpO1xyXG4gICAgY2xlYXJCdXR0b24ub25jbGljayA9IGNsZWFyQnV0dG9uSGFuZGxlcjtcclxuXHJcbiAgICAvLyBidXR0b24gdG8gc2V0IHJhbmRvbSBpbml0aWFsIHN0YXRlXHJcbiAgICB2YXIgcmFuZG9tQnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyYW5kb21cIik7XHJcbiAgICByYW5kb21CdXR0b24ub25jbGljayA9IHJhbmRvbUJ1dHRvbkhhbmRsZXI7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJhbmRvbUJ1dHRvbkhhbmRsZXIoKSB7XHJcbiAgICBpZiAocGxheWluZykgcmV0dXJuO1xyXG5cclxuICAgIGNsZWFyQnV0dG9uSGFuZGxlcigpO1xyXG5cclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcm93czsgaSsrKSB7XHJcbiAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBjb2xzOyBqKyspIHtcclxuICAgICAgICAgICAgdmFyIGlzTGl2ZSA9IE1hdGgucm91bmQoTWF0aC5yYW5kb20oKSk7XHJcbiAgICAgICAgICAgIGlmIChpc0xpdmUgPT0gMSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGNlbGwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpICsgXCJfXCIgKyBqKTtcclxuICAgICAgICAgICAgICAgIGNlbGwuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJsaXZlXCIpO1xyXG4gICAgICAgICAgICAgICAgZ3JpZFtpXVtqXSA9IDE7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG5mdW5jdGlvbiBsZXZlbENoYW5nZSgpIHtcclxuICAgIHZhciBsZXZlbExvYWQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImxldmVsXCIpLnZhbHVlO1xyXG4gICAgbGV2ZWxMb2FkLnNwbGl0KFwiXFxuXCIpO1xyXG5cclxuICAgIGZvciAodmFyIHggPSAwOyB4IDwgbGV2ZWxMb2FkLmxlbmd0aDsgeCsrKSB7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCByb3dzOyBpKyspIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBjb2xzOyBqKyspIHtcclxuICAgICAgICAgICAgICAgIGxldmVsTG9hZC5zcGxpdChcIlxcblwiKTtcclxuICAgICAgICAgICAgICAgIHZhciBpc0xpdmUgPSBsZXZlbExvYWRbal1baV07XHJcbiAgICAgICAgICAgICAgICBpZiAoaXNMaXZlID09IDEpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgY2VsbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGkgKyBcIl9cIiArIGopO1xyXG4gICAgICAgICAgICAgICAgICAgIGNlbGwuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJsaXZlXCIpO1xyXG4gICAgICAgICAgICAgICAgfSBcclxuXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxufVxyXG5cclxuLy8gY2xlYXIgdGhlIGdyaWRcclxuZnVuY3Rpb24gY2xlYXJCdXR0b25IYW5kbGVyKCkge1xyXG4gICAgY29uc29sZS5sb2coXCJDbGVhciB0aGUgZ2FtZTogc3RvcCBwbGF5aW5nLCBjbGVhciB0aGUgZ3JpZFwiKTtcclxuXHJcbiAgICByZXNldEdyaWRzKCk7XHJcbiAgICBwbGF5aW5nID0gZmFsc2U7XHJcbiAgICB2YXIgc3RhcnRCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3RhcnQnKTtcclxuICAgIHN0YXJ0QnV0dG9uLmlubmVySFRNTCA9IFwiU3RhcnRcIjtcclxuICAgIGNsZWFyVGltZW91dCh0aW1lcik7XHJcblxyXG4gICAgdmFyIGNlbGxzTGlzdCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJsaXZlXCIpO1xyXG4gICAgLy8gY29udmVydCB0byBhcnJheSBmaXJzdCwgb3RoZXJ3aXNlLCB5b3UncmUgd29ya2luZyBvbiBhIGxpdmUgbm9kZSBsaXN0XHJcbiAgICAvLyBhbmQgdGhlIHVwZGF0ZSBkb2Vzbid0IHdvcmshXHJcbiAgICB2YXIgY2VsbHMgPSBbXTtcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2VsbHNMaXN0Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgY2VsbHMucHVzaChjZWxsc0xpc3RbaV0pO1xyXG4gICAgfVxyXG5cclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2VsbHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBjZWxsc1tpXS5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBcImRlYWRcIik7XHJcbiAgICB9XHJcbiAgICByZXNldEdyaWRzO1xyXG59XHJcblxyXG4vLyBzdGFydC9wYXVzZS9jb250aW51ZSB0aGUgZ2FtZVxyXG5mdW5jdGlvbiBzdGFydEJ1dHRvbkhhbmRsZXIoKSB7XHJcbiAgICBpZiAocGxheWluZykge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiUGF1c2UgdGhlIGdhbWVcIik7XHJcbiAgICAgICAgcGxheWluZyA9IGZhbHNlO1xyXG5cclxuICAgICAgICB0aGlzLmlubmVySFRNTCA9IFwiQ29udGludWVcIjtcclxuICAgICAgICBjbGVhclRpbWVvdXQodGltZXIpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcIkNvbnRpbnVlIHRoZSBnYW1lXCIpO1xyXG4gICAgICAgIHBsYXlpbmcgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMuaW5uZXJIVE1MID0gXCJQYXVzZVwiO1xyXG4gICAgICAgIHBsYXkoKTtcclxuICAgIH1cclxufVxyXG5cclxuLy8gcnVuIHRoZSBsaWZlIGdhbWVcclxuZnVuY3Rpb24gcGxheSgpIHtcclxuICAgIGNvbXB1dGVOZXh0R2VuKCk7XHJcblxyXG4gICAgaWYgKHBsYXlpbmcpIHtcclxuICAgICAgICB0aW1lciA9IHNldFRpbWVvdXQocGxheSwgcmVwcm9kdWN0aW9uVGltZSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNvbXB1dGVOZXh0R2VuKCkge1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCByb3dzOyBpKyspIHtcclxuICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IGNvbHM7IGorKykge1xyXG4gICAgICAgICAgICBhcHBseVJ1bGVzKGksIGopO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyBjb3B5IE5leHRHcmlkIHRvIGdyaWQsIGFuZCByZXNldCBuZXh0R3JpZFxyXG4gICAgY29weUFuZFJlc2V0R3JpZCgpO1xyXG4gICAgLy8gY29weSBhbGwgMSB2YWx1ZXMgdG8gXCJsaXZlXCIgaW4gdGhlIHRhYmxlXHJcbiAgICB1cGRhdGVWaWV3KCk7XHJcbn1cclxuXHJcbi8vIFJVTEVTXHJcbi8vIEFueSBsaXZlIGNlbGwgd2l0aCBmZXdlciB0aGFuIHR3byBsaXZlIG5laWdoYm91cnMgZGllcywgYXMgaWYgY2F1c2VkIGJ5IHVuZGVyLXBvcHVsYXRpb24uXHJcbi8vIEFueSBsaXZlIGNlbGwgd2l0aCB0d28gb3IgdGhyZWUgbGl2ZSBuZWlnaGJvdXJzIGxpdmVzIG9uIHRvIHRoZSBuZXh0IGdlbmVyYXRpb24uXHJcbi8vIEFueSBsaXZlIGNlbGwgd2l0aCBtb3JlIHRoYW4gdGhyZWUgbGl2ZSBuZWlnaGJvdXJzIGRpZXMsIGFzIGlmIGJ5IG92ZXJjcm93ZGluZy5cclxuLy8gQW55IGRlYWQgY2VsbCB3aXRoIGV4YWN0bHkgdGhyZWUgbGl2ZSBuZWlnaGJvdXJzIGJlY29tZXMgYSBsaXZlIGNlbGwsIGFzIGlmIGJ5IHJlcHJvZHVjdGlvbi5cclxuXHJcbmZ1bmN0aW9uIGFwcGx5UnVsZXMocm93LCBjb2wpIHtcclxuICAgIHZhciBudW1OZWlnaGJvcnMgPSBjb3VudE5laWdoYm9ycyhyb3csIGNvbCk7XHJcbiAgICBpZiAoZ3JpZFtyb3ddW2NvbF0gPT0gMSkge1xyXG4gICAgICAgIGlmIChudW1OZWlnaGJvcnMgPCAyKSB7XHJcbiAgICAgICAgICAgIG5leHRHcmlkW3Jvd11bY29sXSA9IDA7XHJcbiAgICAgICAgfSBlbHNlIGlmIChudW1OZWlnaGJvcnMgPT0gMiB8fCBudW1OZWlnaGJvcnMgPT0gMykge1xyXG4gICAgICAgICAgICBuZXh0R3JpZFtyb3ddW2NvbF0gPSAxO1xyXG4gICAgICAgIH0gZWxzZSBpZiAobnVtTmVpZ2hib3JzID4gMykge1xyXG4gICAgICAgICAgICBuZXh0R3JpZFtyb3ddW2NvbF0gPSAwO1xyXG4gICAgICAgIH1cclxuICAgIH0gZWxzZSBpZiAoZ3JpZFtyb3ddW2NvbF0gPT0gMCkge1xyXG4gICAgICAgIGlmIChudW1OZWlnaGJvcnMgPT0gMykge1xyXG4gICAgICAgICAgICBuZXh0R3JpZFtyb3ddW2NvbF0gPSAxO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gY291bnROZWlnaGJvcnMocm93LCBjb2wpIHtcclxuICAgIHZhciBjb3VudCA9IDA7XHJcbiAgICBpZiAocm93IC0gMSA+PSAwKSB7XHJcbiAgICAgICAgaWYgKGdyaWRbcm93IC0gMV1bY29sXSA9PSAxKSBjb3VudCsrO1xyXG4gICAgfVxyXG4gICAgaWYgKHJvdyAtIDEgPj0gMCAmJiBjb2wgLSAxID49IDApIHtcclxuICAgICAgICBpZiAoZ3JpZFtyb3cgLSAxXVtjb2wgLSAxXSA9PSAxKSBjb3VudCsrO1xyXG4gICAgfVxyXG4gICAgaWYgKHJvdyAtIDEgPj0gMCAmJiBjb2wgKyAxIDwgY29scykge1xyXG4gICAgICAgIGlmIChncmlkW3JvdyAtIDFdW2NvbCArIDFdID09IDEpIGNvdW50Kys7XHJcbiAgICB9XHJcbiAgICBpZiAoY29sIC0gMSA+PSAwKSB7XHJcbiAgICAgICAgaWYgKGdyaWRbcm93XVtjb2wgLSAxXSA9PSAxKSBjb3VudCsrO1xyXG4gICAgfVxyXG4gICAgaWYgKGNvbCArIDEgPCBjb2xzKSB7XHJcbiAgICAgICAgaWYgKGdyaWRbcm93XVtjb2wgKyAxXSA9PSAxKSBjb3VudCsrO1xyXG4gICAgfVxyXG4gICAgaWYgKHJvdyArIDEgPCByb3dzKSB7XHJcbiAgICAgICAgaWYgKGdyaWRbcm93ICsgMV1bY29sXSA9PSAxKSBjb3VudCsrO1xyXG4gICAgfVxyXG4gICAgaWYgKHJvdyArIDEgPCByb3dzICYmIGNvbCAtIDEgPj0gMCkge1xyXG4gICAgICAgIGlmIChncmlkW3JvdyArIDFdW2NvbCAtIDFdID09IDEpIGNvdW50Kys7XHJcbiAgICB9XHJcbiAgICBpZiAocm93ICsgMSA8IHJvd3MgJiYgY29sICsgMSA8IGNvbHMpIHtcclxuICAgICAgICBpZiAoZ3JpZFtyb3cgKyAxXVtjb2wgKyAxXSA9PSAxKSBjb3VudCsrO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGNvdW50O1xyXG59XHJcblxyXG4vLyBTdGFydCBldmVyeXRoaW5nXHJcbndpbmRvdy5vbmxvYWQgPSBpbml0aWFsaXplOyIsIi8qKiBAbGljZW5zZVxyXG4gKiBESFRNTCBTbm93c3Rvcm0hIEphdmFTY3JpcHQtYmFzZWQgc25vdyBmb3Igd2ViIHBhZ2VzXHJcbiAqIE1ha2luZyBpdCBzbm93IG9uIHRoZSBpbnRlcm5ldHMgc2luY2UgMjAwMy4gWW91J3JlIHdlbGNvbWUuXHJcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAqIFZlcnNpb24gMS40NC4yMDEzMTIwOCAoUHJldmlvdXMgcmV2OiAxLjQ0LjIwMTMxMTI1KVxyXG4gKiBDb3B5cmlnaHQgKGMpIDIwMDcsIFNjb3R0IFNjaGlsbGVyLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxyXG4gKiBDb2RlIHByb3ZpZGVkIHVuZGVyIHRoZSBCU0QgTGljZW5zZVxyXG4gKiBodHRwOi8vc2NoaWxsbWFuaWEuY29tL3Byb2plY3RzL3Nub3dzdG9ybS9saWNlbnNlLnR4dFxyXG4gKi9cclxuXHJcbi8qanNsaW50IG5vbWVuOiB0cnVlLCBwbHVzcGx1czogdHJ1ZSwgc2xvcHB5OiB0cnVlLCB2YXJzOiB0cnVlLCB3aGl0ZTogdHJ1ZSAqL1xyXG4vKmdsb2JhbCB3aW5kb3csIGRvY3VtZW50LCBuYXZpZ2F0b3IsIGNsZWFySW50ZXJ2YWwsIHNldEludGVydmFsICovXHJcblxyXG52YXIgc25vd1N0b3JtID0gKGZ1bmN0aW9uKHdpbmRvdywgZG9jdW1lbnQpIHtcclxuXHJcbiAgLy8gLS0tIGNvbW1vbiBwcm9wZXJ0aWVzIC0tLVxyXG5cclxuICB0aGlzLmF1dG9TdGFydCA9IHRydWU7ICAgICAgICAgIC8vIFdoZXRoZXIgdGhlIHNub3cgc2hvdWxkIHN0YXJ0IGF1dG9tYXRpY2FsbHkgb3Igbm90LlxyXG4gIHRoaXMuZXhjbHVkZU1vYmlsZSA9IHRydWU7ICAgICAgLy8gU25vdyBpcyBsaWtlbHkgdG8gYmUgYmFkIG5ld3MgZm9yIG1vYmlsZSBwaG9uZXMnIENQVXMgKGFuZCBiYXR0ZXJpZXMuKSBFbmFibGUgYXQgeW91ciBvd24gcmlzay5cclxuICB0aGlzLmZsYWtlc01heCA9IDEyODsgICAgICAgICAgIC8vIExpbWl0IHRvdGFsIGFtb3VudCBvZiBzbm93IG1hZGUgKGZhbGxpbmcgKyBzdGlja2luZylcclxuICB0aGlzLmZsYWtlc01heEFjdGl2ZSA9IDY0OyAgICAgIC8vIExpbWl0IGFtb3VudCBvZiBzbm93IGZhbGxpbmcgYXQgb25jZSAobGVzcyA9IGxvd2VyIENQVSB1c2UpXHJcbiAgdGhpcy5hbmltYXRpb25JbnRlcnZhbCA9IDMzOyAgICAvLyBUaGVvcmV0aWNhbCBcIm1pbGlzZWNvbmRzIHBlciBmcmFtZVwiIG1lYXN1cmVtZW50LiAyMCA9IGZhc3QgKyBzbW9vdGgsIGJ1dCBoaWdoIENQVSB1c2UuIDUwID0gbW9yZSBjb25zZXJ2YXRpdmUsIGJ1dCBzbG93ZXJcclxuICB0aGlzLnVzZUdQVSA9IHRydWU7ICAgICAgICAgICAgIC8vIEVuYWJsZSB0cmFuc2Zvcm0tYmFzZWQgaGFyZHdhcmUgYWNjZWxlcmF0aW9uLCByZWR1Y2UgQ1BVIGxvYWQuXHJcbiAgdGhpcy5jbGFzc05hbWUgPSBudWxsOyAgICAgICAgICAvLyBDU1MgY2xhc3MgbmFtZSBmb3IgZnVydGhlciBjdXN0b21pemF0aW9uIG9uIHNub3cgZWxlbWVudHNcclxuICB0aGlzLmV4Y2x1ZGVNb2JpbGUgPSB0cnVlOyAgICAgIC8vIFNub3cgaXMgbGlrZWx5IHRvIGJlIGJhZCBuZXdzIGZvciBtb2JpbGUgcGhvbmVzJyBDUFVzIChhbmQgYmF0dGVyaWVzLikgQnkgZGVmYXVsdCwgYmUgbmljZS5cclxuICB0aGlzLmZsYWtlQm90dG9tID0gbnVsbDsgICAgICAgIC8vIEludGVnZXIgZm9yIFkgYXhpcyBzbm93IGxpbWl0LCAwIG9yIG51bGwgZm9yIFwiZnVsbC1zY3JlZW5cIiBzbm93IGVmZmVjdFxyXG4gIHRoaXMuZm9sbG93TW91c2UgPSB0cnVlOyAgICAgICAgLy8gU25vdyBtb3ZlbWVudCBjYW4gcmVzcG9uZCB0byB0aGUgdXNlcidzIG1vdXNlXHJcbiAgdGhpcy5zbm93Q29sb3IgPSAnI2ZmZic7ICAgICAgICAvLyBEb24ndCBlYXQgKG9yIHVzZT8pIHllbGxvdyBzbm93LlxyXG4gIHRoaXMuc25vd0NoYXJhY3RlciA9ICcmYnVsbDsnOyAgLy8gJmJ1bGw7ID0gYnVsbGV0LCAmbWlkZG90OyBpcyBzcXVhcmUgb24gc29tZSBzeXN0ZW1zIGV0Yy5cclxuICB0aGlzLnNub3dTdGljayA9IHRydWU7ICAgICAgICAgIC8vIFdoZXRoZXIgb3Igbm90IHNub3cgc2hvdWxkIFwic3RpY2tcIiBhdCB0aGUgYm90dG9tLiBXaGVuIG9mZiwgd2lsbCBuZXZlciBjb2xsZWN0LlxyXG4gIHRoaXMudGFyZ2V0RWxlbWVudCA9IG51bGw7ICAgICAgLy8gZWxlbWVudCB3aGljaCBzbm93IHdpbGwgYmUgYXBwZW5kZWQgdG8gKG51bGwgPSBkb2N1bWVudC5ib2R5KSAtIGNhbiBiZSBhbiBlbGVtZW50IElEIGVnLiAnbXlEaXYnLCBvciBhIERPTSBub2RlIHJlZmVyZW5jZVxyXG4gIHRoaXMudXNlTWVsdEVmZmVjdCA9IHRydWU7ICAgICAgLy8gV2hlbiByZWN5Y2xpbmcgZmFsbGVuIHNub3cgKG9yIHJhcmVseSwgd2hlbiBmYWxsaW5nKSwgaGF2ZSBpdCBcIm1lbHRcIiBhbmQgZmFkZSBvdXQgaWYgYnJvd3NlciBzdXBwb3J0cyBpdFxyXG4gIHRoaXMudXNlVHdpbmtsZUVmZmVjdCA9IGZhbHNlOyAgLy8gQWxsb3cgc25vdyB0byByYW5kb21seSBcImZsaWNrZXJcIiBpbiBhbmQgb3V0IG9mIHZpZXcgd2hpbGUgZmFsbGluZ1xyXG4gIHRoaXMudXNlUG9zaXRpb25GaXhlZCA9IGZhbHNlOyAgLy8gdHJ1ZSA9IHNub3cgZG9lcyBub3Qgc2hpZnQgdmVydGljYWxseSB3aGVuIHNjcm9sbGluZy4gTWF5IGluY3JlYXNlIENQVSBsb2FkLCBkaXNhYmxlZCBieSBkZWZhdWx0IC0gaWYgZW5hYmxlZCwgdXNlZCBvbmx5IHdoZXJlIHN1cHBvcnRlZFxyXG4gIHRoaXMudXNlUGl4ZWxQb3NpdGlvbiA9IGZhbHNlOyAgLy8gV2hldGhlciB0byB1c2UgcGl4ZWwgdmFsdWVzIGZvciBzbm93IHRvcC9sZWZ0IHZzLiBwZXJjZW50YWdlcy4gQXV0by1lbmFibGVkIGlmIGJvZHkgaXMgcG9zaXRpb246cmVsYXRpdmUgb3IgdGFyZ2V0RWxlbWVudCBpcyBzcGVjaWZpZWQuXHJcblxyXG4gIC8vIC0tLSBsZXNzLXVzZWQgYml0cyAtLS1cclxuXHJcbiAgdGhpcy5mcmVlemVPbkJsdXIgPSB0cnVlOyAgICAgICAvLyBPbmx5IHNub3cgd2hlbiB0aGUgd2luZG93IGlzIGluIGZvY3VzIChmb3JlZ3JvdW5kLikgU2F2ZXMgQ1BVLlxyXG4gIHRoaXMuZmxha2VMZWZ0T2Zmc2V0ID0gMDsgICAgICAgLy8gTGVmdCBtYXJnaW4vZ3V0dGVyIHNwYWNlIG9uIGVkZ2Ugb2YgY29udGFpbmVyIChlZy4gYnJvd3NlciB3aW5kb3cuKSBCdW1wIHVwIHRoZXNlIHZhbHVlcyBpZiBzZWVpbmcgaG9yaXpvbnRhbCBzY3JvbGxiYXJzLlxyXG4gIHRoaXMuZmxha2VSaWdodE9mZnNldCA9IDA7ICAgICAgLy8gUmlnaHQgbWFyZ2luL2d1dHRlciBzcGFjZSBvbiBlZGdlIG9mIGNvbnRhaW5lclxyXG4gIHRoaXMuZmxha2VXaWR0aCA9IDg7ICAgICAgICAgICAgLy8gTWF4IHBpeGVsIHdpZHRoIHJlc2VydmVkIGZvciBzbm93IGVsZW1lbnRcclxuICB0aGlzLmZsYWtlSGVpZ2h0ID0gODsgICAgICAgICAgIC8vIE1heCBwaXhlbCBoZWlnaHQgcmVzZXJ2ZWQgZm9yIHNub3cgZWxlbWVudFxyXG4gIHRoaXMudk1heFggPSA1OyAgICAgICAgICAgICAgICAgLy8gTWF4aW11bSBYIHZlbG9jaXR5IHJhbmdlIGZvciBzbm93XHJcbiAgdGhpcy52TWF4WSA9IDQ7ICAgICAgICAgICAgICAgICAvLyBNYXhpbXVtIFkgdmVsb2NpdHkgcmFuZ2UgZm9yIHNub3dcclxuICB0aGlzLnpJbmRleCA9IDA7ICAgICAgICAgICAgICAgIC8vIENTUyBzdGFja2luZyBvcmRlciBhcHBsaWVkIHRvIGVhY2ggc25vd2ZsYWtlXHJcblxyXG4gIC8vIC0tLSBcIk5vIHVzZXItc2VydmljZWFibGUgcGFydHMgaW5zaWRlXCIgcGFzdCB0aGlzIHBvaW50LCB5YWRkYSB5YWRkYSAtLS1cclxuXHJcbiAgdmFyIHN0b3JtID0gdGhpcyxcclxuICBmZWF0dXJlcyxcclxuICAvLyBVQSBzbmlmZmluZyBhbmQgYmFja0NvbXBhdCByZW5kZXJpbmcgbW9kZSBjaGVja3MgZm9yIGZpeGVkIHBvc2l0aW9uLCBldGMuXHJcbiAgaXNJRSA9IG5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goL21zaWUvaSksXHJcbiAgaXNJRTYgPSBuYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKC9tc2llIDYvaSksXHJcbiAgaXNNb2JpbGUgPSBuYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKC9tb2JpbGV8b3BlcmEgbShvYnxpbikvaSksXHJcbiAgaXNCYWNrQ29tcGF0SUUgPSAoaXNJRSAmJiBkb2N1bWVudC5jb21wYXRNb2RlID09PSAnQmFja0NvbXBhdCcpLFxyXG4gIG5vRml4ZWQgPSAoaXNCYWNrQ29tcGF0SUUgfHwgaXNJRTYpLFxyXG4gIHNjcmVlblggPSBudWxsLCBzY3JlZW5YMiA9IG51bGwsIHNjcmVlblkgPSBudWxsLCBzY3JvbGxZID0gbnVsbCwgZG9jSGVpZ2h0ID0gbnVsbCwgdlJuZFggPSBudWxsLCB2Um5kWSA9IG51bGwsXHJcbiAgd2luZE9mZnNldCA9IDEsXHJcbiAgd2luZE11bHRpcGxpZXIgPSAyLFxyXG4gIGZsYWtlVHlwZXMgPSA2LFxyXG4gIGZpeGVkRm9yRXZlcnl0aGluZyA9IGZhbHNlLFxyXG4gIHRhcmdldEVsZW1lbnRJc1JlbGF0aXZlID0gZmFsc2UsXHJcbiAgb3BhY2l0eVN1cHBvcnRlZCA9IChmdW5jdGlvbigpe1xyXG4gICAgdHJ5IHtcclxuICAgICAgZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jykuc3R5bGUub3BhY2l0eSA9ICcwLjUnO1xyXG4gICAgfSBjYXRjaChlKSB7XHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuICAgIHJldHVybiB0cnVlO1xyXG4gIH0oKSksXHJcbiAgZGlkSW5pdCA9IGZhbHNlLFxyXG4gIGRvY0ZyYWcgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7XHJcblxyXG4gIGZlYXR1cmVzID0gKGZ1bmN0aW9uKCkge1xyXG5cclxuICAgIHZhciBnZXRBbmltYXRpb25GcmFtZTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIGhhdCB0aXA6IHBhdWwgaXJpc2hcclxuICAgICAqIGh0dHA6Ly9wYXVsaXJpc2guY29tLzIwMTEvcmVxdWVzdGFuaW1hdGlvbmZyYW1lLWZvci1zbWFydC1hbmltYXRpbmcvXHJcbiAgICAgKiBodHRwczovL2dpc3QuZ2l0aHViLmNvbS84Mzg3ODVcclxuICAgICAqL1xyXG5cclxuICAgIGZ1bmN0aW9uIHRpbWVvdXRTaGltKGNhbGxiYWNrKSB7XHJcbiAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KGNhbGxiYWNrLCAxMDAwLyhzdG9ybS5hbmltYXRpb25JbnRlcnZhbCB8fCAyMCkpO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciBfYW5pbWF0aW9uRnJhbWUgPSAod2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSB8fFxyXG4gICAgICAgIHdpbmRvdy53ZWJraXRSZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHxcclxuICAgICAgICB3aW5kb3cubW96UmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8XHJcbiAgICAgICAgd2luZG93Lm9SZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHxcclxuICAgICAgICB3aW5kb3cubXNSZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHxcclxuICAgICAgICB0aW1lb3V0U2hpbSk7XHJcblxyXG4gICAgLy8gYXBwbHkgdG8gd2luZG93LCBhdm9pZCBcImlsbGVnYWwgaW52b2NhdGlvblwiIGVycm9ycyBpbiBDaHJvbWVcclxuICAgIGdldEFuaW1hdGlvbkZyYW1lID0gX2FuaW1hdGlvbkZyYW1lID8gZnVuY3Rpb24oKSB7XHJcbiAgICAgIHJldHVybiBfYW5pbWF0aW9uRnJhbWUuYXBwbHkod2luZG93LCBhcmd1bWVudHMpO1xyXG4gICAgfSA6IG51bGw7XHJcblxyXG4gICAgdmFyIHRlc3REaXY7XHJcblxyXG4gICAgdGVzdERpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG5cclxuICAgIGZ1bmN0aW9uIGhhcyhwcm9wKSB7XHJcblxyXG4gICAgICAvLyB0ZXN0IGZvciBmZWF0dXJlIHN1cHBvcnRcclxuICAgICAgdmFyIHJlc3VsdCA9IHRlc3REaXYuc3R5bGVbcHJvcF07XHJcbiAgICAgIHJldHVybiAocmVzdWx0ICE9PSB1bmRlZmluZWQgPyBwcm9wIDogbnVsbCk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIC8vIG5vdGUgbG9jYWwgc2NvcGUuXHJcbiAgICB2YXIgbG9jYWxGZWF0dXJlcyA9IHtcclxuXHJcbiAgICAgIHRyYW5zZm9ybToge1xyXG4gICAgICAgIGllOiAgaGFzKCctbXMtdHJhbnNmb3JtJyksXHJcbiAgICAgICAgbW96OiBoYXMoJ01velRyYW5zZm9ybScpLFxyXG4gICAgICAgIG9wZXJhOiBoYXMoJ09UcmFuc2Zvcm0nKSxcclxuICAgICAgICB3ZWJraXQ6IGhhcygnd2Via2l0VHJhbnNmb3JtJyksXHJcbiAgICAgICAgdzM6IGhhcygndHJhbnNmb3JtJyksXHJcbiAgICAgICAgcHJvcDogbnVsbCAvLyB0aGUgbm9ybWFsaXplZCBwcm9wZXJ0eSB2YWx1ZVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgZ2V0QW5pbWF0aW9uRnJhbWU6IGdldEFuaW1hdGlvbkZyYW1lXHJcblxyXG4gICAgfTtcclxuXHJcbiAgICBsb2NhbEZlYXR1cmVzLnRyYW5zZm9ybS5wcm9wID0gKFxyXG4gICAgICBsb2NhbEZlYXR1cmVzLnRyYW5zZm9ybS53MyB8fCBcclxuICAgICAgbG9jYWxGZWF0dXJlcy50cmFuc2Zvcm0ubW96IHx8XHJcbiAgICAgIGxvY2FsRmVhdHVyZXMudHJhbnNmb3JtLndlYmtpdCB8fFxyXG4gICAgICBsb2NhbEZlYXR1cmVzLnRyYW5zZm9ybS5pZSB8fFxyXG4gICAgICBsb2NhbEZlYXR1cmVzLnRyYW5zZm9ybS5vcGVyYVxyXG4gICAgKTtcclxuXHJcbiAgICB0ZXN0RGl2ID0gbnVsbDtcclxuXHJcbiAgICByZXR1cm4gbG9jYWxGZWF0dXJlcztcclxuXHJcbiAgfSgpKTtcclxuXHJcbiAgdGhpcy50aW1lciA9IG51bGw7XHJcbiAgdGhpcy5mbGFrZXMgPSBbXTtcclxuICB0aGlzLmRpc2FibGVkID0gZmFsc2U7XHJcbiAgdGhpcy5hY3RpdmUgPSBmYWxzZTtcclxuICB0aGlzLm1lbHRGcmFtZUNvdW50ID0gMjA7XHJcbiAgdGhpcy5tZWx0RnJhbWVzID0gW107XHJcblxyXG4gIHRoaXMuc2V0WFkgPSBmdW5jdGlvbihvLCB4LCB5KSB7XHJcblxyXG4gICAgaWYgKCFvKSB7XHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoc3Rvcm0udXNlUGl4ZWxQb3NpdGlvbiB8fCB0YXJnZXRFbGVtZW50SXNSZWxhdGl2ZSkge1xyXG5cclxuICAgICAgby5zdHlsZS5sZWZ0ID0gKHggLSBzdG9ybS5mbGFrZVdpZHRoKSArICdweCc7XHJcbiAgICAgIG8uc3R5bGUudG9wID0gKHkgLSBzdG9ybS5mbGFrZUhlaWdodCkgKyAncHgnO1xyXG5cclxuICAgIH0gZWxzZSBpZiAobm9GaXhlZCkge1xyXG5cclxuICAgICAgby5zdHlsZS5yaWdodCA9ICgxMDAtKHgvc2NyZWVuWCoxMDApKSArICclJztcclxuICAgICAgLy8gYXZvaWQgY3JlYXRpbmcgdmVydGljYWwgc2Nyb2xsYmFyc1xyXG4gICAgICBvLnN0eWxlLnRvcCA9IChNYXRoLm1pbih5LCBkb2NIZWlnaHQtc3Rvcm0uZmxha2VIZWlnaHQpKSArICdweCc7XHJcblxyXG4gICAgfSBlbHNlIHtcclxuXHJcbiAgICAgIGlmICghc3Rvcm0uZmxha2VCb3R0b20pIHtcclxuXHJcbiAgICAgICAgLy8gaWYgbm90IHVzaW5nIGEgZml4ZWQgYm90dG9tIGNvb3JkaW5hdGUuLi5cclxuICAgICAgICBvLnN0eWxlLnJpZ2h0ID0gKDEwMC0oeC9zY3JlZW5YKjEwMCkpICsgJyUnO1xyXG4gICAgICAgIG8uc3R5bGUuYm90dG9tID0gKDEwMC0oeS9zY3JlZW5ZKjEwMCkpICsgJyUnO1xyXG5cclxuICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgLy8gYWJzb2x1dGUgdG9wLlxyXG4gICAgICAgIG8uc3R5bGUucmlnaHQgPSAoMTAwLSh4L3NjcmVlblgqMTAwKSkgKyAnJSc7XHJcbiAgICAgICAgby5zdHlsZS50b3AgPSAoTWF0aC5taW4oeSwgZG9jSGVpZ2h0LXN0b3JtLmZsYWtlSGVpZ2h0KSkgKyAncHgnO1xyXG5cclxuICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcbiAgfTtcclxuXHJcbiAgdGhpcy5ldmVudHMgPSAoZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgdmFyIG9sZCA9ICghd2luZG93LmFkZEV2ZW50TGlzdGVuZXIgJiYgd2luZG93LmF0dGFjaEV2ZW50KSwgc2xpY2UgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UsXHJcbiAgICBldnQgPSB7XHJcbiAgICAgIGFkZDogKG9sZD8nYXR0YWNoRXZlbnQnOidhZGRFdmVudExpc3RlbmVyJyksXHJcbiAgICAgIHJlbW92ZTogKG9sZD8nZGV0YWNoRXZlbnQnOidyZW1vdmVFdmVudExpc3RlbmVyJylcclxuICAgIH07XHJcblxyXG4gICAgZnVuY3Rpb24gZ2V0QXJncyhvQXJncykge1xyXG4gICAgICB2YXIgYXJncyA9IHNsaWNlLmNhbGwob0FyZ3MpLCBsZW4gPSBhcmdzLmxlbmd0aDtcclxuICAgICAgaWYgKG9sZCkge1xyXG4gICAgICAgIGFyZ3NbMV0gPSAnb24nICsgYXJnc1sxXTsgLy8gcHJlZml4XHJcbiAgICAgICAgaWYgKGxlbiA+IDMpIHtcclxuICAgICAgICAgIGFyZ3MucG9wKCk7IC8vIG5vIGNhcHR1cmVcclxuICAgICAgICB9XHJcbiAgICAgIH0gZWxzZSBpZiAobGVuID09PSAzKSB7XHJcbiAgICAgICAgYXJncy5wdXNoKGZhbHNlKTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gYXJncztcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBhcHBseShhcmdzLCBzVHlwZSkge1xyXG4gICAgICB2YXIgZWxlbWVudCA9IGFyZ3Muc2hpZnQoKSxcclxuICAgICAgICAgIG1ldGhvZCA9IFtldnRbc1R5cGVdXTtcclxuICAgICAgaWYgKG9sZCkge1xyXG4gICAgICAgIGVsZW1lbnRbbWV0aG9kXShhcmdzWzBdLCBhcmdzWzFdKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBlbGVtZW50W21ldGhvZF0uYXBwbHkoZWxlbWVudCwgYXJncyk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBhZGRFdmVudCgpIHtcclxuICAgICAgYXBwbHkoZ2V0QXJncyhhcmd1bWVudHMpLCAnYWRkJyk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gcmVtb3ZlRXZlbnQoKSB7XHJcbiAgICAgIGFwcGx5KGdldEFyZ3MoYXJndW1lbnRzKSwgJ3JlbW92ZScpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgIGFkZDogYWRkRXZlbnQsXHJcbiAgICAgIHJlbW92ZTogcmVtb3ZlRXZlbnRcclxuICAgIH07XHJcblxyXG4gIH0oKSk7XHJcblxyXG4gIGZ1bmN0aW9uIHJuZChuLG1pbikge1xyXG4gICAgaWYgKGlzTmFOKG1pbikpIHtcclxuICAgICAgbWluID0gMDtcclxuICAgIH1cclxuICAgIHJldHVybiAoTWF0aC5yYW5kb20oKSpuKSttaW47XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBwbHVzTWludXMobikge1xyXG4gICAgcmV0dXJuIChwYXJzZUludChybmQoMiksMTApPT09MT9uKi0xOm4pO1xyXG4gIH1cclxuXHJcbiAgdGhpcy5yYW5kb21pemVXaW5kID0gZnVuY3Rpb24oKSB7XHJcbiAgICB2YXIgaTtcclxuICAgIHZSbmRYID0gcGx1c01pbnVzKHJuZChzdG9ybS52TWF4WCwwLjIpKTtcclxuICAgIHZSbmRZID0gcm5kKHN0b3JtLnZNYXhZLDAuMik7XHJcbiAgICBpZiAodGhpcy5mbGFrZXMpIHtcclxuICAgICAgZm9yIChpPTA7IGk8dGhpcy5mbGFrZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBpZiAodGhpcy5mbGFrZXNbaV0uYWN0aXZlKSB7XHJcbiAgICAgICAgICB0aGlzLmZsYWtlc1tpXS5zZXRWZWxvY2l0aWVzKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgdGhpcy5zY3JvbGxIYW5kbGVyID0gZnVuY3Rpb24oKSB7XHJcbiAgICB2YXIgaTtcclxuICAgIC8vIFwiYXR0YWNoXCIgc25vd2ZsYWtlcyB0byBib3R0b20gb2Ygd2luZG93IGlmIG5vIGFic29sdXRlIGJvdHRvbSB2YWx1ZSB3YXMgZ2l2ZW5cclxuICAgIHNjcm9sbFkgPSAoc3Rvcm0uZmxha2VCb3R0b20gPyAwIDogcGFyc2VJbnQod2luZG93LnNjcm9sbFkgfHwgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbFRvcCB8fCAobm9GaXhlZCA/IGRvY3VtZW50LmJvZHkuc2Nyb2xsVG9wIDogMCksIDEwKSk7XHJcbiAgICBpZiAoaXNOYU4oc2Nyb2xsWSkpIHtcclxuICAgICAgc2Nyb2xsWSA9IDA7IC8vIE5ldHNjYXBlIDYgc2Nyb2xsIGZpeFxyXG4gICAgfVxyXG4gICAgaWYgKCFmaXhlZEZvckV2ZXJ5dGhpbmcgJiYgIXN0b3JtLmZsYWtlQm90dG9tICYmIHN0b3JtLmZsYWtlcykge1xyXG4gICAgICBmb3IgKGk9MDsgaTxzdG9ybS5mbGFrZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBpZiAoc3Rvcm0uZmxha2VzW2ldLmFjdGl2ZSA9PT0gMCkge1xyXG4gICAgICAgICAgc3Rvcm0uZmxha2VzW2ldLnN0aWNrKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgdGhpcy5yZXNpemVIYW5kbGVyID0gZnVuY3Rpb24oKSB7XHJcbiAgICBpZiAod2luZG93LmlubmVyV2lkdGggfHwgd2luZG93LmlubmVySGVpZ2h0KSB7XHJcbiAgICAgIHNjcmVlblggPSB3aW5kb3cuaW5uZXJXaWR0aCAtIDE2IC0gc3Rvcm0uZmxha2VSaWdodE9mZnNldDtcclxuICAgICAgc2NyZWVuWSA9IChzdG9ybS5mbGFrZUJvdHRvbSB8fCB3aW5kb3cuaW5uZXJIZWlnaHQpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgc2NyZWVuWCA9IChkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50V2lkdGggfHwgZG9jdW1lbnQuYm9keS5jbGllbnRXaWR0aCB8fCBkb2N1bWVudC5ib2R5LnNjcm9sbFdpZHRoKSAtICghaXNJRSA/IDggOiAwKSAtIHN0b3JtLmZsYWtlUmlnaHRPZmZzZXQ7XHJcbiAgICAgIHNjcmVlblkgPSBzdG9ybS5mbGFrZUJvdHRvbSB8fCBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50SGVpZ2h0IHx8IGRvY3VtZW50LmJvZHkuY2xpZW50SGVpZ2h0IHx8IGRvY3VtZW50LmJvZHkuc2Nyb2xsSGVpZ2h0O1xyXG4gICAgfVxyXG4gICAgZG9jSGVpZ2h0ID0gZG9jdW1lbnQuYm9keS5vZmZzZXRIZWlnaHQ7XHJcbiAgICBzY3JlZW5YMiA9IHBhcnNlSW50KHNjcmVlblgvMiwxMCk7XHJcbiAgfTtcclxuXHJcbiAgdGhpcy5yZXNpemVIYW5kbGVyQWx0ID0gZnVuY3Rpb24oKSB7XHJcbiAgICBzY3JlZW5YID0gc3Rvcm0udGFyZ2V0RWxlbWVudC5vZmZzZXRXaWR0aCAtIHN0b3JtLmZsYWtlUmlnaHRPZmZzZXQ7XHJcbiAgICBzY3JlZW5ZID0gc3Rvcm0uZmxha2VCb3R0b20gfHwgc3Rvcm0udGFyZ2V0RWxlbWVudC5vZmZzZXRIZWlnaHQ7XHJcbiAgICBzY3JlZW5YMiA9IHBhcnNlSW50KHNjcmVlblgvMiwxMCk7XHJcbiAgICBkb2NIZWlnaHQgPSBkb2N1bWVudC5ib2R5Lm9mZnNldEhlaWdodDtcclxuICB9O1xyXG5cclxuICB0aGlzLmZyZWV6ZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgLy8gcGF1c2UgYW5pbWF0aW9uXHJcbiAgICBpZiAoIXN0b3JtLmRpc2FibGVkKSB7XHJcbiAgICAgIHN0b3JtLmRpc2FibGVkID0gMTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuICAgIHN0b3JtLnRpbWVyID0gbnVsbDtcclxuICB9O1xyXG5cclxuICB0aGlzLnJlc3VtZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgaWYgKHN0b3JtLmRpc2FibGVkKSB7XHJcbiAgICAgICBzdG9ybS5kaXNhYmxlZCA9IDA7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbiAgICBzdG9ybS50aW1lckluaXQoKTtcclxuICB9O1xyXG5cclxuICB0aGlzLnRvZ2dsZVNub3cgPSBmdW5jdGlvbigpIHtcclxuICAgIGlmICghc3Rvcm0uZmxha2VzLmxlbmd0aCkge1xyXG4gICAgICAvLyBmaXJzdCBydW5cclxuICAgICAgc3Rvcm0uc3RhcnQoKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHN0b3JtLmFjdGl2ZSA9ICFzdG9ybS5hY3RpdmU7XHJcbiAgICAgIGlmIChzdG9ybS5hY3RpdmUpIHtcclxuICAgICAgICBzdG9ybS5zaG93KCk7XHJcbiAgICAgICAgc3Rvcm0ucmVzdW1lKCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgc3Rvcm0uc3RvcCgpO1xyXG4gICAgICAgIHN0b3JtLmZyZWV6ZSgpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgdGhpcy5zdG9wID0gZnVuY3Rpb24oKSB7XHJcbiAgICB2YXIgaTtcclxuICAgIHRoaXMuZnJlZXplKCk7XHJcbiAgICBmb3IgKGk9MDsgaTx0aGlzLmZsYWtlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICB0aGlzLmZsYWtlc1tpXS5vLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XHJcbiAgICB9XHJcbiAgICBzdG9ybS5ldmVudHMucmVtb3ZlKHdpbmRvdywnc2Nyb2xsJyxzdG9ybS5zY3JvbGxIYW5kbGVyKTtcclxuICAgIHN0b3JtLmV2ZW50cy5yZW1vdmUod2luZG93LCdyZXNpemUnLHN0b3JtLnJlc2l6ZUhhbmRsZXIpO1xyXG4gICAgaWYgKHN0b3JtLmZyZWV6ZU9uQmx1cikge1xyXG4gICAgICBpZiAoaXNJRSkge1xyXG4gICAgICAgIHN0b3JtLmV2ZW50cy5yZW1vdmUoZG9jdW1lbnQsJ2ZvY3Vzb3V0JyxzdG9ybS5mcmVlemUpO1xyXG4gICAgICAgIHN0b3JtLmV2ZW50cy5yZW1vdmUoZG9jdW1lbnQsJ2ZvY3VzaW4nLHN0b3JtLnJlc3VtZSk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgc3Rvcm0uZXZlbnRzLnJlbW92ZSh3aW5kb3csJ2JsdXInLHN0b3JtLmZyZWV6ZSk7XHJcbiAgICAgICAgc3Rvcm0uZXZlbnRzLnJlbW92ZSh3aW5kb3csJ2ZvY3VzJyxzdG9ybS5yZXN1bWUpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgdGhpcy5zaG93ID0gZnVuY3Rpb24oKSB7XHJcbiAgICB2YXIgaTtcclxuICAgIGZvciAoaT0wOyBpPHRoaXMuZmxha2VzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIHRoaXMuZmxha2VzW2ldLm8uc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgdGhpcy5Tbm93Rmxha2UgPSBmdW5jdGlvbih0eXBlLHgseSkge1xyXG4gICAgdmFyIHMgPSB0aGlzO1xyXG4gICAgdGhpcy50eXBlID0gdHlwZTtcclxuICAgIHRoaXMueCA9IHh8fHBhcnNlSW50KHJuZChzY3JlZW5YLTIwKSwxMCk7XHJcbiAgICB0aGlzLnkgPSAoIWlzTmFOKHkpP3k6LXJuZChzY3JlZW5ZKS0xMik7XHJcbiAgICB0aGlzLnZYID0gbnVsbDtcclxuICAgIHRoaXMudlkgPSBudWxsO1xyXG4gICAgdGhpcy52QW1wVHlwZXMgPSBbMSwxLjIsMS40LDEuNiwxLjhdOyAvLyBcImFtcGxpZmljYXRpb25cIiBmb3IgdlgvdlkgKGJhc2VkIG9uIGZsYWtlIHNpemUvdHlwZSlcclxuICAgIHRoaXMudkFtcCA9IHRoaXMudkFtcFR5cGVzW3RoaXMudHlwZV0gfHwgMTtcclxuICAgIHRoaXMubWVsdGluZyA9IGZhbHNlO1xyXG4gICAgdGhpcy5tZWx0RnJhbWVDb3VudCA9IHN0b3JtLm1lbHRGcmFtZUNvdW50O1xyXG4gICAgdGhpcy5tZWx0RnJhbWVzID0gc3Rvcm0ubWVsdEZyYW1lcztcclxuICAgIHRoaXMubWVsdEZyYW1lID0gMDtcclxuICAgIHRoaXMudHdpbmtsZUZyYW1lID0gMDtcclxuICAgIHRoaXMuYWN0aXZlID0gMTtcclxuICAgIHRoaXMuZm9udFNpemUgPSAoMTArKHRoaXMudHlwZS81KSoxMCk7XHJcbiAgICB0aGlzLm8gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgIHRoaXMuby5pbm5lckhUTUwgPSBzdG9ybS5zbm93Q2hhcmFjdGVyO1xyXG4gICAgaWYgKHN0b3JtLmNsYXNzTmFtZSkge1xyXG4gICAgICB0aGlzLm8uc2V0QXR0cmlidXRlKCdjbGFzcycsIHN0b3JtLmNsYXNzTmFtZSk7XHJcbiAgICB9XHJcbiAgICB0aGlzLm8uc3R5bGUuY29sb3IgPSBzdG9ybS5zbm93Q29sb3I7XHJcbiAgICB0aGlzLm8uc3R5bGUucG9zaXRpb24gPSAoZml4ZWRGb3JFdmVyeXRoaW5nPydmaXhlZCc6J2Fic29sdXRlJyk7XHJcbiAgICBpZiAoc3Rvcm0udXNlR1BVICYmIGZlYXR1cmVzLnRyYW5zZm9ybS5wcm9wKSB7XHJcbiAgICAgIC8vIEdQVS1hY2NlbGVyYXRlZCBzbm93LlxyXG4gICAgICB0aGlzLm8uc3R5bGVbZmVhdHVyZXMudHJhbnNmb3JtLnByb3BdID0gJ3RyYW5zbGF0ZTNkKDBweCwgMHB4LCAwcHgpJztcclxuICAgIH1cclxuICAgIHRoaXMuby5zdHlsZS53aWR0aCA9IHN0b3JtLmZsYWtlV2lkdGgrJ3B4JztcclxuICAgIHRoaXMuby5zdHlsZS5oZWlnaHQgPSBzdG9ybS5mbGFrZUhlaWdodCsncHgnO1xyXG4gICAgdGhpcy5vLnN0eWxlLmZvbnRGYW1pbHkgPSAnYXJpYWwsdmVyZGFuYSc7XHJcbiAgICB0aGlzLm8uc3R5bGUuY3Vyc29yID0gJ2RlZmF1bHQnO1xyXG4gICAgdGhpcy5vLnN0eWxlLm92ZXJmbG93ID0gJ2hpZGRlbic7XHJcbiAgICB0aGlzLm8uc3R5bGUuZm9udFdlaWdodCA9ICdub3JtYWwnO1xyXG4gICAgdGhpcy5vLnN0eWxlLnpJbmRleCA9IHN0b3JtLnpJbmRleDtcclxuICAgIGRvY0ZyYWcuYXBwZW5kQ2hpbGQodGhpcy5vKTtcclxuXHJcbiAgICB0aGlzLnJlZnJlc2ggPSBmdW5jdGlvbigpIHtcclxuICAgICAgaWYgKGlzTmFOKHMueCkgfHwgaXNOYU4ocy55KSkge1xyXG4gICAgICAgIC8vIHNhZmV0eSBjaGVja1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgfVxyXG4gICAgICBzdG9ybS5zZXRYWShzLm8sIHMueCwgcy55KTtcclxuICAgIH07XHJcblxyXG4gICAgdGhpcy5zdGljayA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICBpZiAobm9GaXhlZCB8fCAoc3Rvcm0udGFyZ2V0RWxlbWVudCAhPT0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50ICYmIHN0b3JtLnRhcmdldEVsZW1lbnQgIT09IGRvY3VtZW50LmJvZHkpKSB7XHJcbiAgICAgICAgcy5vLnN0eWxlLnRvcCA9IChzY3JlZW5ZK3Njcm9sbFktc3Rvcm0uZmxha2VIZWlnaHQpKydweCc7XHJcbiAgICAgIH0gZWxzZSBpZiAoc3Rvcm0uZmxha2VCb3R0b20pIHtcclxuICAgICAgICBzLm8uc3R5bGUudG9wID0gc3Rvcm0uZmxha2VCb3R0b20rJ3B4JztcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBzLm8uc3R5bGUuZGlzcGxheSA9ICdub25lJztcclxuICAgICAgICBzLm8uc3R5bGUuYm90dG9tID0gJzAlJztcclxuICAgICAgICBzLm8uc3R5bGUucG9zaXRpb24gPSAnZml4ZWQnO1xyXG4gICAgICAgIHMuby5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICB0aGlzLnZDaGVjayA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICBpZiAocy52WD49MCAmJiBzLnZYPDAuMikge1xyXG4gICAgICAgIHMudlggPSAwLjI7XHJcbiAgICAgIH0gZWxzZSBpZiAocy52WDwwICYmIHMudlg+LTAuMikge1xyXG4gICAgICAgIHMudlggPSAtMC4yO1xyXG4gICAgICB9XHJcbiAgICAgIGlmIChzLnZZPj0wICYmIHMudlk8MC4yKSB7XHJcbiAgICAgICAgcy52WSA9IDAuMjtcclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICB0aGlzLm1vdmUgPSBmdW5jdGlvbigpIHtcclxuICAgICAgdmFyIHZYID0gcy52WCp3aW5kT2Zmc2V0LCB5RGlmZjtcclxuICAgICAgcy54ICs9IHZYO1xyXG4gICAgICBzLnkgKz0gKHMudlkqcy52QW1wKTtcclxuICAgICAgaWYgKHMueCA+PSBzY3JlZW5YIHx8IHNjcmVlblgtcy54IDwgc3Rvcm0uZmxha2VXaWR0aCkgeyAvLyBYLWF4aXMgc2Nyb2xsIGNoZWNrXHJcbiAgICAgICAgcy54ID0gMDtcclxuICAgICAgfSBlbHNlIGlmICh2WCA8IDAgJiYgcy54LXN0b3JtLmZsYWtlTGVmdE9mZnNldCA8IC1zdG9ybS5mbGFrZVdpZHRoKSB7XHJcbiAgICAgICAgcy54ID0gc2NyZWVuWC1zdG9ybS5mbGFrZVdpZHRoLTE7IC8vIGZsYWtlV2lkdGg7XHJcbiAgICAgIH1cclxuICAgICAgcy5yZWZyZXNoKCk7XHJcbiAgICAgIHlEaWZmID0gc2NyZWVuWStzY3JvbGxZLXMueStzdG9ybS5mbGFrZUhlaWdodDtcclxuICAgICAgaWYgKHlEaWZmPHN0b3JtLmZsYWtlSGVpZ2h0KSB7XHJcbiAgICAgICAgcy5hY3RpdmUgPSAwO1xyXG4gICAgICAgIGlmIChzdG9ybS5zbm93U3RpY2spIHtcclxuICAgICAgICAgIHMuc3RpY2soKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgcy5yZWN5Y2xlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGlmIChzdG9ybS51c2VNZWx0RWZmZWN0ICYmIHMuYWN0aXZlICYmIHMudHlwZSA8IDMgJiYgIXMubWVsdGluZyAmJiBNYXRoLnJhbmRvbSgpPjAuOTk4KSB7XHJcbiAgICAgICAgICAvLyB+MS8xMDAwIGNoYW5jZSBvZiBtZWx0aW5nIG1pZC1haXIsIHdpdGggZWFjaCBmcmFtZVxyXG4gICAgICAgICAgcy5tZWx0aW5nID0gdHJ1ZTtcclxuICAgICAgICAgIHMubWVsdCgpO1xyXG4gICAgICAgICAgLy8gb25seSBpbmNyZW1lbnRhbGx5IG1lbHQgb25lIGZyYW1lXHJcbiAgICAgICAgICAvLyBzLm1lbHRpbmcgPSBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHN0b3JtLnVzZVR3aW5rbGVFZmZlY3QpIHtcclxuICAgICAgICAgIGlmIChzLnR3aW5rbGVGcmFtZSA8IDApIHtcclxuICAgICAgICAgICAgaWYgKE1hdGgucmFuZG9tKCkgPiAwLjk3KSB7XHJcbiAgICAgICAgICAgICAgcy50d2lua2xlRnJhbWUgPSBwYXJzZUludChNYXRoLnJhbmRvbSgpICogOCwgMTApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBzLnR3aW5rbGVGcmFtZS0tO1xyXG4gICAgICAgICAgICBpZiAoIW9wYWNpdHlTdXBwb3J0ZWQpIHtcclxuICAgICAgICAgICAgICBzLm8uc3R5bGUudmlzaWJpbGl0eSA9IChzLnR3aW5rbGVGcmFtZSAmJiBzLnR3aW5rbGVGcmFtZSAlIDIgPT09IDAgPyAnaGlkZGVuJyA6ICd2aXNpYmxlJyk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgcy5vLnN0eWxlLm9wYWNpdHkgPSAocy50d2lua2xlRnJhbWUgJiYgcy50d2lua2xlRnJhbWUgJSAyID09PSAwID8gMCA6IDEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIHRoaXMuYW5pbWF0ZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAvLyBtYWluIGFuaW1hdGlvbiBsb29wXHJcbiAgICAgIC8vIG1vdmUsIGNoZWNrIHN0YXR1cywgZGllIGV0Yy5cclxuICAgICAgcy5tb3ZlKCk7XHJcbiAgICB9O1xyXG5cclxuICAgIHRoaXMuc2V0VmVsb2NpdGllcyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICBzLnZYID0gdlJuZFgrcm5kKHN0b3JtLnZNYXhYKjAuMTIsMC4xKTtcclxuICAgICAgcy52WSA9IHZSbmRZK3JuZChzdG9ybS52TWF4WSowLjEyLDAuMSk7XHJcbiAgICB9O1xyXG5cclxuICAgIHRoaXMuc2V0T3BhY2l0eSA9IGZ1bmN0aW9uKG8sb3BhY2l0eSkge1xyXG4gICAgICBpZiAoIW9wYWNpdHlTdXBwb3J0ZWQpIHtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgIH1cclxuICAgICAgby5zdHlsZS5vcGFjaXR5ID0gb3BhY2l0eTtcclxuICAgIH07XHJcblxyXG4gICAgdGhpcy5tZWx0ID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgIGlmICghc3Rvcm0udXNlTWVsdEVmZmVjdCB8fCAhcy5tZWx0aW5nKSB7XHJcbiAgICAgICAgcy5yZWN5Y2xlKCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaWYgKHMubWVsdEZyYW1lIDwgcy5tZWx0RnJhbWVDb3VudCkge1xyXG4gICAgICAgICAgcy5zZXRPcGFjaXR5KHMubyxzLm1lbHRGcmFtZXNbcy5tZWx0RnJhbWVdKTtcclxuICAgICAgICAgIHMuby5zdHlsZS5mb250U2l6ZSA9IHMuZm9udFNpemUtKHMuZm9udFNpemUqKHMubWVsdEZyYW1lL3MubWVsdEZyYW1lQ291bnQpKSsncHgnO1xyXG4gICAgICAgICAgcy5vLnN0eWxlLmxpbmVIZWlnaHQgPSBzdG9ybS5mbGFrZUhlaWdodCsyKyhzdG9ybS5mbGFrZUhlaWdodCowLjc1KihzLm1lbHRGcmFtZS9zLm1lbHRGcmFtZUNvdW50KSkrJ3B4JztcclxuICAgICAgICAgIHMubWVsdEZyYW1lKys7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHMucmVjeWNsZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICB0aGlzLnJlY3ljbGUgPSBmdW5jdGlvbigpIHtcclxuICAgICAgcy5vLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XHJcbiAgICAgIHMuby5zdHlsZS5wb3NpdGlvbiA9IChmaXhlZEZvckV2ZXJ5dGhpbmc/J2ZpeGVkJzonYWJzb2x1dGUnKTtcclxuICAgICAgcy5vLnN0eWxlLmJvdHRvbSA9ICdhdXRvJztcclxuICAgICAgcy5zZXRWZWxvY2l0aWVzKCk7XHJcbiAgICAgIHMudkNoZWNrKCk7XHJcbiAgICAgIHMubWVsdEZyYW1lID0gMDtcclxuICAgICAgcy5tZWx0aW5nID0gZmFsc2U7XHJcbiAgICAgIHMuc2V0T3BhY2l0eShzLm8sMSk7XHJcbiAgICAgIHMuby5zdHlsZS5wYWRkaW5nID0gJzBweCc7XHJcbiAgICAgIHMuby5zdHlsZS5tYXJnaW4gPSAnMHB4JztcclxuICAgICAgcy5vLnN0eWxlLmZvbnRTaXplID0gcy5mb250U2l6ZSsncHgnO1xyXG4gICAgICBzLm8uc3R5bGUubGluZUhlaWdodCA9IChzdG9ybS5mbGFrZUhlaWdodCsyKSsncHgnO1xyXG4gICAgICBzLm8uc3R5bGUudGV4dEFsaWduID0gJ2NlbnRlcic7XHJcbiAgICAgIHMuby5zdHlsZS52ZXJ0aWNhbEFsaWduID0gJ2Jhc2VsaW5lJztcclxuICAgICAgcy54ID0gcGFyc2VJbnQocm5kKHNjcmVlblgtc3Rvcm0uZmxha2VXaWR0aC0yMCksMTApO1xyXG4gICAgICBzLnkgPSBwYXJzZUludChybmQoc2NyZWVuWSkqLTEsMTApLXN0b3JtLmZsYWtlSGVpZ2h0O1xyXG4gICAgICBzLnJlZnJlc2goKTtcclxuICAgICAgcy5vLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xyXG4gICAgICBzLmFjdGl2ZSA9IDE7XHJcbiAgICB9O1xyXG5cclxuICAgIHRoaXMucmVjeWNsZSgpOyAvLyBzZXQgdXAgeC95IGNvb3JkcyBldGMuXHJcbiAgICB0aGlzLnJlZnJlc2goKTtcclxuXHJcbiAgfTtcclxuXHJcbiAgdGhpcy5zbm93ID0gZnVuY3Rpb24oKSB7XHJcbiAgICB2YXIgYWN0aXZlID0gMCwgZmxha2UgPSBudWxsLCBpLCBqO1xyXG4gICAgZm9yIChpPTAsIGo9c3Rvcm0uZmxha2VzLmxlbmd0aDsgaTxqOyBpKyspIHtcclxuICAgICAgaWYgKHN0b3JtLmZsYWtlc1tpXS5hY3RpdmUgPT09IDEpIHtcclxuICAgICAgICBzdG9ybS5mbGFrZXNbaV0ubW92ZSgpO1xyXG4gICAgICAgIGFjdGl2ZSsrO1xyXG4gICAgICB9XHJcbiAgICAgIGlmIChzdG9ybS5mbGFrZXNbaV0ubWVsdGluZykge1xyXG4gICAgICAgIHN0b3JtLmZsYWtlc1tpXS5tZWx0KCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGlmIChhY3RpdmU8c3Rvcm0uZmxha2VzTWF4QWN0aXZlKSB7XHJcbiAgICAgIGZsYWtlID0gc3Rvcm0uZmxha2VzW3BhcnNlSW50KHJuZChzdG9ybS5mbGFrZXMubGVuZ3RoKSwxMCldO1xyXG4gICAgICBpZiAoZmxha2UuYWN0aXZlID09PSAwKSB7XHJcbiAgICAgICAgZmxha2UubWVsdGluZyA9IHRydWU7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGlmIChzdG9ybS50aW1lcikge1xyXG4gICAgICBmZWF0dXJlcy5nZXRBbmltYXRpb25GcmFtZShzdG9ybS5zbm93KTtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICB0aGlzLm1vdXNlTW92ZSA9IGZ1bmN0aW9uKGUpIHtcclxuICAgIGlmICghc3Rvcm0uZm9sbG93TW91c2UpIHtcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcbiAgICB2YXIgeCA9IHBhcnNlSW50KGUuY2xpZW50WCwxMCk7XHJcbiAgICBpZiAoeDxzY3JlZW5YMikge1xyXG4gICAgICB3aW5kT2Zmc2V0ID0gLXdpbmRNdWx0aXBsaWVyKyh4L3NjcmVlblgyKndpbmRNdWx0aXBsaWVyKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHggLT0gc2NyZWVuWDI7XHJcbiAgICAgIHdpbmRPZmZzZXQgPSAoeC9zY3JlZW5YMikqd2luZE11bHRpcGxpZXI7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgdGhpcy5jcmVhdGVTbm93ID0gZnVuY3Rpb24obGltaXQsYWxsb3dJbmFjdGl2ZSkge1xyXG4gICAgdmFyIGk7XHJcbiAgICBmb3IgKGk9MDsgaTxsaW1pdDsgaSsrKSB7XHJcbiAgICAgIHN0b3JtLmZsYWtlc1tzdG9ybS5mbGFrZXMubGVuZ3RoXSA9IG5ldyBzdG9ybS5Tbm93Rmxha2UocGFyc2VJbnQocm5kKGZsYWtlVHlwZXMpLDEwKSk7XHJcbiAgICAgIGlmIChhbGxvd0luYWN0aXZlIHx8IGk+c3Rvcm0uZmxha2VzTWF4QWN0aXZlKSB7XHJcbiAgICAgICAgc3Rvcm0uZmxha2VzW3N0b3JtLmZsYWtlcy5sZW5ndGgtMV0uYWN0aXZlID0gLTE7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHN0b3JtLnRhcmdldEVsZW1lbnQuYXBwZW5kQ2hpbGQoZG9jRnJhZyk7XHJcbiAgfTtcclxuXHJcbiAgdGhpcy50aW1lckluaXQgPSBmdW5jdGlvbigpIHtcclxuICAgIHN0b3JtLnRpbWVyID0gdHJ1ZTtcclxuICAgIHN0b3JtLnNub3coKTtcclxuICB9O1xyXG5cclxuICB0aGlzLmluaXQgPSBmdW5jdGlvbigpIHtcclxuICAgIHZhciBpO1xyXG4gICAgZm9yIChpPTA7IGk8c3Rvcm0ubWVsdEZyYW1lQ291bnQ7IGkrKykge1xyXG4gICAgICBzdG9ybS5tZWx0RnJhbWVzLnB1c2goMS0oaS9zdG9ybS5tZWx0RnJhbWVDb3VudCkpO1xyXG4gICAgfVxyXG4gICAgc3Rvcm0ucmFuZG9taXplV2luZCgpO1xyXG4gICAgc3Rvcm0uY3JlYXRlU25vdyhzdG9ybS5mbGFrZXNNYXgpOyAvLyBjcmVhdGUgaW5pdGlhbCBiYXRjaFxyXG4gICAgc3Rvcm0uZXZlbnRzLmFkZCh3aW5kb3csJ3Jlc2l6ZScsc3Rvcm0ucmVzaXplSGFuZGxlcik7XHJcbiAgICBzdG9ybS5ldmVudHMuYWRkKHdpbmRvdywnc2Nyb2xsJyxzdG9ybS5zY3JvbGxIYW5kbGVyKTtcclxuICAgIGlmIChzdG9ybS5mcmVlemVPbkJsdXIpIHtcclxuICAgICAgaWYgKGlzSUUpIHtcclxuICAgICAgICBzdG9ybS5ldmVudHMuYWRkKGRvY3VtZW50LCdmb2N1c291dCcsc3Rvcm0uZnJlZXplKTtcclxuICAgICAgICBzdG9ybS5ldmVudHMuYWRkKGRvY3VtZW50LCdmb2N1c2luJyxzdG9ybS5yZXN1bWUpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHN0b3JtLmV2ZW50cy5hZGQod2luZG93LCdibHVyJyxzdG9ybS5mcmVlemUpO1xyXG4gICAgICAgIHN0b3JtLmV2ZW50cy5hZGQod2luZG93LCdmb2N1cycsc3Rvcm0ucmVzdW1lKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgc3Rvcm0ucmVzaXplSGFuZGxlcigpO1xyXG4gICAgc3Rvcm0uc2Nyb2xsSGFuZGxlcigpO1xyXG4gICAgaWYgKHN0b3JtLmZvbGxvd01vdXNlKSB7XHJcbiAgICAgIHN0b3JtLmV2ZW50cy5hZGQoaXNJRT9kb2N1bWVudDp3aW5kb3csJ21vdXNlbW92ZScsc3Rvcm0ubW91c2VNb3ZlKTtcclxuICAgIH1cclxuICAgIHN0b3JtLmFuaW1hdGlvbkludGVydmFsID0gTWF0aC5tYXgoMjAsc3Rvcm0uYW5pbWF0aW9uSW50ZXJ2YWwpO1xyXG4gICAgc3Rvcm0udGltZXJJbml0KCk7XHJcbiAgfTtcclxuXHJcbiAgdGhpcy5zdGFydCA9IGZ1bmN0aW9uKGJGcm9tT25Mb2FkKSB7XHJcbiAgICBpZiAoIWRpZEluaXQpIHtcclxuICAgICAgZGlkSW5pdCA9IHRydWU7XHJcbiAgICB9IGVsc2UgaWYgKGJGcm9tT25Mb2FkKSB7XHJcbiAgICAgIC8vIGFscmVhZHkgbG9hZGVkIGFuZCBydW5uaW5nXHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG4gICAgaWYgKHR5cGVvZiBzdG9ybS50YXJnZXRFbGVtZW50ID09PSAnc3RyaW5nJykge1xyXG4gICAgICB2YXIgdGFyZ2V0SUQgPSBzdG9ybS50YXJnZXRFbGVtZW50O1xyXG4gICAgICBzdG9ybS50YXJnZXRFbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGFyZ2V0SUQpO1xyXG4gICAgICBpZiAoIXN0b3JtLnRhcmdldEVsZW1lbnQpIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1Nub3dzdG9ybTogVW5hYmxlIHRvIGdldCB0YXJnZXRFbGVtZW50IFwiJyt0YXJnZXRJRCsnXCInKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgaWYgKCFzdG9ybS50YXJnZXRFbGVtZW50KSB7XHJcbiAgICAgIHN0b3JtLnRhcmdldEVsZW1lbnQgPSAoZG9jdW1lbnQuYm9keSB8fCBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQpO1xyXG4gICAgfVxyXG4gICAgaWYgKHN0b3JtLnRhcmdldEVsZW1lbnQgIT09IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCAmJiBzdG9ybS50YXJnZXRFbGVtZW50ICE9PSBkb2N1bWVudC5ib2R5KSB7XHJcbiAgICAgIC8vIHJlLW1hcCBoYW5kbGVyIHRvIGdldCBlbGVtZW50IGluc3RlYWQgb2Ygc2NyZWVuIGRpbWVuc2lvbnNcclxuICAgICAgc3Rvcm0ucmVzaXplSGFuZGxlciA9IHN0b3JtLnJlc2l6ZUhhbmRsZXJBbHQ7XHJcbiAgICAgIC8vYW5kIGZvcmNlLWVuYWJsZSBwaXhlbCBwb3NpdGlvbmluZ1xyXG4gICAgICBzdG9ybS51c2VQaXhlbFBvc2l0aW9uID0gdHJ1ZTtcclxuICAgIH1cclxuICAgIHN0b3JtLnJlc2l6ZUhhbmRsZXIoKTsgLy8gZ2V0IGJvdW5kaW5nIGJveCBlbGVtZW50c1xyXG4gICAgc3Rvcm0udXNlUG9zaXRpb25GaXhlZCA9IChzdG9ybS51c2VQb3NpdGlvbkZpeGVkICYmICFub0ZpeGVkICYmICFzdG9ybS5mbGFrZUJvdHRvbSk7IC8vIHdoZXRoZXIgb3Igbm90IHBvc2l0aW9uOmZpeGVkIGlzIHRvIGJlIHVzZWRcclxuICAgIGlmICh3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSkge1xyXG4gICAgICAvLyBhdHRlbXB0IHRvIGRldGVybWluZSBpZiBib2R5IG9yIHVzZXItc3BlY2lmaWVkIHNub3cgcGFyZW50IGVsZW1lbnQgaXMgcmVsYXRsaXZlbHktcG9zaXRpb25lZC5cclxuICAgICAgdHJ5IHtcclxuICAgICAgICB0YXJnZXRFbGVtZW50SXNSZWxhdGl2ZSA9ICh3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShzdG9ybS50YXJnZXRFbGVtZW50LCBudWxsKS5nZXRQcm9wZXJ0eVZhbHVlKCdwb3NpdGlvbicpID09PSAncmVsYXRpdmUnKTtcclxuICAgICAgfSBjYXRjaChlKSB7XHJcbiAgICAgICAgLy8gb2ggd2VsbFxyXG4gICAgICAgIHRhcmdldEVsZW1lbnRJc1JlbGF0aXZlID0gZmFsc2U7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGZpeGVkRm9yRXZlcnl0aGluZyA9IHN0b3JtLnVzZVBvc2l0aW9uRml4ZWQ7XHJcbiAgICBpZiAoc2NyZWVuWCAmJiBzY3JlZW5ZICYmICFzdG9ybS5kaXNhYmxlZCkge1xyXG4gICAgICBzdG9ybS5pbml0KCk7XHJcbiAgICAgIHN0b3JtLmFjdGl2ZSA9IHRydWU7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgZnVuY3Rpb24gZG9EZWxheWVkU3RhcnQoKSB7XHJcbiAgICB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuICAgICAgc3Rvcm0uc3RhcnQodHJ1ZSk7XHJcbiAgICB9LCAyMCk7XHJcbiAgICAvLyBldmVudCBjbGVhbnVwXHJcbiAgICBzdG9ybS5ldmVudHMucmVtb3ZlKGlzSUU/ZG9jdW1lbnQ6d2luZG93LCdtb3VzZW1vdmUnLGRvRGVsYXllZFN0YXJ0KTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGRvU3RhcnQoKSB7XHJcbiAgICBpZiAoIXN0b3JtLmV4Y2x1ZGVNb2JpbGUgfHwgIWlzTW9iaWxlKSB7XHJcbiAgICAgIGRvRGVsYXllZFN0YXJ0KCk7XHJcbiAgICB9XHJcbiAgICAvLyBldmVudCBjbGVhbnVwXHJcbiAgICBzdG9ybS5ldmVudHMucmVtb3ZlKHdpbmRvdywgJ2xvYWQnLCBkb1N0YXJ0KTtcclxuICB9XHJcblxyXG4gIC8vIGhvb2tzIGZvciBzdGFydGluZyB0aGUgc25vd1xyXG4gIGlmIChzdG9ybS5hdXRvU3RhcnQpIHtcclxuICAgIHN0b3JtLmV2ZW50cy5hZGQod2luZG93LCAnbG9hZCcsIGRvU3RhcnQsIGZhbHNlKTtcclxuICB9XHJcblxyXG4gIHJldHVybiB0aGlzO1xyXG5cclxufSh3aW5kb3csIGRvY3VtZW50KSk7XHJcbiJdfQ==

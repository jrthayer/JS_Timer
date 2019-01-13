var tmrHrDisplay = document.getElementById("tmrHrs");
var tmrMinDisplay = document.getElementById("tmrMins");
var tmrSecDisplay = document.getElementById("tmrSecs");

var adjustRepeat = null;

function clickOrHold(funcName, display, arg1){
    funcName(display, arg1);
    tmrCreateInterval(funcName, display, arg1);
}

function tmrCreateInterval(funcName, display, arg1){
    adjustRepeat = setInterval(function(){funcName(display, arg1)}, 125)
}

function release(){
    clearInterval(adjustRepeat);
}

function tmrAdd(display, max){
    var value = Number(display.textContent);
    value += 1;
    if(value < 10){
        value = "0" + value;
    }
    else if(value > max){
        value = "00";
    }
    display.textContent = value;
}

function tmrSub(display, max){
    var value = Number(display.textContent);
    value -= 1;
    if(value < 0){
        value = max;
    }
    else if(value < 10){
        value = "0" + value; 
    }
    
    display.textContent = value;
}

document.getElementById("tmrAddHr").addEventListener("mousedown", function(){clickOrHold(tmrAdd, tmrHrDisplay, 24)});
document.getElementById("tmrSubHr").addEventListener("mousedown", function(){clickOrHold(tmrSub, tmrHrDisplay, 24)});
document.getElementById("tmrAddMin").addEventListener("mousedown", function(){clickOrHold(tmrAdd, tmrMinDisplay, 60)});
document.getElementById("tmrSubMin").addEventListener("mousedown", function(){clickOrHold(tmrSub, tmrMinDisplay, 60)});
document.getElementById("tmrAddSec").addEventListener("mousedown", function(){clickOrHold(tmrAdd, tmrSecDisplay, 60)});
document.getElementById("tmrSubSec").addEventListener("mousedown", function(){clickOrHold(tmrSub, tmrSecDisplay, 60)});
document.addEventListener("mouseup", function(){release();});
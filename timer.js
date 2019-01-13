var tmrHrDisplay = document.getElementById("tmrHrs");
var tmrMinDisplay = document.getElementById("tmrMins");
var tmrSecDisplay = document.getElementById("tmrSecs");
var tmrAudio = document.getElementById("tmrNoise");
var tmrStartStopBtn = document.getElementById("tmrState");
var tmrResetBtn = document.getElementById("tmrReset");
var tmrOptions = document.getElementById("tmrOptions");
var tmrAlarmOffBtn = document.getElementById("tmrAlarmOff");
var tmrAddOptions = document.getElementById("tmrAddOptions");
var tmrSubOptions = document.getElementById("tmrSubOptions");

var adjustRepeat = null;
var tmrLoop;
var tmrState = false;

function timer()
{
    if(tmrState){
        var sec = Number(tmrSecDisplay.textContent) - 1;
        if(sec > 0){
            tmrSecDisplay.textContent = tmrSingleConvert(sec);
        }
        else{
            var min = Number(tmrMinDisplay.textContent);
            var hr =  Number(tmrHrDisplay.textContent);
            if(min === 0 && hr === 0){
                tmrSecDisplay.textContent = "00";
                tmrFinished();
            }
            else{
                if(min != 0){
                    min -= 1;
                    tmrMinDisplay.textContent = tmrSingleConvert(min);
                    tmrSecDisplay.textContent = 59;
                }
                else{
                    hr -= 1;
                    tmrHrDisplay.textContent = tmrSingleConvert(hr);
                    tmrMinDisplay.textContent = 59;
                    tmrSecDisplay.textContent = 59;
                }
            }
        }
        tmrLoop = setTimeout(timer, 1000);
    }
    else{
        clearTimeout(tmrLoop);
    }   
}

function tmrSingleConvert(number){
    if(number < 10){
        number = "0" + number;
    }
    return number;
}

function tmrFinished(){
    tmrReset();
    tmrAudio.play();
    tmrAlarmOff.classList.remove("remove");
    tmrAlarmOff.classList.add("show");
    tmrOptions.classList.remove("show");
    tmrOptions.classList.add("remove");
}

function tmrAlarmReset(){
    tmrAudio.pause();
    tmrAudio.currentTime = 0;
    tmrToggle();

    tmrAlarmOff.classList.remove("show");
    tmrAlarmOff.classList.add("remove");
    tmrOptions.classList.remove("remove");
    tmrOptions.classList.add("show");
}

function tmrToggle(){
    tmrState = !tmrState;
    if(tmrState){
        tmrAddOptions.classList.add("hide");
        tmrSubOptions.classList.add("hide");
        tmrStartStopBtn.textContent = "Stop";
    }
    else{
        tmrAddOptions.classList.remove("hide");
        tmrSubOptions.classList.remove("hide");
        tmrStartStopBtn.textContent = "Start";
    }
    timer();

}

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

function tmrReset(){
    if(!tmrState){
        tmrHrDisplay.textContent = "00";
        tmrMinDisplay.textContent = "00";
        tmrSecDisplay.textContent = "00"; 
    }
}

document.getElementById("tmrAddHr").addEventListener("mousedown", function(){clickOrHold(tmrAdd, tmrHrDisplay, 24)});
document.getElementById("tmrSubHr").addEventListener("mousedown", function(){clickOrHold(tmrSub, tmrHrDisplay, 24)});
document.getElementById("tmrAddMin").addEventListener("mousedown", function(){clickOrHold(tmrAdd, tmrMinDisplay, 59)});
document.getElementById("tmrSubMin").addEventListener("mousedown", function(){clickOrHold(tmrSub, tmrMinDisplay, 59)});
document.getElementById("tmrAddSec").addEventListener("mousedown", function(){clickOrHold(tmrAdd, tmrSecDisplay, 59)});
document.getElementById("tmrSubSec").addEventListener("mousedown", function(){clickOrHold(tmrSub, tmrSecDisplay, 59)});

document.getElementById("tmrState").addEventListener("click", tmrToggle);
tmrResetBtn.addEventListener("click", tmrReset);
tmrAlarmOffBtn.addEventListener("click", tmrAlarmReset);
document.addEventListener("mouseup", function(){release();});
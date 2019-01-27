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
var tmrRunning = false;
var tmrAmount = 0;
var tmrMaxs = [1000, 60, 60, 24];
var tmrTimes = [0,0,0,0];

//used when to start or continue timer
function tmrStart(){
    tmrRunning = true;
    var curTime = Date.now();
    tmrConvertToMS();
    tmrRun(curTime);
}

//used to stop timer
function tmrStop(){
    tmrRunning = false;
}

function tmrStartOrStop(){

    if(tmrRunning){
        tmrStartStopBtn.textContent = "Start";
        tmrAddOptions.classList.remove("hide");
        tmrSubOptions.classList.remove("hide");
        tmrStop();
    }
    else{
        tmrStartStopBtn.textContent = "Stop";
        tmrAddOptions.classList.add("hide");
        tmrSubOptions.classList.add("hide");
        tmrStart();
    }
}

function tmrRun(prevTime)
{
    if(tmrRunning){
        var curTime = Date.now();
        tmrAmount -= curTime - prevTime;
        tmrConvertFromMS(tmrAmount);
        tmrHrDisplay.textContent = tmrSingleDigitConvert(tmrTimes[3]);
        tmrMinDisplay.textContent = tmrSingleDigitConvert(tmrTimes[2]);
        tmrSecDisplay.textContent = tmrSingleDigitConvert(tmrTimes[1]);

        if(tmrAmount <= 0){
            tmrFinished();
        }
        else{
            tmrLoop = setTimeout(function(){tmrRun(curTime);}, 100);
        }
    }
}

function tmrReset(){
    //reset Values
    clearTimeout(tmrLoop);
    tmrHrDisplay.textContent = "00";
    tmrMinDisplay.textContent = "00";
    tmrSecDisplay.textContent = "00";
    tmrRunning = false;
    tmrAmount = 0;
    tmrTimes = [0,0,0,0];
    tmrStartStopBtn.textContent = "Start";
    tmrAddOptions.classList.remove("hide");
    tmrSubOptions.classList.remove("hide");
}

function tmrFinished(){
    tmrReset();
    
    //hide timer buttons
    tmrAlarmOff.classList.remove("remove");
    tmrAlarmOff.classList.add("show");
    tmrOptions.classList.remove("show");
    tmrOptions.classList.add("remove");

    //play audio
    tmrAudio.play();
}

function tmrAlarmReset(){
    //stop and reset audio clip
    tmrAudio.pause();
    tmrAudio.currentTime = 0;

    //remove off btn and add timer btns
    tmrAlarmOff.classList.remove("show");
    tmrAlarmOff.classList.add("remove");
    tmrOptions.classList.remove("remove");
    tmrOptions.classList.add("show");

    //show tmr add/sub
    tmrAddOptions.classList.remove("hide");
    tmrSubOptions.classList.remove("hide");
}

//Conversion functions
function tmrConvertToMS(){
    tmrAmount = Number(tmrHrDisplay.textContent)*60*60*1000;
    tmrAmount += Number(tmrMinDisplay.textContent)*60*1000;
    tmrAmount += Number(tmrSecDisplay.textContent)*1000;
}

function tmrConvertFromMS(msAmnt){
    var unconverted = msAmnt;
    for(var i = 0; i<tmrMaxs.length; i++){
        tmrTimes[i] = unconverted%tmrMaxs[i];
        unconverted = Math.floor(unconverted/tmrMaxs[i]);
    }
}

function tmrSingleDigitConvert(number){
    if(number < 10){
        number = "0" + number;
    }
    return number;
}

//click or hold functions
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

//event listeners
document.getElementById("tmrAddHr").addEventListener("mousedown", function(){clickOrHold(tmrAdd, tmrHrDisplay, 24)});
document.getElementById("tmrSubHr").addEventListener("mousedown", function(){clickOrHold(tmrSub, tmrHrDisplay, 24)});
document.getElementById("tmrAddMin").addEventListener("mousedown", function(){clickOrHold(tmrAdd, tmrMinDisplay, 59)});
document.getElementById("tmrSubMin").addEventListener("mousedown", function(){clickOrHold(tmrSub, tmrMinDisplay, 59)});
document.getElementById("tmrAddSec").addEventListener("mousedown", function(){clickOrHold(tmrAdd, tmrSecDisplay, 59)});
document.getElementById("tmrSubSec").addEventListener("mousedown", function(){clickOrHold(tmrSub, tmrSecDisplay, 59)});

document.getElementById("tmrState").addEventListener("click", tmrStartOrStop);
tmrResetBtn.addEventListener("click", tmrReset);
tmrAlarmOffBtn.addEventListener("click", tmrAlarmReset);
document.addEventListener("mouseup", function(){release();});
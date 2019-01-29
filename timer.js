class Timer{
    constructor(timer){
        this.tmrHrDisplay = document.getElementById("tmrHrs");
        this.tmrMinDisplay = document.getElementById("tmrMins");
        this.tmrSecDisplay = document.getElementById("tmrSecs");
        this.tmrAudio = document.getElementById("tmrNoise");
        this.tmrStartStopBtn = document.getElementById("tmrState");
        this.tmrResetBtn = document.getElementById("tmrReset");
        this.tmrOptions = document.getElementById("tmrOptions");
        this.tmrAlarmOffBtn = document.getElementById("tmrAlarmOff");
        this.tmrAddOptions = document.getElementById("tmrAddOptions");
        this.tmrSubOptions = document.getElementById("tmrSubOptions");

        this.adjustRepeat = null;
        this.tmrLoop;
        this.tmrRunning = false;
        this.tmrAmount = 0;
        this.tmrMaxs = [1000, 60, 60, 24];
        this.tmrTimes = [0,0,0,0];

        //event listeners
        document.getElementById("tmrAddHr").addEventListener("mousedown", () => this.clickOrHold(this.tmrAdd, this.tmrHrDisplay, 24));
        document.getElementById("tmrSubHr").addEventListener("mousedown", () => this.clickOrHold(this.tmrSub, this.tmrHrDisplay, 24));
        document.getElementById("tmrAddMin").addEventListener("mousedown", () => this.clickOrHold(this.tmrAdd, this.tmrMinDisplay, 59));
        document.getElementById("tmrSubMin").addEventListener("mousedown", () => this.clickOrHold(this.tmrSub, this.tmrMinDisplay, 59));
        document.getElementById("tmrAddSec").addEventListener("mousedown", () => this.clickOrHold(this.tmrAdd, this.tmrSecDisplay, 59));
        document.getElementById("tmrSubSec").addEventListener("mousedown", () => this.clickOrHold(this.tmrSub, this.tmrSecDisplay, 59));
        this.tmrStartStopBtn.addEventListener("click", () => this.tmrStartOrStop());
        this.tmrResetBtn.addEventListener("click", () => this.tmrReset());
        this.tmrAlarmOffBtn.addEventListener("click", () => this.tmrAlarmReset());
        document.addEventListener("mouseup", () => this.release());
    }

    //used when to start or continue timer
    tmrStart(){
        this.tmrRunning = true;
        var curTime = Date.now();
        this.tmrConvertToMS();
        this.tmrRun(curTime);
    }

    //used to stop timer
    tmrStop(){
        this.tmrRunning = false;
    }

    tmrStartOrStop(){
        if(this.tmrRunning){
            this.tmrStartStopBtn.textContent = "Start";
            this.tmrAddOptions.classList.remove("hide");
            this.tmrSubOptions.classList.remove("hide");
            this.tmrStop();
        }
        else{
            this.tmrStartStopBtn.textContent = "Stop";
            this.tmrAddOptions.classList.add("hide");
            this.tmrSubOptions.classList.add("hide");
            this.tmrStart();
        }
    }

    tmrRun(prevTime)
    {
        if(this.tmrRunning){
            var curTime = Date.now();
            this.tmrAmount -= curTime - prevTime;
            this.tmrConvertFromMS(this.tmrAmount);
            this.tmrHrDisplay.textContent = this.tmrSingleDigitConvert(this.tmrTimes[3]);
            this.tmrMinDisplay.textContent = this.tmrSingleDigitConvert(this.tmrTimes[2]);
            this.tmrSecDisplay.textContent = this.tmrSingleDigitConvert(this.tmrTimes[1]);

            if(this.tmrAmount <= 0){
                this.tmrFinished();
            }
            else{
                this.tmrLoop = setTimeout(() => this.tmrRun(curTime), 100);
            }
        }
    }

    tmrReset(){
        if(this.tmrRunning === true){
            this.tmrAddOptions.classList.remove("hide");
            this.tmrSubOptions.classList.remove("hide"); 
        }

        //reset Values
        clearTimeout(this.tmrLoop);
        this.tmrHrDisplay.textContent = "00";
        this.tmrMinDisplay.textContent = "00";
        this.tmrSecDisplay.textContent = "00";
        this.tmrRunning = false;
        this.tmrAmount = 0;
        this.tmrTimes = [0,0,0,0];
        this.tmrStartStopBtn.textContent = "Start";
    }

    tmrFinished(){
        this.tmrRunning = false;
        this.tmrReset();
        
        //hide timer buttons
        this.tmrAlarmOffBtn.classList.remove("remove");
        this.tmrAlarmOffBtn.classList.add("show");
        this.tmrOptions.classList.remove("show");
        this.tmrOptions.classList.add("remove");

        //play audio
        this.tmrAudio.play();
    }

    tmrAlarmReset(){
        //stop and reset audio clip
        this.tmrAudio.pause();
        this.tmrAudio.currentTime = 0;

        //remove off btn and add timer btns
        tmrAlarmOff.classList.remove("show");
        tmrAlarmOff.classList.add("remove");
        tmrOptions.classList.remove("remove");
        tmrOptions.classList.add("show");

        //show tmr add/sub
        this.tmrAddOptions.classList.remove("hide");
        this.tmrSubOptions.classList.remove("hide");
    }

    //Conversion functions
    tmrConvertToMS(){
        this.tmrAmount = Number(this.tmrHrDisplay.textContent)*60*60*1000;
        this.tmrAmount += Number(this.tmrMinDisplay.textContent)*60*1000;
        this.tmrAmount += Number(this.tmrSecDisplay.textContent)*1000;
    }

    tmrConvertFromMS(msAmnt){
        var unconverted = msAmnt;
        for(var i = 0; i<this.tmrMaxs.length; i++){
            this.tmrTimes[i] = unconverted%this.tmrMaxs[i];
            unconverted = Math.floor(unconverted/this.tmrMaxs[i]);
        }
    }

    tmrSingleDigitConvert(number){
        if(number < 10){
            number = "0" + number;
        }
        return number;
    }

    //click or hold functions
    clickOrHold(funcName, display, arg1){
        funcName(display, arg1);
        this.tmrCreateInterval(funcName, display, arg1);
    }

    tmrCreateInterval(funcName, display, arg1){
        this.adjustRepeat = setInterval(function(){funcName(display, arg1)}, 125)
    }

    release(){
        clearInterval(this.adjustRepeat);
    }

    tmrAdd(display, max){
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

    tmrSub(display, max){
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
}

let test = new Timer(document.querySelector('.timer'));



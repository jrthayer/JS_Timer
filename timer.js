class Timer{
    constructor(timer){
        this.tmrHrDisplay = timer.getElementsByClassName("tmrHrs")[0];
        this.tmrMinDisplay = timer.getElementsByClassName("tmrMins")[0];
        this.tmrSecDisplay = timer.getElementsByClassName("tmrSecs")[0];
        this.tmrAudio = timer.getElementsByClassName("tmrNoise")[0];
        this.tmrStartStopBtn = timer.getElementsByClassName("tmrState")[0]
        this.tmrResetBtn = timer.getElementsByClassName("tmrReset")[0];
        this.tmrOptions = timer.getElementsByClassName("tmrOptions")[0];
        this.tmrAlarmOffBtn = timer.getElementsByClassName("tmrAlarmOff")[0];
        this.tmrAddOptions = timer.getElementsByClassName("tmrAddOptions")[0];
        this.tmrSubOptions = timer.getElementsByClassName("tmrSubOptions")[0];
        
        this.adjustRepeat = null;
        this.tmrLoop;
        this.tmrRunning = false;
        this.tmrAmount = 0;
        this.tmrMaxs = [1000, 60, 60, 24];
        this.tmrTimes = [0,0,0,0];

        //event listeners
        timer.getElementsByClassName("tmrAddHr")[0].addEventListener("mousedown", () => this.clickOrHold(this.tmrAdd, this.tmrHrDisplay, 24));
        timer.getElementsByClassName("tmrSubHr")[0].addEventListener("mousedown", () => this.clickOrHold(this.tmrSub, this.tmrHrDisplay, 24));
        timer.getElementsByClassName("tmrAddMin")[0].addEventListener("mousedown", () => this.clickOrHold(this.tmrAdd, this.tmrMinDisplay, 59));
        timer.getElementsByClassName("tmrSubMin")[0].addEventListener("mousedown", () => this.clickOrHold(this.tmrSub, this.tmrMinDisplay, 59));
        timer.getElementsByClassName("tmrAddSec")[0].addEventListener("mousedown", () => this.clickOrHold(this.tmrAdd, this.tmrSecDisplay, 59));
        timer.getElementsByClassName("tmrSubSec")[0].addEventListener("mousedown", () => this.clickOrHold(this.tmrSub, this.tmrSecDisplay, 59));
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
        this.tmrAlarmOffBtn.classList.remove("show");
        this.tmrAlarmOffBtn.classList.add("remove");
        this.tmrOptions.classList.remove("remove");
        this.tmrOptions.classList.add("show");

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

let test = new Timer(document.getElementsByClassName('timer')[0]);



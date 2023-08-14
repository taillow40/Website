import { writeData, readDatabase } from "../database.js";
class Canvas {
    constructor(className) {
        this.container = document.querySelector(className);
        this.element = document.createElement('canvas');
        this.height = this.container.getBoundingClientRect().height;
        this.width = this.container.getBoundingClientRect().width;
        this.element.width = this.width;
        this.element.height = this.height;

        

        this.element.className = 'game-canvas';
        this.container.appendChild(this.element);
        this.ctx = this.element.getContext('2d');

    };
    redraw = function (elements) { 
        this.ctx.clearRect(0, 0, this.width, this.height);
        for(let i = 0; i < elements.length; i += 1){
            elements[i].draw(this.ctx);
        }
    };

    hello = function(){
        console.log('hello');
    }
}

class Controller {
    canvas;
    elements;
    score;
    data;
    nextCircle;
    static launchGame() {
       
        this.canvas = new Canvas('.game-container');
        addClickListener(this.canvas);
        var tempThis = this
        this.homeScreen();
        setInterval(function () {tempThis.canvas.redraw(tempThis.elements)}, 100);
    }
    static homeScreen(){
        this.elements = [];
        this.elements.push(new StartGame(this.canvas.ctx, 200, 100));
    }
    static startGame() {
        this.elements = [];
        this.score = new Score();
        this.circle1 = new Circle(Math.min(this.canvas.width/2, this.canvas.height/2));
        this.nextCircle = new Circle(this.circle1.size * 0.95);
        this.elements.push(this.score);
        this.elements.push(this.circle1);
        this.elements.push(new Timer(20));
    }
    static checkClick(posX, posY){
        for(let i = 0; i < this.elements.length; i += 1) {
            if(this.elements[i].checkClick){
                this.elements[i].checkClick(posX, posY);
            }

        }
    }
    static circleClicked(clickedCircle) {
        this.elements = this.elements.filter(function(e) { return (e != clickedCircle && !(e instanceof PreCircle))});
        if(clickedCircle.size > 0) {
            this.elements.push(this.nextCircle);
            this.nextCircle = new Circle(this.nextCircle.size * 0.95);
            this.elements.push(new PreCircle(this.nextCircle.posX, this.nextCircle.posY));
        }
        this.score.addValue();
    }
    static endGame(){
        this.elements = this.elements.filter(function(e) {return !(e instanceof Circle || e instanceof PreCircle)})
        let isWinner = Controller.data && (!Controller.data[9] || Controller.score.value > Controller.data[9][1])
        this.elements.push(new EndGameText(isWinner));
        addToLeaderboardEntry(isWinner);
    }  
}

class Styles {
    static colorPrimary = getComputedStyle(document.querySelector(':root')).getPropertyValue('--color-primary');
    static colorSecondary = getComputedStyle(document.querySelector(':root')).getPropertyValue('--color-secondary');
    static colorRed = getComputedStyle(document.querySelector(':root')).getPropertyValue('--color-red');
    static colorQuinary = getComputedStyle(document.querySelector(':root')).getPropertyValue('--color-quinary');
    static textLarge = getComputedStyle(document.querySelector(':root')).getPropertyValue('--text-large');
    static textDefault = getComputedStyle(document.querySelector(':root')).getPropertyValue('--text-default');
}

class Timer {
    value
    interval 
    constructor(maxSeconds){
        this.time = maxSeconds;
        var tempThis = this;
        this.interval = setInterval(function () {tempThis.reduceTime()}, 1);
    }
    draw(ctx){
        ctx.fillStyle = "red";
        ctx.textAlign = "left";
        ctx.font = Styles.textLarge + " serif";
        ctx.fillText("" + this.time.toFixed(2),  ctx.canvas.clientWidth - 100, ctx.canvas.clientHeight - 10);
    }
    reduceTime() {
        if(this.time > 0) {
            this.time -= 0.01;
        } else {
            this.time = 0;
            clearInterval(this.interval);
            Controller.endGame();
        }   
    }
}

class EndGameText {
    winnerText;
    isWinner;
    constructor(isWinner) {
        this.isWinner = isWinner;
        if(isWinner){
            this.winnerText = "Highscore!"
        } else {
            this.winnerText = "No Highscore"
        }
    }
    draw(ctx) {
        ctx.fillStyle = Styles.colorPrimary;
        ctx.textAlign = 'center';
        ctx.font = Styles.textLarge + ' serif';
        ctx.fillText("Game Ended", ctx.canvas.clientWidth/2, ctx.canvas.clientHeight * 1/4);
        ctx.fillText(this.winnerText, ctx.canvas.clientWidth/2, ctx.canvas.clientHeight * 1/4 + 50);
        if(this.isWinner){
            ctx.fillText("Enter Name for Leaderboard", ctx.canvas.clientWidth/2, ctx.canvas.clientHeight * 1/4 + 150);
        }
    }
}

class StartGame {
    constructor(ctx, width, height){
        this.posX = ctx.canvas.clientWidth / 2;
        this.posY = ctx.canvas.clientHeight / 2;
        this.width = width;
        this.height = height;
    }
    draw(ctx) {
        ctx.fillStyle = Styles.colorQuinary;
        ctx.font = Styles.textLarge + " serif";
        ctx.textAlign = "center";
        ctx.fillRect(this.posX - this.width / 2, this.posY - this.height / 2, this.width, this.height);
        ctx.fillStyle = Styles.colorPrimary;
        ctx.fillText("Start Game", ctx.canvas.clientWidth / 2, ctx.canvas.clientHeight / 2);

    }
    checkClick(clickX, clickY) {
        if(clickX > this.posX - this.width / 2 && clickX < this.posX + this.width/2 &&
            clickY > this.posY - this.height /2 && clickY < this.posY + this.height/2) {
                Controller.startGame();
        }
    }
}
class Score {
    value
    constructor(){
        this.value = 0;
    }
    draw(ctx){
        ctx.fillStyle = Styles.colorPrimary;
        ctx.font = Styles.textLarge + " serif";
        ctx.fillText("Score: " + this.value,  ctx.canvas.clientWidth - 100, 50);
    }
    addValue(){
        this.value += 1;
    }
}

class Circle {
    size
    constructor(size) {
        this.size = size;
        this.setPos();
    }
    draw(ctx) {
        if(this.clicked){
            this.clicked = false;
            Controller.circleClicked(this);
        }
        ctx.fillStyle = Styles.colorPrimary;
        ctx.beginPath();
        ctx.arc(this.posX, this.posY, this.size, 0, 2 * Math.PI, false);
        ctx.fill();
    }

    checkClick(clickX, clickY){
        if(Math.sqrt(Math.pow(clickX - this.posX, 2) + Math.pow(clickY - this.posY, 2)) < this.size) {
            this.clicked = true;
        }
    }

    setPos() {
        this.posX = Math.random() * (Controller.canvas.width - this.size * 2) + this.size 
        this.posY = Math.random() * (Controller.canvas.height - this.size * 2) + this.size
    }
}

class PreCircle {
    posX;
    posY;
    constructor(posX, posY) {
        this.posX = posX;
        this.posY = posY;
    }
    draw(ctx) {
        ctx.fillStyle = Styles.colorRed;
        ctx.font = "64px serif";
        ctx.textAlign = 'center';
        ctx.fillText("X",  this.posX, this.posY);
    }
}
function startGame(){
   Controller.launchGame();
}
function addClickListener(){
    document.querySelector('.game-canvas').addEventListener('click', function(event) {
        Controller.checkClick(event.offsetX, event.offsetY);
    }, false);
}

function addToLeaderboard(name, score){
    writeData(`clickyclick/${name}`,score)
}

function addToLeaderboardEntry(isHighscore){
    let inputBox = document.createElement('div');
    inputBox.className = "leaderboard-entry-box";
    let height = 60;
    let width = 600;
    inputBox.style.height = height;
    inputBox.style.width = width;
    inputBox.style.top = -(Controller.canvas.height / 2 - height / 2) + "px";
    inputBox.style.left = Controller.canvas.width / 2 - width / 2 + "px";
    if(isHighscore){
        let input = document.createElement('input');
        let inputConfirm = document.createElement('button');
        let inputCancel = document.createElement('button');
        inputCancel.innerText = "Cancel"
        inputCancel.className = "leaderboard-entry-cancel"

        input.maxLength = 3;
        input.type = "text";
        input.className = "leaderboard-entry";
        inputBox.appendChild(input);
        inputConfirm.innerText = "Submit"
        inputConfirm.className = "leaderboard-entry-confirm"
        inputConfirm.onclick = () => {
            writeData("clickyclick/" + input.value, Controller.score.value);
            Controller.homeScreen();
            inputBox.remove();
        }
        inputCancel.onclick = () => {
            Controller.homeScreen();
            inputBox.remove();
        }
        inputBox.appendChild(inputConfirm);
        inputBox.appendChild(inputCancel);
    } else {
        let restartGameButton = document.createElement('button');
        restartGameButton.className = "leaderboard-restart-game";
        restartGameButton.innerText = "Restart"
        restartGameButton.onclick = () => {
            Controller.homeScreen();
            inputBox.remove();
        }
        inputBox.appendChild(restartGameButton);
    }
    
    Controller.canvas.container.appendChild(inputBox);
   
}

function buildLeaderboard(entries) {
    let table = document.querySelector('.leaderboard');
    if(!entries){
        return;
    }
    table.innerHTML = "";
    let i = 0; 
    for (const [key, value] of entries) {
        if(i < 10){
            leaderboardRow(key, value, table);
            i += 1;
        }
    }
    for(; i < 10; i += 1){
        leaderboardRow("--", "--", table);
    }
}

function leaderboardRow(name, val, table) {
    let row = document.createElement('tr');
    let cell1 = document.createElement('td');
    let cell2 = document.createElement('td');
    row.className = 'leaderboard__row';
    cell1.innerText = name;
    cell1.className = 'leaderboard__cell';
    cell2.innerText = val;
    cell2.className == 'leaderboard__cell';
    row.appendChild(cell1);
    row.appendChild(cell2);
    table.appendChild(row);
}

function startDataListener(){
    readDatabase('clickyclick', dataLoaded);
}
function dataLoaded(data){
    let entries =  Object.entries(data)
    entries.sort((x, y) => y[1] - x[1])
    Controller.data = entries;
    buildLeaderboard(entries);
}

startDataListener();
startGame();

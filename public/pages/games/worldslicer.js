class Styles {
    static colorPrimary = getComputedStyle(document.querySelector(':root')).getPropertyValue('--color-primary');
    static colorSecondary = getComputedStyle(document.querySelector(':root')).getPropertyValue('--color-secondary');
    static colorRed = getComputedStyle(document.querySelector(':root')).getPropertyValue('--color-red');
    static colorQuinary = getComputedStyle(document.querySelector(':root')).getPropertyValue('--color-quinary');
    static textLarge = getComputedStyle(document.querySelector(':root')).getPropertyValue('--text-large');
    static textDefault = getComputedStyle(document.querySelector(':root')).getPropertyValue('--text-default');
}
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
    redraw = function (elements, backgroundElements) { 
        this.ctx.clearRect(0, 0, this.width, this.height);
        for(let i = 0; i < backgroundElements.length; i += 1){
            for(let j = 0; j < backgroundElements[i].length; j += 1){
                backgroundElements[i][j].draw(this.ctx);
            }
        }
        for(let i = 0; i < elements.length; i += 1){
            elements[i].draw(this.ctx);
        }
    };

}

class Controller {
    canvas;
    backgroundElements;
    elements;
    scale;
    playerOnLand;
    static launchGame() {
        this.elements = [];
        this.backgroundElements = [[]];
        this.scale = 4;
        this.canvas = new Canvas('.game-container');
        addClickListener(this.canvas);
        var tempThis = this
        this.homeScreen();
        setInterval(function () {tempThis.canvas.redraw(tempThis.elements, tempThis.backgroundElements)}, 100);
    }
    static homeScreen() {
        this.elements = [];
        this.backgroundElements = [[]]
        this.elements.push(new StartGame(this.canvas.ctx, 200, 100));
    }
    static startGame() {
        this.backgroundElements = [[]];
        this.elements = [];
        this.buildBackground();
        this.playerOnLand = false;
        this.elements.push(new Player(Math.floor(this.canvas.width / 2 / this.scale), Math.floor(this.canvas.height * 9 / 10 / this.scale)));
        for(let i = 0; i < 50; i += 1){
            this.elements.push(new Enemy(Math.floor(this.canvas.width / 3 / this.scale), Math.floor(this.canvas.height * 1 / 2 / this.scale)));
        }
    }

    static buildBackground(){
        for(let i = 0; i < this.canvas.width / this.scale; i += 1) {
            this.backgroundElements[i] = []
            for(let j = 0; j < this.canvas.height/this.scale; j += 1){
                this.backgroundElements[i].push(new Tile(i,j));
            }
        }
        
    }
    static checkClick(posX, posY){
        for(let i = 0; i < this.elements.length; i += 1) {
            if(this.elements[i].checkClick){
                this.elements[i].checkClick(posX, posY);
            }
        }
    }

    static playerHit(player){
        let backgroundElement = this.backgroundElements[player.posX][player.posY];
        if(!backgroundElement) {
            return -1;
        }
        if(backgroundElement.isLand) {
            backgroundElement.color = Styles.colorRed;
            this.playerOnLand = true;
            return 1;
        } else {
            if(this.playerOnLand){
                let destroyer = new TheDestroyer(this.elements, this.backgroundElements, player.posX, player.posY);
                destroyer.destroy();
            }
            this.playerOnLand = false;
            return 0;
        }
    }
    
    static enemyHit(enemy){
        let backgroundElement = this.backgroundElements[Math.round(enemy.posX)][Math.round(enemy.posY)];
        if(!backgroundElement || !backgroundElement.isLand) {
            return -1;
        }
        if(backgroundElement.color == Styles.colorRed) {
            this.endGame();
        }
    }
    static endGame(){
        //this.backgroundElements = this.backgroundElements.filter(function(e) {return !(e instanceof Circle || e instanceof PreCircle)})
        this.elements = [];
        this.backgroundElements.push(new EndGameText());
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

class EndGameText {
    constructor(){
    }
    draw(ctx) {
        ctx.fillStyle = Styles.colorPrimary;
        ctx.textAlign = 'center';
        ctx.font = Styles.textLarge + ' serif';
        ctx.fillText("Game Ended", ctx.canvas.clientWidth/2, ctx.canvas.clientHeight * 1/4);
    }
}

function addClickListener(){
    document.querySelector('.game-canvas').addEventListener('click', function(event) {
        Controller.checkClick(event.offsetX, event.offsetY);
    }, false);
}

function distance(x1, y1, x2, y2) {
    return (Math.sqrt(Math.pow(x1-x2,2) + Math.pow(y1-y2,2)))
}

class Tile {
    posX;
    posY;
    color;
    isLand;
    constructor(posX, posY) {
        this.posX = posX;
        this.posY = posY;
        this.isLand = (distance(this.posX, this.posY, Controller.canvas.width/2/Controller.scale, Controller.canvas.height/2/Controller.scale) < 50);
        if(this.isLand){
            this.color = 'white';
        } else {
            this.color = Styles.colorPrimary;
        }
    }
    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.posX * Controller.scale, this.posY * Controller.scale, Controller.scale, Controller.scale);
    }
}

class TheDestroyer {
    elements;
    backgroundElements;
    checked = [[]]
    startPosX;
    startPosY;
    checkQueue;
    constructor(elements, backgroundElements, startPosX, startPosY) {
        this.elements = elements;
        this.backgroundElements = backgroundElements;
        this.buildChecked();
        this.startPosX = startPosX;
        this.startPosY = startPosY;
        this.checkQueue = [];
    }
    destroy() {
        for(let i = 0; i < this.elements.length; i += 1){
            if(this.elements[i] instanceof Enemy){
                this.checkQueue.push({'x':Math.round(this.elements[i].posX), 'y':Math.round(this.elements[i].posY)})
                while(this.checkQueue.length > 0){
                    let next = this.checkQueue.pop();
                    this.enemyCheckAround(next['x'], next['y']);
                }                
            }
        }
        this.monch();
    }
    buildChecked() {
        this.checked = [[]];
        for(let i = 0; i < this.backgroundElements.length; i += 1){
            this.checked.push([])
            for(let i2 = 0; i2 < this.backgroundElements[0].length; i2 += 1){
                this.checked[i].push(false);
            }
        }
    }

    enemyCheckAround(posX, posY){
        for(let i = -1; i < 2; i += 1) {
            for(let i2 = -1; i2 < 2; i2 += 1) {
                let x = posX + i;
                let y = posY + i2;
                if(!this.backgroundElements[x] || !this.backgroundElements[x][y]){
                    continue;
                }
                if(this.checked[x][y]){
                    continue;
                }
                let backgroundElement = this.backgroundElements[x][y];
                if(backgroundElement.color == Styles.colorRed){
                    this.checked[x][y] = false;
                    continue;
                }
                if(backgroundElement.isLand) {
                    this.checked[x][y] = true;
                    this.checkQueue.push({'x':x,'y':y});
                }
            }
        }
    }

    monch() {
        for(let i = 0; i < this.checked.length; i += 1){
            for(let i2 = 0; i2 < this.checked[i].length; i2 += 1){
                let backgroundElement = this.backgroundElements[i][i2];
                if(!this.checked[i][i2] && backgroundElement.isLand){
                    backgroundElement.isLand = false;
                    backgroundElement.color = Styles.colorPrimary;
                }
            }
        }
    }
}

class Player {
    posX; 
    posY; 
    dX;
    dY;
    size;
    constructor(posX, posY) {
        this.posX = posX;
        this.posY = posY;
        this.size = 10;
        this.dX = 0;
        this.dY = -5;
    }
    draw(ctx) {
        ctx.fillStyle = Styles.colorRed;
        ctx.fillRect(this.posX * Controller.scale, this.posY * Controller.scale, Controller.scale, Controller.scale);
        this.posX += this.dX;
        this.posY += this.dY;
        let interaction = Controller.playerHit(this);
        if(interaction == -1){
            this.posX -= this.dX;
            this.posY -= this.dY;
        }
    }
}

class Enemy {
    posX;
    posY;
    dX; 
    dY;
    size;
    speedBase;
    speedMultiplier;
    constructor(posX, posY){
        this.speedBase = 0.2;
        this.speedMultiplier = 1;
        this.posX = posX; 
        this.posY = posY;
        this.size = 10;
        this.newSpeed();
    }
    draw(ctx){
        ctx.fillStyle = 'green';
        ctx.fillRect(this.posX * Controller.scale, this.posY * Controller.scale, Controller.scale, Controller.scale);
        this.posX += this.dX;
        this.posY += this.dY;
        let interaction = Controller.enemyHit(this);
        if(interaction == -1){
            let prevPosX = Math.round(this.posX - this.dX);
            let prevPosY = Math.round(this.posY - this.dY);
            let currentPosX = Math.round(this.posX);
            let currentPosY = Math.round(this.posY);
            if(currentPosX != prevPosX) {
                this.dX = -this.dX;
            }
            if(currentPosY != prevPosY){
                this.dY = -this.dY;
            }
            this.posX = prevPosX+Math.round(this.dX);
            this.posY = prevPosY+Math.round(this.dY);
        }
    }

    newSpeed(){
        this.dX = this.speedMultiplier * (Math.random() - 0.5);
        this.dY = this.speedMultiplier * (Math.random() - 0.5);
    }
    
}

Controller.launchGame();

//Import map from .csv
//maps scale by size
//Keybinds
//

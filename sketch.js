var canvas;
var context;
var keys = {};
const keyCode = {
    left: 37,
    up: 38,
    right: 39,
    down: 40,
    space: 32,
    r: 82
}
canvas = document.getElementById('canvas');
var framesByImage = 5;
var mapChanged = false;
var youWin = false;
var saved = false;
var maps = {
    "0,0": undefined
}

var currentMap = "0,0";

var character = {
    spriteX: 0,
    spriteY: 0,
    width: 100,
    height: 160,
    moveSpeed: 7,
    positionX: canvas.width/2,
    positionY: canvas.height/2,
    moving: false,
    currentSprite: 0,
    direction: 0,
    alive: true
}

var sprites = {
    dirtPatch: new Image(),
    flowers: new Image(),
    characterMovement: new Image(),
    grass: new Image(),
    lake: new Image(),
    plant: new Image(),
    tree: new Image(),
    well: new Image(),
}

for (var spriteName in sprites) {
    sprites[spriteName].src = "sprites/" + spriteName + ".png";
}

function restart() {
    mapChanged = false;
    youWin = false;
    maps = {
      "0,0": undefined
    }
    currentMap = "0,0";
    character.positionX = canvas.width/2;
    character.positionY = canvas.height/2;
    character.direction = 0;
    mapGenerate();
}

window.onkeyup = function (e) {
    if (e.keyCode == keyCode.r) restart();
    keys[e.keyCode] = false;
}
window.onkeydown = function (e) {
    keys[e.keyCode] = true;
}


context = canvas.getContext('2d');

function drawContent() {
    context.textAlign = "center";
    var pattern = context.createPattern(sprites.grass, 'repeat');
    context.fillStyle = pattern;
    context.fillRect(0, 0, 4000, 4000);
}

// this is the draw function for the bg

function drawCharacter(){
   if (character.alive && !youWin) {
  
      if (character.moving){
         if (framesByImage == 0) {
            character.currentSprite++;
            framesByImage = 5;
      } else {
          framesByImage--;
      }
      if (character.currentSprite >= 3 && framesByImage == 0) {
          character.currentSprite = 0;
          framesByImage = 5;
      }
  } else {
        character.currentSprite = 0;
  }
 } else {
   context.drawImage(sprites.gameOver, 0, 0, sprites.gameOver.width, sprites.gameOver.height, canvas.width/2 - sprites.gameOver.width/2, canvas.height/2 - sprites)
 }
}


function draw() {
  clearCanvas();
  context.beginPath();
  drawContent();
  drawCharacter();
 
  // keyPressed();
}

// here he generates the enemies
// then generates the map
// then the character attack

function clearCanvas () {
  canvas.width = canvas.width;
}

function mapGenerate() {
    var x = 0;
    var y = 0;
    var map = [];
    for (x = 0; x < canvas. width / 192; x++) {
        map[x] = [];
        for (y = 0; y < canvas.height / 108; y++) {
            var randomNumber = Math.floor(Math.random() * 10000);
            if (randomNumber > 9900) {
        map[x][y] = "dirtPatch";
          } else if (randomNumber > 9800) {
        map[x][y] = "lake";
          } else if (randomNumber > 9700) {
        map[x][y] = "tree";
          } else if (randomNumber > 8500) {
        map[x][y] = "well";
          } else if (randomNumber > 8000) {
        map[x][y] = "flowers";
          } else if (randomNumber > 7750) {
        map[x][y] = "plant";
          } else {
            map[x][y] = undefined;
      }
    }
  }
}

function characterControls() {
  var directionX = 0
  var directionY = 0
  if (keys[keyCode.left]) {
    directionX += -character.moveSpeed;
    character.direction = 3; //left
  }
  if (keys[keyCode.right]) {
    directionX += character.moveSpeed;
    character.direction = 1; //right
  }
  if (keys[keyCode.up]) {
    directionY += -character.moveSpeed;
    character.direction = 2; //up
  }
  if (keys[keyCode.down]) {
    directionY += character.moveSpeed;
    character.direction = 0; //down
  }
  if (directionX == 0 && directionY == 0) {
    character.moving = false;
  } else {
    character.moving = true;
  }
  character.positionX += directionX;
  character.positionY += directionY;
}

function characterMove() {
  var thisMap = currentMap.split(',');
  if (character.positionX < 0) {
    character.positionX = canvas.width - character.width;
        thisMap = [ parseInt(thisMap[0]) - 1 , thisMap[1]];
        mapChanged = true;
    } else if (character.positionX > canvas.width - character.width) {
        character.positionX = 0;
        thisMap = [ parseInt(thisMap[0]) + 1, thisMap[1]];
        mapChanged = true;
    } else if (character.positionY < 0) {
        character.positionY = canvas.height - character.height;
        thisMap = [thisMap[0], parseInt(thisMap[1]) - 1];
        mapChanged = true;
    } else if (character.positionY > canvas.height - character.height) {
        character.positionY = 0;
        thisMap = [thisMap[0], parseInt(thisMap[1]) + 1];
        mapChanged = true;
    }
    currentMap = thisMap[0] + "," + thisMap[1];
}

function load() {
    var gameState = JSON.parse(window.localStorage.getItem('gameState'));
    if ( gameState != undefined) {
        character = gameState.character;
        maps = gameState.maps;
        currentMap = gameState.currentMap;
        youWin = gameState.youWin;
        return true;
    } else {
        return false;
    }
}

function save() {
    var gameState = {
        character: character,
        maps: maps,
        currentMap: currentMap,
        youWin: youWin
    }
    window.localStorage.setItem('gameState', JSON.stringify(gameState));
    saved = true;
}


function main() {
    if (character.alive && !youWin) {
      characterMove();
    }
    if (mapChanged) {
        if (maps[currentMap] == undefined) {
            mapGenerate();
      }
    }
    var pressingButton = false;
    for (var key in keys) {
        if (keys[key] == true) pressingButton = true;
    }
    if (!pressingButton && saved == false) {
        save();
    } else if (pressingButton){
        saved = false;
    }
    draw();
}

loaded = load();
if (!loaded) mapGenerate();
draw();
setInterval(main, 17);

// function keyPressed(){
//   if(keyIsDown(UP_ARROW)) {
//     y-=speed;
//   }
//   if(keyIsDown(DOWN_ARROW)) {
//     y+=speed;
//   }
//   if(keyIsDown(RIGHT_ARROW)) {
//     x+=speed;
//   }
//   if(keyIsDown(LEFT_ARROW)) {
//     x-=speed;
//   }
// }


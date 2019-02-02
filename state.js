const aStar = require('a-star');
const _ = require('lodash');
const {states} = require('./gamestates/example-states');
const {getIndexOfValue} = require('./util');

let gameState;

const update = (newState) => {
    gameState = newState;
    if (gameState.you.name.toUpperCase() == 'BBS' && gameState.turn % 25 == 0) {
      //console.log(JSON.stringify(gameState, null, 2));
    }
};
const getTurn = () => {
   return gameState.turn;
}
const getMyPosition = () => {
   return gameState.you.body[0];
}
const getMyName = () => {
   return gameState.you.name;
}
const getSnakes = () => {
   return gameState.board.snakes;
}

const getMyLength = () => {
   return gameState.you.body.length;
}

const getFoodPoints = () => {
   return gameState.board.food;
}

const getSnakeLength = (name) => {
   // console.log(gameState.board.snakes);
   const snake = gameState.board.snakes.filter((snake) => snake.name == name)[0];
   return snake.body.length;
}

const moveInfo = (snakeName, move) => {
   // Returns one of:
   // {type: "wall"}
   // {type: "body"}
   // {type: "contested", snakeLengths: [3, 4], food: false} - enemy snake(s) neighbor this square
   // {type: "uncontested", food: true} - uncontested square
   let returnVal = {type: "unknown"};


   let snake = gameState.board.snakes.filter((snake) => snake.name == snakeName)[0];
   let { x, y } = snake.body[0];

   let newXY = move == "up" ? {x, y: y-1} :
                move == "right" ? {x: x+1, y} :
                move == "down" ? {x, y: y+1} :
                move == "left" ? {x: x-1, y} : null;

   returnVal.newXY = newXY;

   if (newXY == null) {
      throw "Move " + move + " not recognized";
   }

   let newX = newXY.x;
   let newY = newXY.y;

   console.log(getTurn());
   console.log("My position: " + JSON.stringify(getMyPosition()));
   console.log("considering spot: " + JSON.stringify(newXY));

   if(newX >= gameState.board.width
      || newX < 0
      || newY >= gameState.board.height
      || newY < 0){
         if (returnVal.type == "unknown") returnVal.type = "wall";
         console.log("Move found to collide with wall");
   }

   gameState.board.snakes.forEach((boardSnake) => {
   //This will not consider the tip of a tail as a body collision, hence the -1 here:
   for (let i = 0; i < boardSnake.body.length - 1; i++) {
      if (_.isEqual(boardSnake.body[i], newXY)){
         if (returnVal.type == "unknown") returnVal.type = "body";
         console.log("Move found to collide with body of snake: " + boardSnake.name);
      }
   }
   });
   
   const neighbors = rectilinearNeighbors(newXY);

   gameState.board.snakes.forEach((boardSnake) => {
      if (boardSnake.name != snakeName){
         // console.log("Checking snake " + boardSnake.name);
         // console.log("Considering point " + JSON.stringify(newXY));
         // console.log("neighbors of this point: " + JSON.stringify(neighbors));
         // console.log("Snake head is at" + JSON.stringify(boardSnake.body[0]));
         // console.log("getIndexOfValue(neighbors, boardSnake.body[0]) == " + getIndexOfValue(neighbors, boardSnake.body[0]));
         if(getIndexOfValue(neighbors, boardSnake.body[0]) > -1){
            console.log("Move found to be contested by: " + boardSnake.name);
            if (returnVal.type == "unknown") returnVal.type = "contested";
            if (!returnVal.snakeLengths) {
               returnVal.snakeLengths = [];
            }
            returnVal.snakeLengths.push(boardSnake.body.length);
            console.log("returnVal.snakeLengths == " + returnVal.snakeLengths);
         }
      }
   });


   if(returnVal.type == "unknown"){
      returnVal.type = "uncontested";
      console.log("Move is free and uncontested");
   }

   returnVal.food = getIndexOfValue(gameState.board.food, newXY) > -1;

   return returnVal;
}

const rectilinearNeighbors = function(XY) {
    const x = XY.x;
    const y = XY.y;

    return [
        {x: x - 1, y}, // left cell
        {x: x + 1, y}, // right cell
        {x, y: y + 1}, // down cell
        {x, y: y - 1} // up cell
    ];
}

const getMove = function(start, finish){
   let dx = finish.x - start.x;
   let dy = finish.y - start.y;
   if(dx == 1){
      return 'right';
   } else if (dx == -1){
      return 'left';
   } else if (dy == 1){
      return 'down';
   } else if (dy == -1){
      return 'up';
   }  
}

const getAllOccupied = function (){
   let returnArr = [];
   gameState.board.snakes.forEach((snake) => {
      snake.forEach((spot) => {
         returnArr.push(spot);
      });
   });
   return returnArr;
}

const safeMove = function(){
   console.log("safeMove default engaged")
   const myName = getMyName();
   const moves = ['left','right','up','down'];
   let bestMove = null;

   moves.forEach((move) => {
      let info = moveInfo(myName, move)
      if (info.type == 'contested'){
         if (getMyLength() >= Math.max(...info.snakeLengths)){
            console.log("Taking point contested by smaller snake by moving: " + move);
            bestMove = move;
            return;
         }
      }
   });
   if (bestMove != null) return bestMove;

   moves.forEach((move) => {
      let info = moveInfo(myName, move)
      if (info.type == 'uncontested'){
         console.log("Taking uncontested point by moving: " + move);
         bestMove = move;
         return;
      }
   });
   if (bestMove != null) return bestMove;

   moves.forEach((move) => {
      let info = moveInfo(myName, move)
      if (info.type == 'contested'){
         console.log("Taking contested point that might not end so well: " + move);
         bestMove = move;
         return;
      }
   });
   if (bestMove != null) return bestMove;

   console.log("No safe move could be found, defaulting to up. Sorry snakey :[");
   return 'up';
}

const nextToFood = function (point) {
   const foodPoints = getFoodPoints();
   const neighbors = rectilinearNeighbors(point);
   let returnVal = false;
   neighbors.forEach((neighborPoint) => {
      if (getIndexOfValue(foodPoints, neighborPoint) > -1) {
         returnVal = true;
         return;
      }
   });
   return returnVal;
}

const pointIsContestedByLargerSnake = function (point) {
   const myName = getMyName();
   const neighbors = rectilinearNeighbors(point);
   let returnVal = false;
   getSnakes().forEach((snake) => {
      if (snake.name != myName){
         console.log("checking snake " + snake.name);
         console.log("point neighbors are" + JSON.stringify(neighbors));
         console.log("snake head is at " + JSON.stringify(snake.body[0]));
         if (getIndexOfValue(neighbors, snake.body[0]) > -1) {
            console.log("snake head was found in neighbor list");
            if (snake.body.length >= getMyLength()){
               console.log("snake is too large to ignore");
               returnVal = true;
               return;
            }
         } else {
            console.log("Snake head was not found in neighbor list");
         }
      }
   });
   return returnVal;
}

const getTakenPoints = function () {
   let returnArr = [];
   getSnakes().forEach((snake) => {
      returnArr = returnArr.concat(snake.body);
   });
   return returnArr;
}

const pointIsTaken = function (point) {
   const takenPoints = getTakenPoints();
   return (getIndexOfValue(takenPoints, point) > -1);
}

module.exports = {
    update,
    moveInfo,
    getTurn,
    getMyPosition,
    getMyName,
    getMove,
    getFoodPoints,
    getSnakeLength,
    safeMove,
    getAllOccupied,
    getSnakes,
    nextToFood,
    pointIsContestedByLargerSnake,
    pointIsTaken,
    getTakenPoints
};


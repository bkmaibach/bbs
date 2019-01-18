let gameState;

let exampleState = {  
    "game":{  
       "id":"9b85fabc-7e36-4708-8674-c12df577cf98"
    },
    "turn":4,
    "board":{  
       "height":19,
       "width":19,
       "food":[  
          {  
             "x":5,
             "y":16
          },
          {  
             "x":11,
             "y":13
          },

       ],
       "snakes":[  
          {  
             "id":"3fe966d8-4f12-461c-b998-037fa388ab1e",
             "name":"snek2",
             "health":96,
             "body":[  
                {  
                   "x":17,
                   "y":4
                },
                {  
                   "x":16,
                   "y":4
                },
                {  
                   "x":16,
                   "y":5
                }
             ]
          },
          {  
             "id":"114617e0-d856-4055-a140-20079edd8ed1",
             "name":"snek4",
             "health":96,
             "body":[  
                {  
                   "x":16,
                   "y":12
                },
                {  
                   "x":15,
                   "y":12
                },
                {  
                   "x":14,
                   "y":12
                }
             ]
          }
       ]
    },
    "you":{  
       "id":"3fe966d8-4f12-461c-b998-037fa388ab1e",
       "name":"snek2",
       "health":96,
       "body":[  
          {  
             "x":17,
             "y":4
          },
          {  
             "x":16,
             "y":4
          },
          {  
             "x":16,
             "y":5
          }
       ]
    }
 }

const update = (newState) => {
    gameState = newState;
};

const moveInfo = (XY, move) => {
    // Returns one of:
    // {type: "wall"}
    // {type: "body"}
    // {type: "contested", snakeLengths: [3, 4], food: false} - enemy snake(s) neighbors this square
    // {type: "uncontested", food: true} - uncontested square
    
    let x = XY.x;
    let y = XY.y;

    let newXY = move == "up" ? {x, y: y-1} :
                move == "right" ? {x: x+1, y} :
                move == "down" ? {x, y: y+1} :
                move == "left" ? {x: x-1, y} : null;

    if (newXY == null) {
        throw "Move " + move + " not recognized";
    }

    let newX = newXY.x;
    let newY = newXY.y;

    if(newX > gameState.board.width
        || newX < 1
        || newY > gameState.board.height
        || newY < 1){
            return {type: "wall"};
    }

    gameState.board.snakes.forEach((snake) => {
        const foundAtIndex = snake.body.indexOf(newXY);
         //will not return body if it is occupied by the tail of a snake
        if (foundAtIndex > -1 && foundAtIndex != snake.body.length - 1){
            return {type: "body"}
        }
    });

    let returnVal = {type: "unknown"};
    const neighbors = rectilinearNeighbors(newXY);
    const ourName = gameState.you.name;
    gameState.board.snakes.forEach((snake) => {
        if (snake.name != ourName){
            if(neighbors.indexOf(snake.body[0]) > -1){
                returnVal.type = "contested";
                returnVal.snakeLengths.push(snake.body.length);
            }
        }
    });

    returnVal.type == returnVal.type == "unknown" ? "uncontested" : returnVal.type;

    returnVal.food = gameState.board.food.indexOf(newXY) > -1;

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

const rectilinearDistance = function(a, b) {
    var dx = b[0] - a[0], dy = b[1] - a[1];
    return Math.abs(dx) + Math.abs(dy);
};

module.exports = {
    init,
    update,
    moveInfo
};


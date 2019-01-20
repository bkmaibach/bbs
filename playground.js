var ndarray = require('ndarray')
var createPlanner = require('l1-path-finder')

const exampleState = {  
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
 
 
//Create a maze as an ndarray
var maze = ndarray([
  0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0,
  0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0,
  0, 1, 0, 1, 1, 1, 0, 0, 1, 0, 1, 1, 1, 0, 0,
  0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0,
  0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0,
  0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0,
  0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1,
  0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0,
  0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0,
  0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0,
  0, 1, 0, 1, 1, 1, 0, 0, 1, 0, 1, 1, 1, 0, 0,
  0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0,
  0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0,
  0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0,
  0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 1, 0
], [15, 15])



function stepsInPath (plannerPath) {
    let corners = [];
    let steps = [];
    for (let i = 0; i < plannerPath.length - 1; i+=2){
        //console.log(JSON.stringify({x: plannerPath[i]+1, y: plannerPath[i+1]+1}));
        corners.push({x: plannerPath[i]+1, y: plannerPath[i+1]+1});
    }
    
    for (let k = 0; k < corners.length; k++){
        let deltaX;
        let deltaY
        if (k < corners.length - 1 ){
            deltaX = corners[k+1].x - corners[k].x;
            deltaY = corners[k+1].y - corners[k].y;
        } else {
            deltaX = 0;
            deltaY = 0
        }
    
        if(deltaX > 0 ){
            for (let j = 0; j < deltaX; j++) {
                steps.push({x: corners[k].x + j, y: corners[k].y});
            }
        } else if (deltaX < 0) {
            for (let j = 0; j > deltaX; j--) {
                steps.push({x: corners[k].x + j, y: corners[k].y});
            }
        } else if (deltaY > 0) {
            for (let j = 0; j < deltaY; j++) {
                steps.push({x: corners[k].x, y: corners[k].y + j});
            }
        } else if (deltaY < 0) {
            for (let j = 0; j > deltaY; j++) {
                steps.push();
            }
        }
    }
    //steps.shift();
    steps.push(corners[corners.length-1]);
    return steps;
}

var collisionArray = {
    knownCollisions: ndarray([
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
  ], [15, 15]),
  knownTailDodges: [],
  addCollisionPoint: function (xy) {
    
    this.knownCollisions.set((xy.x - 1), (xy.y - 1), 1);
  },
  addKnownTailDodge: function (xy) {
    knownTailDodges.push(xy);
  },
  isKnownTailDodge: function (xy) {
    return this.knownTailDodges.indexOf(xy) > -1;
  }
}

function getShortestPath (gameState, startXY, endXY) {
    //Create path planner
    var planner = createPlanner(collisionArray.knownCollisions)
    
    //Find path
    var path = []
    var dist = planner.search((startXY.x-1),(startXY.y - 1),  (endXY.x-1),(endXY.y-1),  path);
    const steps = stepsInPath(path);

    const snakes = gameState.board.snakes;
    for(let i = 1, stepsLength = steps.length; i < stepsLength; i++){
        for(let j = 0, numSnakes = snakes.length; j < numSnakes; j++){
            let segmentNumber = snakes[j].body.indexOf(steps[i]);
            if(segmentNumber > -1  && !collisionArray.isKnownTailDodge(steps[i])){
                const stepsToOccupy = i;
                const stepsToVacate = snakes[j].body.length - segmentNumber;
                const tailDodge = stepsToOccupy >= stepsToVacate;
                if (!tailDodge){
                    headToCollisionSection = snakes[j].body.slice(0, j + 1);
                    for (let k = 0, headToCollisionLength = headToCollisionSection.length; k < headToCollisionLength; k++){
                        collisionArray.addCollisionPoint(headToCollisionSection[k]);
                    }
                    return getShortestPath(gameState, startXY, endXY);
                } else {
                    const collisionThroughTailSection = snakes[j].slice(segmentNumber, snakes[j].body.length);
                    for (let k = 0, collisionThroughTailLength = collisionThroughTailSection.length; k < collisionThroughTailLength; k++){
                        collisionArray.knownTailDodges.addKnownTailDodge(snakes[j].body[k]);
                    }
                }
            }
        }
    }
    return steps;
};


//Log output
//console.log('path length =', dist)
//console.log('steps= ', steps)
for (let x = 0; x < 100000; x++){
    let array = []
    array.push(getShortestPath(exampleState, {x:1 , y:1}, {x:15 , y:15}));
    //console.log(JSON.stringify());
}




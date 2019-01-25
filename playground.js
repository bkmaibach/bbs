const ndarray = require('ndarray');
const createPlanner = require('l1-path-finder');
const _ = require('lodash');
const states = require('./exampleStates').states;

 
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
    
    this.knownCollisions.set((xy.x), (xy.y), 1);
  },
  addKnownTailDodge: function (xy) {
    knownTailDodges.push(xy);
  },
  isKnownTailDodge: function (xy) {
    return getIndexOfValue(this.knownTailDodges, xy) > -1;
  }
}

function getShortestPath (gameState, startXY, endXY) {
    //Create path planner
    var planner = createPlanner(collisionArray.knownCollisions)
    
    //Find path
    var path = []
    var dist = planner.search((startXY.x),(startXY.y),  (endXY.x),(endXY.y),  path);
    const steps = stepsInPath(path);

    const snakes = gameState.board.snakes;
    for(let i = 1, stepsLength = steps.length; i < stepsLength; i++){
        for(let j = 0, numSnakes = snakes.length; j < numSnakes; j++){
            let segmentNumber = getIndexOfValue(snakes[j].body, steps[i]);;

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

//similar to array.indexOf but works on value not reference
function getIndexOfValue(array, entry){
    for (let i = 0; i < array.length; i++) {
        if (_.isEqual(array[i], entry)){
           return i;
        }
    }
    return -1;
}


//Log output
//console.log('path length =', dist)
//console.log('steps= ', steps)
for (let x = 0; x < 100000; x++){
    let array = []
    array.push(getShortestPath(exampleState, {x:1 , y:1}, {x:15 , y:15}));
    //console.log(JSON.stringify());
}




// unnamed
const _ = require('lodash');
const appRoot = require('app-root-path');
const winston = require('winston');
const createPlanner = require('l1-path-finder');
const ndarray = require('ndarray');

let Finder = class {

    

    constructor(xy, gameState) {
        this.snakeHead = xy;
        this.gameState = gameState;

        this.knownCollisions = ndarray([
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
        ], [15, 15]);

        this.knownTailDodges = [];

    }

    getShortestPath ( endXY) {
        //Create path planner
        var planner = createPlanner(this.knownCollisions);
        
        //Find path
        var path = []
        var dist = planner.search((this.snakeHead.x),(this.snakeHead.y),  (endXY.x),(endXY.y),  path);
        const steps = this.stepsInPath(path);
    
        const snakes = this.gameState.board.snakes;
        for(let i = 1, stepsLength = steps.length; i < stepsLength; i++){
            for(let j = 0, numSnakes = snakes.length; j < numSnakes; j++){
                let segmentNumber = this.getIndexOfValue(snakes[j].body, steps[i]);;
    
                if(segmentNumber > -1  && !this.isKnownTailDodge(steps[i])){
                    const stepsToOccupy = i;
                    const stepsToVacate = snakes[j].body.length - segmentNumber;
                    const tailDodge = stepsToOccupy >= stepsToVacate;
                    if (!tailDodge){
                        let headToCollisionSection = snakes[j].body.slice(0, j + 1);
                        for (let k = 0, headToCollisionLength = headToCollisionSection.length; k < headToCollisionLength; k++){
                            this.addCollisionPoint(headToCollisionSection[k]);
                        }
                        return this.getShortestPath( endXY);
                    } else {
                        const collisionThroughTailSection = snakes[j].slice(segmentNumber, snakes[j].body.length);
                        for (let k = 0, collisionThroughTailLength = collisionThroughTailSection.length; k < collisionThroughTailLength; k++){
                            this.addKnownTailDodge(snakes[j].body[k]);
                        }
                    }
                }
            }
        }
        return steps;
    };

    addCollisionPoint(xy) {
        this.knownCollisions.set((xy.x - 1), (xy.y - 1), 1);
    }

    addKnownTailDodge(xy){
        this.knownTailDodges.push(xy);
    }

    isKnownTailDodge(xy){
        return this.getIndexOfValue(this.knownTailDodges, xy) > -1;
    }
    
    //similar to array.indexOf but works on value not reference
    getIndexOfValue(array, entry){
        for (let i = 0; i < array.length; i++) {
            if (_.isEqual(array[i], entry)){
               return i;
            }
        }
    }

    stepsInPath (plannerPath) {
        let corners = [];
        let steps = [];
        for (let i = 0; i < plannerPath.length - 1; i+=2){
            //console.log(JSON.stringify({x: plannerPath[i]+1, y: plannerPath[i+1]+1}));
            corners.push({x: plannerPath[i], y: plannerPath[i+1]});
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
   
    
    

  };
 
 module.exports = {
     Finder
 };
  
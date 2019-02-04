const appRoot = require('app-root-path');
const winston = require('winston');
const createPlanner = require('l1-path-finder');
const ndarray = require('ndarray');
const {getIndexOfValue} = require('./util');
const _ = require('lodash');

let TailDodger = class {

    constructor(xy, gameState) {
        this.snakeHead = xy;
        this.state = gameState;
        this.steps = [];
        const height = gameState.getHeight();
        const width = gameState.getWidth();
        const numCells = height * width;
        let ndArrayParam = [];
        // The ND array requires an array of width * height 0's to start
        for(let i = 0; i < numCells; i++){
            ndArrayParam.push(0);
        }

        this.knownCollisions = ndarray(ndArrayParam, [height, width]);
        this.knownTailDodges = [];

    }

    getShortestPath ( endXY) {
        //Create path planner
        var planner = createPlanner(this.knownCollisions);

        //Find path
        var path = []
        var dist = planner.search((this.snakeHead.x),(this.snakeHead.y),  (endXY.x),(endXY.y),  path);
        const steps = this.stepsInPath(path);
    
        const snakes = this.state.getSnakes();
        for(let i = 1, stepsLength = steps.length; i < stepsLength; i++){
            for(let j = 0, numSnakes = snakes.length; j < numSnakes; j++){
                let possibleCollisionIndex = getIndexOfValue(snakes[j].body, steps[i]);;
    
                if(possibleCollisionIndex > -1  && !this.isKnownTailDodge(steps[i])){
                    const stepsToOccupy = i;
                    let stepsToVacate = snakes[j].body.length - possibleCollisionIndex;

                    if (this.state.nextToFood(snakes[j].body[0])){
                        console.log("Food next to " + snakes[j].name + " means an extra step is needed to vacate possible collision point");
                        stepsToVacate++;
                    }
                    
                    const tailDodge = stepsToOccupy >= stepsToVacate;
                    if (!tailDodge){
                        let headToCollisionSection = snakes[j].body.slice(0, possibleCollisionIndex+1);
                        // The following if statement prevents the algorithm from failing if the detected collision is a part of itself
                        // The head must be removed from the dangerous section because it will always be a part of any path
                        if (_.isEqual(headToCollisionSection[0], this.snakeHead)){
                            headToCollisionSection.shift();
                        }
                        for (let k = 0, headToCollisionLength = headToCollisionSection.length; k < headToCollisionLength; k++){
                            this.addCollisionPoint(headToCollisionSection[k]);
                        }
                        return this.getShortestPath(endXY);
                    } else {
                        //const collisionThroughTailSection = snakes[j].slice(possibleCollisionIndex, snakes[j].body.length);

                        for (let k = possibleCollisionIndex; k < snakes[j].body.length; k++){
                            this.addKnownTailDodge(snakes[j].body[k]);
                        }
                    }
                }
            }
        }
        if (typeof path[0] == 'undefined'){
            return null;
        }
        if (this.state.pointIsContestedByLargerSnake(steps[1])) {
            console.log("The first step of this path is contested by a snake of larger or equal size. Marking point and recalculating...");
            this.addCollisionPoint(steps[1]);
            return this.getShortestPath(endXY);
        }
        this.steps = steps;
        return steps;
    };

    addCollisionPoint(xy) {
        this.knownCollisions.set((xy.x), (xy.y), 1);
    }

    addKnownTailDodge(xy){
        this.knownTailDodges.push(xy);
    }

    isKnownTailDodge(xy){
        return getIndexOfValue(this.knownTailDodges, xy) > -1;
    }
    
    stepsInPath (plannerPath) {
        let cornersAndEnds = [];
        let steps = [];
        for (let i = 0; i < plannerPath.length - 1; i+=2){
            //console.log(JSON.stringify({x: plannerPath[i]+1, y: plannerPath[i+1]+1}));
            cornersAndEnds.push({x: plannerPath[i], y: plannerPath[i+1]});
        }
        
        for (let k = 0; k < cornersAndEnds.length; k++){
            let deltaX;
            let deltaY
            if (k < cornersAndEnds.length - 1 ){
                deltaX = cornersAndEnds[k+1].x - cornersAndEnds[k].x;
                deltaY = cornersAndEnds[k+1].y - cornersAndEnds[k].y;
            } else {
                deltaX = 0;
                deltaY = 0
            }
        
            if(deltaX > 0 ){
                for (let j = 0; j < deltaX; j++) {
                    steps.push({x: cornersAndEnds[k].x + j, y: cornersAndEnds[k].y});
                }
            } else if (deltaX < 0) {
                for (let j = 0; j > deltaX; j--) {
                    steps.push({x: cornersAndEnds[k].x + j, y: cornersAndEnds[k].y});
                }
            } else if (deltaY > 0) {
                for (let j = 0; j < deltaY; j++) {
                    steps.push({x: cornersAndEnds[k].x, y: cornersAndEnds[k].y + j});
                }
            } else if (deltaY < 0) {
                for (let j = 0; j > deltaY; j--) {
                    steps.push({x: cornersAndEnds[k].x, y: cornersAndEnds[k].y + j});
                }
            }
        }
        //steps.shift();
        steps.push(cornersAndEnds[cornersAndEnds.length-1]);
        return steps;
    } 

  };
 
 module.exports = {
    TailDodger
 };
  

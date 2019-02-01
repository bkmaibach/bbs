const _ = require('lodash');
const appRoot = require('app-root-path');
const winston = require('winston');
const createPlanner = require('l1-path-finder');
const ndarray = require('ndarray');
const {TailDodger} = require('./tail-dodger');
const {getIndexOfValue} = require('./util');

class TailDodgerSafe extends TailDodger{

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
                let possibleCollisionIndex = getIndexOfValue(snakes[j].body, steps[i]);;
    
                if(possibleCollisionIndex > -1  && !this.isKnownTailDodge(steps[i])){
                    const stepsToOccupy = i;
                    const stepsToVacate = snakes[j].body.length - possibleCollisionIndex;
                    const tailDodge = stepsToOccupy >= stepsToVacate;
                    if (!tailDodge){
                        this.addCollisionPoint(steps[i]);
                        return this.getShortestPath( endXY);
                    } else {
                        this.addKnownTailDodge(steps[i]);
                    }
                }
            }
        }
        if (typeof path[0] == 'undefined'){
            throw "EXCEPTION: no path could be found!";
        }
        this.steps = steps;
        return steps;
    };
  };
 
 module.exports = {
    TailDodgerSafe
 };
  